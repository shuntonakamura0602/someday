"use client";

import { useState } from "react";
import OnboardingFlow, { STORAGE_EXPLANATION } from "@/components/onboarding-flow";
import { computeFutureAge, currentAgeYears, todayISO } from "@/lib/age";
import { getReflectionByDate, saveProfile, saveReflection } from "@/lib/storage";
import type { DailyReflection, UserProfile } from "@/lib/types";

const MAX_TODAY_LENGTH = 300;

const DATE_FORMATTER = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const SAVE_ERROR_MESSAGE =
  "保存できませんでした。\n入力した内容は、この画面に残っています。\nもう一度お試しください。";

export default function HomeView({
  profile,
  initialReflection,
  onProfileChange,
}: {
  profile: UserProfile;
  initialReflection: DailyReflection | null;
  onProfileChange: (profile: UserProfile) => void;
}) {
  const [reflection, setReflection] = useState(initialReflection);
  const [isEditing, setIsEditing] = useState(!initialReflection);
  const [text, setText] = useState(initialReflection?.text ?? "");
  const [saveError, setSaveError] = useState(false);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [birthDateInput, setBirthDateInput] = useState(profile.birthDate);
  const [isReplaying, setIsReplaying] = useState(false);

  const currentAge = currentAgeYears(profile.birthDate);

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
        <p className="text-sm text-muted">{DATE_FORMATTER.format(new Date())}</p>

        <p className="mt-6 text-3xl font-medium tracking-tight">
          あなたは<span className="text-accent">{currentAge}歳</span>です。
        </p>

        <p className="mt-4 whitespace-pre-line leading-relaxed text-muted">
          {`${profile.futureAge}歳のあなたが今日へ戻ってきたら、\n何をしたいでしょう？`}
        </p>

        <div className="mt-10">
          {isEditing ? (
            <form onSubmit={handleSave}>
              <label htmlFor="home-textarea" className="sr-only">
                今日、何をしたいですか？
              </label>
              {!reflection && (
                <p className="mb-3 text-sm font-medium">今日、何をしたいですか？</p>
              )}
              <textarea
                id="home-textarea"
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, MAX_TODAY_LENGTH))}
                maxLength={MAX_TODAY_LENGTH}
                rows={5}
                placeholder={
                  "例：\n公園を散歩する\n好きな人に連絡する\n作りたかったものを少し作る\n何もせずゆっくりする"
                }
                className="w-full resize-none rounded-xl border border-border bg-transparent px-4 py-3 text-base leading-relaxed placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <div className="mt-2 text-right text-xs text-muted">
                {text.length} / {MAX_TODAY_LENGTH}
              </div>
              {saveError && (
                <p className="mt-3 whitespace-pre-line text-sm text-accent">{SAVE_ERROR_MESSAGE}</p>
              )}
              <p className="mt-3 text-xs leading-relaxed text-muted">{STORAGE_EXPLANATION}</p>
              <div className="mt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="flex-1 rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium disabled:opacity-40"
                >
                  今日に残す
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
                    キャンセル
                  </button>
                )}
              </div>
            </form>
          ) : (
            reflection && (
              <div>
                <p className="text-xs text-muted">今日あなたが残したもの</p>
                <div className="mt-3 rounded-xl border border-border px-4 py-4 leading-relaxed whitespace-pre-line">
                  {reflection.text}
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  aria-label="今日の記録を編集する"
                  className="mt-3 text-sm text-muted underline underline-offset-2 hover:text-foreground"
                >
                  編集する
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
            もう一度、未来から今日を見る
          </button>

          {isCorrecting ? (
            <form onSubmit={handleBirthDateCorrection} className="pt-2">
              <label htmlFor="birthdate-correction" className="block text-sm text-muted">
                生年月日を訂正する
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
                  更新する
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBirthDateInput(profile.birthDate);
                    setIsCorrecting(false);
                  }}
                  className="rounded-full border border-border px-5 py-2.5 text-sm text-muted"
                >
                  キャンセル
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsCorrecting(true)}
              className="block text-sm text-muted underline underline-offset-2 hover:text-foreground"
            >
              生年月日を訂正する
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
