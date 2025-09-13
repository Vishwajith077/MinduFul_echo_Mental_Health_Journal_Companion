import { ThemeDefinition, AgeGroup, Mood } from "./types";

export const BOT_NAME_SUGGESTIONS: string[] = [
  "SereneMate",
  "Mindful Echo",
  "SoulSync",
  "Healio",
  "AuraCare",
  "Zenith",
];

export const THEMES: ThemeDefinition[] = [
  {
    name: "light",
    colors: {
      "--bg-primary": "#FFFFFF",
      "--bg-secondary": "#F3F4F6",
      "--text-primary": "#1F2937",
      "--text-secondary": "#4B5563",
      "--accent-primary": "#3B82F6",
      "--user-bubble": "#DBEAFE",
      "--model-bubble": "#E5E7EB",
    },
  },
  {
    name: "dark",
    colors: {
      "--bg-primary": "#111827",
      "--bg-secondary": "#1F2937",
      "--text-primary": "#F9FAFB",
      "--text-secondary": "#D1D5DB",
      "--accent-primary": "#60A5FA",
      "--user-bubble": "#1E40AF",
      "--model-bubble": "#374151",
    },
  },
  {
    name: "pastel",
    colors: {
      "--bg-primary": "#fdf6f0",
      "--bg-secondary": "#f2ebe3",
      "--text-primary": "#5c5c5c",
      "--text-secondary": "#7f7f7f",
      "--accent-primary": "#e4b4ac",
      "--user-bubble": "#e4b4ac",
      "--model-bubble": "#dcd0c0",
    },
  },
  {
    name: "sunset",
    colors: {
      "--bg-primary": "#0f172a",
      "--bg-secondary": "#1e293b",
      "--text-primary": "#f8fafc",
      "--text-secondary": "#cbd5e1",
      "--accent-primary": "#fb923c",
      "--user-bubble": "#b45309",
      "--model-bubble": "#334155",
    },
  },
  {
    name: "oceanic",
    colors: {
      "--bg-primary": "#E0F7FA",
      "--bg-secondary": "#B2EBF2",
      "--text-primary": "#006064",
      "--text-secondary": "#00838F",
      "--accent-primary": "#00BCD4",
      "--user-bubble": "#4DD0E1",
      "--model-bubble": "#80DEEA",
    },
  },
    {
    name: "neon",
    colors: {
      "--bg-primary": "#000000",
      "--bg-secondary": "#1a1a1a",
      "--text-primary": "#00ff00",
      "--text-secondary": "#b3b3b3",
      "--accent-primary": "#ff00ff",
      "--user-bubble": "#330033",
      "--model-bubble": "#003300",
    },
  },
];

export const AGE_GROUPS: { id: AgeGroup; label: string }[] = [
  { id: "child", label: "Child" },
  { id: "teenager", label: "Teenager" },
  { id: "adult", label: "Adult" },
  { id: "grown-adult", label: "Grown Adult" },
];

export const MOOD_OPTIONS: { id: Mood; label: string; emoji: string; color: string }[] = [
    { id: 'happy', label: 'Happy', emoji: '😊', color: 'text-yellow-500' },
    { id: 'excited', label: 'Excited', emoji: '🤩', color: 'text-orange-500' },
    { id: 'calm', label: 'Calm', emoji: '😌', color: 'text-green-500' },
    { id: 'sad', label: 'Sad', emoji: '😢', color: 'text-blue-500' },
    { id: 'anxious', label: 'Anxious', emoji: '😟', color: 'text-purple-500' },
];
