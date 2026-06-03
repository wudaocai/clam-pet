export type View = "home" | "tasks" | "mood" | "toolkit" | "wardrobe";

export type PetMood = "calm" | "lazy" | "happy";
export type MoodId = string;
export type PetAction = "idle" | "pat" | "nuzzle" | "celebrate" | "cuddle" | "wave";
export type SoundMode = "rain" | "forest" | "night";
export type BreathModeId = "soft" | "box" | "release" | "sleep";
export type ToolkitPanel = "sound" | "breath" | "soothe";
export type ThemeId = "mist" | "meadow" | "sunset";

export type SoundCategory =
  | "animals"
  | "binaural"
  | "nature"
  | "noise"
  | "places"
  | "rain"
  | "things"
  | "transport"
  | "urban";

export type MoodEntry = {
  mood: MoodId;
  diary: string;
  updatedAt: string;
};

export type MoodOption = {
  id: MoodId;
  label: string;
  color: string;
  custom?: boolean;
};

export type CalendarDay = {
  date: Date;
  key: string;
  day: number;
  inMonth: boolean;
  isToday: boolean;
};

export type SootheNote = {
  id: string;
  note: string;
  prompt: string;
  quote: string;
  createdAt: string;
};

export type BreathPhase = {
  label: string;
  seconds: number;
  instruction: string;
};

export type BreathMode = {
  id: BreathModeId;
  name: string;
  detail: string;
  phases: BreathPhase[];
};

export type SoundTrack = {
  id: string;
  category: SoundCategory;
  name: string;
  src: string;
  icon: string;
};

export type EnergyParticle = {
  id: number;
  x: number;
  y: number;
  ex: number;
  ey: number;
  dx: number;
  dy: number;
  delay: number;
};
