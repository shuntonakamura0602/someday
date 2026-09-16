"use client";

import { useEffect, useState } from "react";
import { useDict, useIntlLocale } from "@/lib/i18n/locale-context";
import { getReflections } from "@/lib/storage";
import type { DailyReflection } from "@/lib/types";

export default function MemoriesPage() {
  const t = useDict().memories;
  const intlLocale = useIntlLocale();
  const dateFormatter = new Intl.DateTimeFormat(intlLocale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const [ready, setReady] = useState(false);
  const [reflections, setReflections] = useState<DailyReflection[]>([]);

  useEffect(() => {
    // localStorage is only readable client-side; loading it post-mount (gated by
    // `ready`) avoids a server/client hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReflections(getReflections());
    setReady(true);
  }, []);

  if (!ready) return <div className="flex-1" />;

  return (
    <div className="flex-1 px-6 py-14">
      <div className="mx-auto w-full max-w-xl">
        {reflections.length === 0 ? (
          <div className="animate-fade-in">
            <p className="leading-relaxed">{t.empty}</p>
            <p className="mt-2 leading-relaxed text-muted">{t.emptySubtitle}</p>
          </div>
        ) : (
          <ul className="space-y-8">
            {reflections.map((r, i) => (
              <li
                key={r.date}
                className="animate-fade-in"
                style={{ animationDelay: `${Math.min(i, 8) * 0.08}s` }}
              >
                <p className="text-sm text-muted">
                  {dateFormatter.format(new Date(`${r.date}T00:00:00`))}
                </p>
                <p className="mt-2 whitespace-pre-line leading-relaxed">{r.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
