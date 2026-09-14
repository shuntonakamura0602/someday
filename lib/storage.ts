import type { DailyReflection, UserProfile, YouthValue } from "./types";

const KEYS = {
  profile: "someday_profile",
  reflections: "someday_reflections",
  youthValue: "someday_youth_value",
} as const;

function readJSON<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJSON(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — fail silently.
  }
}

export function getProfile(): UserProfile | null {
  return readJSON<UserProfile>(KEYS.profile);
}

export function saveProfile(profile: UserProfile): void {
  writeJSON(KEYS.profile, profile);
}

export function getReflections(): DailyReflection[] {
  return readJSON<DailyReflection[]>(KEYS.reflections) ?? [];
}

export function getReflectionByDate(date: string): DailyReflection | null {
  return getReflections().find((r) => r.date === date) ?? null;
}

export function saveReflection(date: string, text: string): DailyReflection {
  const reflections = getReflections();
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
  writeJSON(KEYS.reflections, reflections);
  return entry;
}

export function getYouthValue(): YouthValue | null {
  return readJSON<YouthValue>(KEYS.youthValue);
}

export function saveYouthValue(value: YouthValue): void {
  writeJSON(KEYS.youthValue, value);
}
