"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LIFE_CALENDAR_YEARS,
  decadeComparison,
  decadeRemaining,
  formatNumber,
  lifeCalendarPercent,
  weeksElapsed,
} from "@/lib/age";
import { getProfile } from "@/lib/storage";
import type { UserProfile } from "@/lib/types";

const WEEKS_PER_YEAR = 52;

export default function LifePage() {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // localStorage is only readable client-side; loading it post-mount (gated by
    // `ready`) avoids a server/client hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile(getProfile());
    setReady(true);
  }, []);

  if (!ready) return <div className="flex-1" />;

  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-16 text-center">
        <div>
          <p className="leading-relaxed text-muted">
            まだ生年月日が登録されていません。
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium"
          >
            はじめる
          </Link>
        </div>
      </div>
    );
  }

  const elapsedWeeks = weeksElapsed(profile.birthDate);
  const percent = lifeCalendarPercent(profile.birthDate);
  const comparison = decadeComparison(profile.birthDate);
  const remaining = decadeRemaining(profile.birthDate);
  const totalWeeks = LIFE_CALENDAR_YEARS * WEEKS_PER_YEAR;

  return (
    <div className="flex-1 px-6 py-14">
      <div className="mx-auto w-full max-w-2xl">
        <p className="animate-fade-in whitespace-pre-line leading-relaxed">
          {`あなたは今、\n人生の約${percent}%地点にいます。`}
        </p>
        <p
          className="animate-fade-in mt-3 text-sm text-muted whitespace-pre-line leading-relaxed"
          style={{ animationDelay: "0.2s" }}
        >
          {"これは残り時間を数えるためではなく、\n今いる場所を見るための地図です。"}
        </p>

        <div className="animate-fade-in mt-10 overflow-x-auto" style={{ animationDelay: "0.35s" }}>
          <LifeGrid elapsedWeeks={elapsedWeeks} totalWeeks={totalWeeks} />
        </div>

        <p className="mt-4 text-xs text-muted">
          80歳までをひとつの目安として表示しています。
        </p>

        <div className="mt-14 space-y-3">
          <p className="whitespace-pre-line leading-relaxed">
            {`${comparison.pastDecade}歳だった日から\n`}
            <span className="text-lg font-medium text-accent">
              {formatNumber(comparison.daysSincePastDecade)}日
            </span>
          </p>
          <p className="whitespace-pre-line leading-relaxed">
            {`${comparison.futureDecade}歳になる日まで\n`}
            <span className="text-lg font-medium text-accent">
              {formatNumber(comparison.daysUntilFutureDecade)}日
            </span>
          </p>
          <p className="text-sm text-muted whitespace-pre-line leading-relaxed">
            {`${comparison.pastDecade}歳がそれほど昔ではなかったように、\n${comparison.futureDecade}歳も思っているほど遠くないかもしれません。`}
          </p>
        </div>

        <div className="mt-10">
          <p className="leading-relaxed">
            {remaining.decadeLabel}代はあと{" "}
            <span className="font-medium text-accent">
              {formatNumber(remaining.daysRemaining)}日
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function LifeGrid({
  elapsedWeeks,
  totalWeeks,
}: {
  elapsedWeeks: number;
  totalWeeks: number;
}) {
  const cells = Array.from({ length: totalWeeks }, (_, i) => i);

  return (
    <div
      role="img"
      aria-label={`人生${LIFE_CALENDAR_YEARS}年を1週間ごとのマスで表した図。${elapsedWeeks}週が経過済みです。`}
      className="grid gap-[2px]"
      style={{
        gridTemplateColumns: `repeat(${WEEKS_PER_YEAR}, minmax(4px, 1fr))`,
        minWidth: WEEKS_PER_YEAR * 5,
      }}
    >
      {cells.map((i) => {
        const isCurrent = i === elapsedWeeks;
        const isPast = i < elapsedWeeks;
        return (
          <div
            key={i}
            className="aspect-square rounded-[1px]"
            style={{
              background: isCurrent
                ? "var(--accent)"
                : isPast
                  ? "var(--foreground)"
                  : "var(--border)",
              opacity: isCurrent ? 1 : isPast ? 0.75 : 0.6,
            }}
          />
        );
      })}
    </div>
  );
}
