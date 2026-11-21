import { BRI, StudyStep } from '../types';

type Message = { role: 'user' | 'model'; text: string };

const requestAI = async <T>(body: Record<string, unknown>): Promise<T> => {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const result = await response.json().catch(() => ({})) as { error?: string } & T;
  if (!response.ok) {
    throw new Error(result.error || `AI request failed (${response.status}).`);
  }
  return result;
};

export const getGeminiResponse = async (
  history: Message[],
  currentStep: StudyStep,
  passageContext: string
): Promise<string> => {
  const result = await requestAI<{ text: string }>({
    action: 'chat',
    history,
    currentStep,
    passageContext
  });
  return result.text;
};

export const suggestParagraphTitle = async (text: string): Promise<string> => {
  const result = await requestAI<{ text: string }>({ action: 'title', text });
  return result.text;
};

export const suggestThemes = async (
  observations: string[],
  interpretations: string[],
  passage: string
): Promise<string> => {
  const result = await requestAI<{ text: string }>({
    action: 'themes',
    observations,
    interpretations,
    passage
  });
  return result.text;
};

export const suggestBRI = async (passage: string): Promise<BRI> => {
  const result = await requestAI<{ bri: BRI }>({ action: 'bri', passage });
  return result.bri;
};
