"use client";

import { useState } from "react";
import { currentAgeYears, todayISO } from "@/lib/age";
import { saveReflection } from "@/lib/storage";
import type { DailyReflection, UserProfile } from "@/lib/types";

const MAX_TODAY_LENGTH = 300;

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export default function HomeView({
  profile,
  initialReflection,
}: {
  profile: UserProfile;
  initialReflection: DailyReflection | null;
}) {
  const [reflection, setReflection] = useState(initialReflection);
  const [isEditing, setIsEditing] = useState(!initialReflection);
  const [text, setText] = useState(initialReflection?.text ?? "");

  const currentAge = currentAgeYears(profile.birthDate);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const saved = saveReflection(todayISO(), text.trim());
    setReflection(saved);
    setIsEditing(false);
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center sm:text-left">
        <p className="text-sm text-muted">{DATE_FORMATTER.format(new Date())}</p>

        <p className="mt-6 text-3xl font-medium tracking-tight">
          You are <span className="text-accent">{currentAge} years old.</span>
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
                  Edit
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
