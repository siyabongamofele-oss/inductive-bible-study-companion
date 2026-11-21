import { GoogleGenAI, Type } from '@google/genai';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { STEP_DESCRIPTIONS, StudyStep } from '../types';

const MODEL = 'gemini-2.5-flash';
const MAX_BODY_BYTES = 64 * 1024;
const MAX_TEXT_LENGTH = 10_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const DEFAULT_RATE_LIMIT = 10;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

type AIRequest = Record<string, unknown> & { action?: string };

const send = (res: ServerResponse, status: number, body: Record<string, unknown>) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
};

const getClientKey = (req: IncomingMessage): string => {
  const forwarded = req.headers['x-forwarded-for'];
  const forwardedIp = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0]?.trim();
  return forwardedIp || req.socket.remoteAddress || 'unknown';
};

const checkRateLimit = (req: IncomingMessage, res: ServerResponse): boolean => {
  const now = Date.now();
  const key = getClientKey(req);
  const limit = Math.max(1, Number(process.env.AI_RATE_LIMIT_MAX || DEFAULT_RATE_LIMIT) || DEFAULT_RATE_LIMIT);
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  } else if (entry.count >= limit) {
    const retryAfter = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    res.setHeader('Retry-After', String(retryAfter));
    send(res, 429, { error: `Too many AI requests. Try again in ${retryAfter} seconds.` });
    return false;
  } else {
    entry.count += 1;
  }

  if (rateLimitStore.size > 5_000) {
    for (const [storedKey, storedEntry] of rateLimitStore) {
      if (storedEntry.resetAt <= now) rateLimitStore.delete(storedKey);
    }
  }
  return true;
};

const readBody = async (req: IncomingMessage): Promise<AIRequest | null> => {
  const chunks: Buffer[] = [];
  let bytes = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    bytes += buffer.length;
    if (bytes > MAX_BODY_BYTES) return null;
    chunks.push(buffer);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as AIRequest;
};

const textField = (body: AIRequest, field: string, limit = MAX_TEXT_LENGTH): string | null => {
  const value = body[field];
  return typeof value === 'string' && value.length <= limit ? value : null;
};

const listField = (body: AIRequest, field: string): string[] | null => {
  const value = body[field];
  if (!Array.isArray(value) || value.length > 50) return null;
  return value.every(item => typeof item === 'string' && item.length <= 2_000) ? value : null;
};

const instructions = `You are a careful coach for the Inductive Bible Study method. Guide users to observe the text before interpreting or applying it. Be respectful of differing Christian traditions, distinguish evidence from inference, acknowledge uncertainty, and never present generated historical or theological claims as certain when they are disputed.`;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        send(res, 403, { error: 'Cross-origin AI requests are not allowed.' });
        return;
      }
    } catch {
      send(res, 403, { error: 'Invalid request origin.' });
      return;
    }
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    send(res, 405, { error: 'Use POST for AI requests.' });
    return;
  }

  if (!checkRateLimit(req, res)) return;

  if (process.env.AI_ENABLED !== 'true') {
    send(res, 503, { error: 'AI features are disabled. Enable them only after confirming your provider and audience are eligible.' });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    send(res, 503, { error: 'AI is not configured. Add GEMINI_API_KEY to the server environment.' });
    return;
  }

  let body: AIRequest;
  try {
    const parsed = await readBody(req);
    if (!parsed) {
      send(res, 413, { error: 'Request is too large.' });
      return;
    }
    body = parsed;
  } catch {
    send(res, 400, { error: 'Request body must be valid JSON.' });
    return;
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    send(res, 400, { error: 'Request body must be a JSON object.' });
    return;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    switch (body.action) {
      case 'chat': {
        const history = body.history;
        const currentStep = body.currentStep;
        const passage = textField(body, 'passageContext', 5_000);
        if (!Array.isArray(history) || history.length < 1 || history.length > 20
          || !history.every(message => message && typeof message === 'object'
            && ['user', 'model'].includes((message as Message).role)
            && typeof (message as Message).text === 'string'
            && (message as Message).text.length <= 4_000)
          || !Object.values(StudyStep).includes(currentStep as StudyStep)
          || passage === null) {
          send(res, 400, { error: 'Chat request contains invalid or oversized fields.' });
          return;
        }
        const context = `Current study step: ${currentStep}\nGuidance: ${STEP_DESCRIPTIONS[currentStep as StudyStep]}\nPassage: ${passage || '(not provided)'}`;
        const contents = (history as Message[]).map((message, index) => ({
          role: message.role,
          parts: [{ text: index === history.length - 1 && message.role === 'user'
            ? `${context}\n\nUser message: ${message.text}`
            : message.text }]
        }));
        const result = await ai.models.generateContent({
          model: MODEL,
          contents,
          config: { systemInstruction: instructions }
        });
        send(res, 200, { text: result.text || 'The assistant returned an empty response.' });
        return;
      }
      case 'title': {
        const text = textField(body, 'text', 5_000);
        if (!text?.trim()) {
          send(res, 400, { error: 'Add a passage before requesting a paragraph title.' });
          return;
        }
        const result = await ai.models.generateContent({
          model: MODEL,
          contents: text,
          config: {
            systemInstruction: 'Create a paragraph title of no more than four words, using words from the passage and preserving their order. Return only the title.'
          }
        });
        send(res, 200, { text: result.text?.trim() || 'No title was generated.' });
        return;
      }
      case 'themes': {
        const passage = textField(body, 'passage', 5_000);
        const observations = listField(body, 'observations');
        const interpretations = listField(body, 'interpretations');
        if (passage === null || !observations || !interpretations) {
          send(res, 400, { error: 'Theme request contains invalid or oversized fields.' });
          return;
        }
        const result = await ai.models.generateContent({
          model: MODEL,
          contents: `Passage:\n${passage}\n\nObservations:\n${observations.join('\n') || '(none)'}\n\nInterpretations:\n${interpretations.join('\n') || '(none)'}\n\nIdentify three to five literary or theological themes and briefly explain the textual evidence for each. Flag interpretive uncertainty.`,
          config: { systemInstruction: instructions }
        });
        send(res, 200, { text: result.text || 'No themes were generated.' });
        return;
      }
      case 'bri': {
        const passage = textField(body, 'passage', 5_000);
        if (!passage?.trim()) {
          send(res, 400, { error: 'Add a passage before requesting background information.' });
          return;
        }
        const result = await ai.models.generateContent({
          model: MODEL,
          contents: `Based on this passage, suggest the likely author, approximate date, original audience, and place of writing. If the passage does not identify a detail, state that it is uncertain rather than inventing certainty.\n\n${passage}`,
          config: {
            systemInstruction: instructions,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                author: { type: Type.STRING },
                date: { type: Type.STRING },
                audience: { type: Type.STRING },
                location: { type: Type.STRING }
              },
              required: ['author', 'date', 'audience', 'location']
            }
          }
        });
        const bri = JSON.parse(result.text || '{}');
        if (!['author', 'date', 'audience', 'location'].every(key => typeof bri[key] === 'string')) {
          throw new Error('The model returned invalid background information.');
        }
        send(res, 200, { bri });
        return;
      }
      default:
        send(res, 400, { error: 'Unknown AI action.' });
    }
  } catch (error) {
    console.error('Gemini request failed:', error);
    send(res, 502, { error: 'The AI service could not complete this request. Please try again.' });
  }
}

type Message = { role: 'user' | 'model'; text: string };
