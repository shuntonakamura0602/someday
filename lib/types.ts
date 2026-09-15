export type UserProfile = {
  birthDate: string; // YYYY-MM-DD
  futureAge: number;
};

export type OnboardingCompletion = {
  completedAt: string;
};

export type OnboardingStep = "future" | "returnToday" | "note";

export type OnboardingDraft = {
  step: OnboardingStep;
  birthDate: string;
  noteText: string;
  updatedAt: string;
};

export type DailyReflection = {
  date: string; // YYYY-MM-DD
  text: string;
  createdAt: string;
  updatedAt?: string;
};

export type YouthValueOption =
  | "100000"
  | "1000000"
  | "5000000"
  | "10000000"
  | "50000000"
  | "half"
  | "almost_all";

export type YouthValue = {
  selectedValue: number | null;
  selectedOption: YouthValueOption | null;
};
