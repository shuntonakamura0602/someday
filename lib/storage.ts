import type {
  DailyReflection,
  OnboardingCompletion,
  OnboardingDraft,
  UserProfile,
  YouthValue,
} from "./types";

const KEYS = {
  profile: "someday_profile",
  reflections: "someday_reflections",
  youthValue: "someday_youth_value",
  onboardingDraft: "someday_onboarding_draft",
  onboardingCompleted: "someday_onboarding_completed",
} as const;

function readRaw(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeJSON(key: string, value: unknown): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function removeKey(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // localStorage unavailable — nothing to clean up.
  }
}

function readJSON<T>(key: string): T | null {
  const raw = readRaw(key);
  if (raw == null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

const BIRTH_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidProfile(x: unknown): x is UserProfile {
  if (!x || typeof x !== "object") return false;
  const p = x as Record<string, unknown>;
  return typeof p.birthDate === "string" && BIRTH_DATE_RE.test(p.birthDate) && typeof p.futureAge === "number";
}

export function getProfile(): UserProfile | null {
  const parsed = readJSON<unknown>(KEYS.profile);
  return isValidProfile(parsed) ? parsed : null;
}

export function saveProfile(profile: UserProfile): boolean {
  return writeJSON(KEYS.profile, profile);
}

function isValidReflection(x: unknown): x is DailyReflection {
  if (!x || typeof x !== "object") return false;
  const r = x as Record<string, unknown>;
  return typeof r.date === "string" && typeof r.text === "string" && typeof r.createdAt === "string";
}

function isValidReflectionArray(x: unknown): x is DailyReflection[] {
  return Array.isArray(x) && x.every(isValidReflection);
}

function readReflectionsState(): { data: DailyReflection[]; corrupted: boolean } {
  const raw = readRaw(KEYS.reflections);
  if (raw == null) return { data: [], corrupted: false };
  try {
    const parsed = JSON.parse(raw);
    if (isValidReflectionArray(parsed)) return { data: parsed, corrupted: false };
    return { data: [], corrupted: true };
  } catch {
    return { data: [], corrupted: true };
  }
}

export function getReflections(): DailyReflection[] {
  return readReflectionsState().data;
}

export function getReflectionByDate(date: string): DailyReflection | null {
  return getReflections().find((r) => r.date === date) ?? null;
}

export type SaveReflectionResult =
  | { ok: true; entry: DailyReflection }
  | { ok: false; reason: "corrupted" | "storage_unavailable" };

export function saveReflection(date: string, text: string): SaveReflectionResult {
  const { data, corrupted } = readReflectionsState();
  // Refuse to save over data we couldn't parse — writing here would silently
  // replace whatever was there with just this one new entry.
  if (corrupted) return { ok: false, reason: "corrupted" };

  const reflections = [...data];
  const now = new Date().toISOString();
  const existingIndex = reflections.findIndex((r) => r.date === date);

  let entry: DailyReflection;
  if (existingIndex >= 0) {
    entry = { ...reflections[existingIndex], text, updatedAt: now };
    reflections[existingIndex] = entry;
  } else {
    entry = { date, text, createdAt: now };
    reflections.push(entry);
  }
  reflections.sort((a, b) => (a.date < b.date ? 1 : -1));

  if (!writeJSON(KEYS.reflections, reflections)) {
    return { ok: false, reason: "storage_unavailable" };
  }
  return { ok: true, entry };
}

function isValidDraft(x: unknown): x is OnboardingDraft {
  if (!x || typeof x !== "object") return false;
  const d = x as Record<string, unknown>;
  return (
    (d.step === "future" || d.step === "returnToday" || d.step === "note") &&
    typeof d.birthDate === "string" &&
    typeof d.noteText === "string"
  );
}

export function getOnboardingDraft(): OnboardingDraft | null {
  const parsed = readJSON<unknown>(KEYS.onboardingDraft);
  return isValidDraft(parsed) ? parsed : null;
}

export function saveOnboardingDraft(draft: Omit<OnboardingDraft, "updatedAt">): boolean {
  const full: OnboardingDraft = { ...draft, updatedAt: new Date().toISOString() };
  return writeJSON(KEYS.onboardingDraft, full);
}

export function clearOnboardingDraft(): void {
  removeKey(KEYS.onboardingDraft);
}

function isValidCompletion(x: unknown): x is OnboardingCompletion {
  if (!x || typeof x !== "object") return false;
  return typeof (x as Record<string, unknown>).completedAt === "string";
}

export function isOnboardingCompleted(): boolean {
  const parsed = readJSON<unknown>(KEYS.onboardingCompleted);
  return isValidCompletion(parsed);
}

export function markOnboardingCompleted(): boolean {
  const completion: OnboardingCompletion = { completedAt: new Date().toISOString() };
  return writeJSON(KEYS.onboardingCompleted, completion);
}

// Legacy: earlier versions asked users to price a year of youth. That
// question was removed from the experience, but any values already saved
// are left in place rather than deleted.
export function getYouthValue(): YouthValue | null {
  return readJSON<YouthValue>(KEYS.youthValue);
}

export function saveYouthValue(value: YouthValue): boolean {
  return writeJSON(KEYS.youthValue, value);
}
