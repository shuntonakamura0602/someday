"use client";

import { useState } from "react";
import OnboardingFlow from "@/components/onboarding-flow";
import { useDict, useIntlLocale } from "@/lib/i18n/locale-context";
import { computeFutureAge, currentAgeYears, todayISO } from "@/lib/age";
import { getReflectionByDate, saveProfile, saveReflection } from "@/lib/storage";
import type { DailyReflection, UserProfile } from "@/lib/types";

const MAX_TODAY_LENGTH = 300;

export default function HomeView({
  profile,
  initialReflection,
  onProfileChange,
}: {
  profile: UserProfile;
  initialReflection: DailyReflection | null;
  onProfileChange: (profile: UserProfile) => void;
}) {
  const dict = useDict();
  const t = dict.home;
  const intlLocale = useIntlLocale();

  const [reflection, setReflection] = useState(initialReflection);
  const [isEditing, setIsEditing] = useState(!initialReflection);
  const [text, setText] = useState(initialReflection?.text ?? "");
  const [saveError, setSaveError] = useState(false);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [birthDateInput, setBirthDateInput] = useState(profile.birthDate);
  const [isReplaying, setIsReplaying] = useState(false);

  const currentAge = currentAgeYears(profile.birthDate);
  const heading = t.heading(currentAge);
  const dateFormatter = new Intl.DateTimeFormat(intlLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const result = saveReflection(todayISO(), text.trim());
    if (!result.ok) {
      setSaveError(true);
      return;
    }
    setSaveError(false);
    setReflection(result.entry);
    setIsEditing(false);
  }

  function handleBirthDateCorrection(e: React.FormEvent) {
    e.preventDefault();
    if (!birthDateInput) return;
    const age = currentAgeYears(birthDateInput);
    const updated: UserProfile = { birthDate: birthDateInput, futureAge: computeFutureAge(age) };
    saveProfile(updated);
    onProfileChange(updated);
    setIsCorrecting(false);
  }

  if (isReplaying) {
    return (
      <OnboardingFlow
        mode="replay"
        initialBirthDate={profile.birthDate}
        onFinish={() => {
          setReflection(getReflectionByDate(todayISO()));
          setIsEditing(false);
          setIsReplaying(false);
        }}
      />
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center sm:text-left">
        <p className="text-sm text-muted">{dateFormatter.format(new Date())}</p>

        <p className="mt-6 text-3xl font-medium tracking-tight">
          {heading.before}
          <span className="text-accent">{heading.highlight}</span>
          {heading.after}
        </p>

        <p className="mt-4 whitespace-pre-line leading-relaxed text-muted">
          {t.question(profile.futureAge)}
        </p>

        <div className="mt-10">
          {isEditing ? (
            <form onSubmit={handleSave}>
              <label htmlFor="home-textarea" className="sr-only">
                {t.noteSrLabel}
              </label>
              <p className="mb-3 text-xs text-muted">{t.optional}</p>
              <textarea
                id="home-textarea"
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, MAX_TODAY_LENGTH))}
                maxLength={MAX_TODAY_LENGTH}
                rows={5}
                placeholder={t.placeholder}
                className="w-full resize-none rounded-xl border border-border bg-transparent px-4 py-3 text-base leading-relaxed placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <div className="mt-2 text-right text-xs text-muted">
                {text.length} / {MAX_TODAY_LENGTH}
              </div>
              {saveError && (
                <p className="mt-3 whitespace-pre-line text-sm text-accent">{t.saveError}</p>
              )}
              <p className="mt-3 text-xs leading-relaxed text-muted">{dict.storage.short}</p>
              <div className="mt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="flex-1 rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium disabled:opacity-40"
                >
                  {t.keep}
                </button>
                {reflection && (
                  <button
                    type="button"
                    onClick={() => {
                      setText(reflection.text);
                      setIsEditing(false);
                      setSaveError(false);
                    }}
                    className="rounded-full border border-border px-5 py-3 text-sm text-muted"
                  >
                    {t.cancel}
                  </button>
                )}
              </div>
            </form>
          ) : (
            reflection && (
              <div>
                <p className="text-xs text-muted">{t.savedLabel}</p>
                <div className="mt-3 rounded-xl border border-border px-4 py-4 leading-relaxed whitespace-pre-line">
                  {reflection.text}
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  aria-label={t.editAriaLabel}
                  className="mt-3 text-sm text-muted underline underline-offset-2 hover:text-foreground"
                >
                  {t.edit}
                </button>
              </div>
            )
          )}
        </div>

        <div className="mt-14 space-y-3 border-t border-border pt-8">
          <button
            type="button"
            onClick={() => setIsReplaying(true)}
            className="block text-sm text-muted underline underline-offset-2 hover:text-foreground"
          >
            {t.replay}
          </button>

          {isCorrecting ? (
            <form onSubmit={handleBirthDateCorrection} className="pt-2">
              <label htmlFor="birthdate-correction" className="block text-sm text-muted">
                {t.correctBirthdate}
              </label>
              <input
                id="birthdate-correction"
                type="date"
                required
                max={todayISO()}
                value={birthDateInput}
                onChange={(e) => setBirthDateInput(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-transparent px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <div className="mt-3 flex gap-3">
                <button
                  type="submit"
                  disabled={!birthDateInput}
                  className="rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium disabled:opacity-40"
                >
                  {t.update}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBirthDateInput(profile.birthDate);
                    setIsCorrecting(false);
                  }}
                  className="rounded-full border border-border px-5 py-2.5 text-sm text-muted"
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsCorrecting(true)}
              className="block text-sm text-muted underline underline-offset-2 hover:text-foreground"
            >
              {t.correctBirthdate}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
