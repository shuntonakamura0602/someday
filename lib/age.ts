export const LIFE_CALENDAR_YEARS = 80;
const MS_PER_DAY = 86_400_000;

export type AgeBreakdown = {
  years: number;
  months: number;
  days: number;
};

function toDateOnly(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function daysBetween(a: Date, b: Date): number {
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((utcB - utcA) / MS_PER_DAY);
}

function addYears(date: Date, years: number): Date {
  return new Date(date.getFullYear() + years, date.getMonth(), date.getDate());
}

export function ageBreakdown(birthDate: string, today: Date = new Date()): AgeBreakdown {
  const birth = toDateOnly(birthDate);
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years: Math.max(0, years), months: Math.max(0, months), days: Math.max(0, days) };
}

export function currentAgeYears(birthDate: string, today: Date = new Date()): number {
  return ageBreakdown(birthDate, today).years;
}

export function daysSinceBirth(birthDate: string, today: Date = new Date()): number {
  return Math.max(0, daysBetween(toDateOnly(birthDate), today));
}

export function dateAtAge(birthDate: string, age: number): Date {
  return addYears(toDateOnly(birthDate), age);
}

/**
 * currentAge < 50  -> 60
 * 50 <= currentAge < 70 -> 80
 * currentAge >= 70 -> currentAge + 15
 */
export function computeFutureAge(currentAge: number): number {
  if (currentAge < 50) return 60;
  if (currentAge < 70) return 80;
  return currentAge + 15;
}

export function weeksElapsed(birthDate: string, today: Date = new Date()): number {
  return Math.floor(daysSinceBirth(birthDate, today) / 7);
}

export function lifeCalendarPercent(birthDate: string, today: Date = new Date()): number {
  const totalWeeks = LIFE_CALENDAR_YEARS * 52;
  const elapsed = weeksElapsed(birthDate, today);
  return Math.min(100, Math.round((elapsed / totalWeeks) * 1000) / 10);
}

export type DecadeComparison = {
  pastDecade: number;
  futureDecade: number;
  daysSincePastDecade: number;
  daysUntilFutureDecade: number;
};

export function decadeComparison(birthDate: string, today: Date = new Date()): DecadeComparison {
  const currentAge = currentAgeYears(birthDate, today);
  let pastDecade = Math.floor(currentAge / 10) * 10;
  if (pastDecade === currentAge) pastDecade = Math.max(0, pastDecade - 10);
  const futureDecade = pastDecade + 20;

  return {
    pastDecade,
    futureDecade,
    daysSincePastDecade: Math.max(0, daysBetween(dateAtAge(birthDate, pastDecade), today)),
    daysUntilFutureDecade: Math.max(0, daysBetween(today, dateAtAge(birthDate, futureDecade))),
  };
}

export type DecadeRemaining = {
  decadeLabel: number;
  daysRemaining: number;
};

export function decadeRemaining(birthDate: string, today: Date = new Date()): DecadeRemaining {
  const currentAge = currentAgeYears(birthDate, today);
  const decadeLabel = Math.floor(currentAge / 10) * 10;
  const nextDecadeStart = decadeLabel + 10;
  return {
    decadeLabel,
    daysRemaining: Math.max(0, daysBetween(today, dateAtAge(birthDate, nextDecadeStart))),
  };
}

export function formatNumber(n: number): string {
  return n.toLocaleString("ja-JP");
}

export function todayISO(today: Date = new Date()): string {
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
