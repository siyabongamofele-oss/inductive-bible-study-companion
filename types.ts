export enum StudyStep {
  OBSERVATION = 'OBSERVATION',
  INTERPRETATION = 'INTERPRETATION',
  APPLICATION = 'APPLICATION',
  CHARTING = 'CHARTING'
}

export interface BRI {
  author: string;
  date: string;
  audience: string;
  location: string;
}

export interface StudySession {
  id: string;
  title: string;
  passage: string;
  currentStep: StudyStep;
  observations: string[];
  interpretations: string[];
  applications: string[];
  chartNotes: string;
  bri: BRI;
  createdAt: number;
}

export interface StudyContext {
  observations: string[];
  interpretations: string[];
  themes: string[];
  passage: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export const STEP_DESCRIPTIONS: Record<StudyStep, string> = {
  [StudyStep.OBSERVATION]: "What does the text say? (Who, What, Where, When). Do NOT ask 'Why'. Look for repeated words, contrasts, and atmosphere.",
  [StudyStep.INTERPRETATION]: "What did the text mean to the original audience? Historical background, context, and 'Why' questions.",
  [StudyStep.APPLICATION]: "What is the timeless truth? How does it apply today to me, the church, or society?",
  [StudyStep.CHARTING]: "Structure the book. Create paragraph titles, segments, and trace themes (Horizontal/Vertical charts)."
};