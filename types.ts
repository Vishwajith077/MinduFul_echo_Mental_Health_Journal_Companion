export type Role = "user" | "model";

export interface Source {
  uri: string;
  title: string;
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
  sources?: Source[];
}

export interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  createdAt: number;
}

export type Theme =
  | "light"
  | "dark"
  | "pastel"
  | "sunset"
  | "oceanic"
  | "neon";

export interface ThemeDefinition {
  name: Theme;
  colors: {
    '--bg-primary': string;
    '--bg-secondary': string;
    '--text-primary': string;
    '--text-secondary': string;
    '--accent-primary': string;
    '--user-bubble': string;
    '--model-bubble': string;
  };
}

export type AgeGroup = "child" | "teenager" | "adult" | "grown-adult";

// Mood Tracking Types
export type Mood = "happy" | "sad" | "anxious" | "calm" | "excited";

export interface MoodEntry {
  id: string;
  mood: Mood;
  note: string;
  timestamp: number;
}

// Journaling Types
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  timestamp: number;
}
