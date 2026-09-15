export type AgeBreakdown = {
  years: number;
  months: number;
  days: number;
};

function toDateOnly(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
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

export function todayISO(today: Date = new Date()): string {
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
