"use client";

import { useEffect, useState } from "react";
import { useHideNav } from "@/components/nav-visibility";
import { computeFutureAge, currentAgeYears, todayISO } from "@/lib/age";
import {
  clearOnboardingDraft,
  getOnboardingDraft,
  getProfile,
  markOnboardingCompleted,
  saveOnboardingDraft,
  saveProfile,
  saveReflection,
} from "@/lib/storage";
import type { OnboardingStep } from "@/lib/types";

type Step = "landing" | "birthdate" | OnboardingStep | "end";

const MAX_NOTE_LENGTH = 300;

export const STORAGE_EXPLANATION =
  "生年月日と記録は、このブラウザーにだけ保存されます（サーバーには送信されません）。別の端末には引き継がれません。ブラウザーのデータを消去したり、プライベートブラウズを終了したりすると失われる場合があります。";

export default function OnboardingFlow({
  onFinish,
  mode = "full",
  initialBirthDate,
}: {
  onFinish: () => void;
  mode?: "full" | "replay";
  initialBirthDate?: string;
}) {
  useHideNav(true);

  const [ready, setReady] = useState(mode === "replay");
  const [step, setStep] = useState<Step>(mode === "replay" ? "future" : "landing");
  const [birthDate, setBirthDate] = useState(initialBirthDate ?? "");
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    if (mode !== "full") return;
    // Resume from wherever the user left off. A saved draft means the core
    // scene (or the note step) was interrupted; an existing profile with no
    // draft means this is a pre-existing user migrating to this flow, who
    // should see the core scene again rather than being dropped into a
    // fresh onboarding or silently marked as already finished.
    const draft = getOnboardingDraft();
    const profile = getProfile();
    if (draft) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep(draft.step);
      setBirthDate(draft.birthDate);
      setNoteText(draft.noteText);
    } else if (profile) {
      setStep("future");
      setBirthDate(profile.birthDate);
    }
    setReady(true);
  }, [mode]);

  const currentAge = birthDate ? currentAgeYears(birthDate) : 0;
  const futureAge = computeFutureAge(currentAge);

  function persistDraft(nextStep: OnboardingStep, nextBirthDate: string, nextNote: string) {
    if (mode !== "full") return;
    saveOnboardingDraft({ step: nextStep, birthDate: nextBirthDate, noteText: nextNote });
  }

  function handleBirthDateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!birthDate) return;
    const age = currentAgeYears(birthDate);
    saveProfile({ birthDate, futureAge: computeFutureAge(age) });
    setStep("future");
    persistDraft("future", birthDate, "");
  }

  function goToReturnToday() {
    setStep("returnToday");
    persistDraft("returnToday", birthDate, noteText);
  }

  function goToNote() {
    setStep("note");
    persistDraft("note", birthDate, noteText);
  }

  function handleNoteChange(value: string) {
    const next = value.slice(0, MAX_NOTE_LENGTH);
    setNoteText(next);
    persistDraft("note", birthDate, next);
  }

  function finish() {
    if (noteText.trim()) {
      saveReflection(todayISO(), noteText.trim());
    }
    if (mode === "full") {
      markOnboardingCompleted();
      clearOnboardingDraft();
    }
    setStep("end");
  }

  if (!ready) {
    return <div className="flex-1" />;
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16">
      {step === "landing" && (
        <Screen>
          <h1 className="animate-fade-in whitespace-pre-line text-2xl sm:text-3xl font-medium tracking-tight leading-relaxed">
            {"いつか、今日の何でもない時間を、\n懐かしく思うかもしれません。"}
          </h1>
          <p
            className="animate-fade-in mt-6 text-muted leading-relaxed"
            style={{ animationDelay: "0.3s" }}
          >
            少し先の未来から、今日を眺める短い体験です。
          </p>
          <button
            onClick={() => setStep("birthdate")}
            className="animate-fade-in mt-12 rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium"
            style={{ animationDelay: "0.6s" }}
          >
            はじめる
          </button>
        </Screen>
      )}

      {step === "birthdate" && (
        <Screen>
          <form onSubmit={handleBirthDateSubmit} className="animate-fade-in w-full">
            <h2 className="text-2xl font-medium tracking-tight">
              あなたはいつ生まれましたか？
            </h2>
            <p className="mt-3 leading-relaxed text-muted">
              あなたの年齢に合わせて、
              <br />
              少し先の未来を想像します。
            </p>
            <label htmlFor="birthdate-input" className="sr-only">
              生年月日
            </label>
            <input
              id="birthdate-input"
              type="date"
              required
              max={todayISO()}
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="mt-8 w-full rounded-xl border border-border bg-transparent px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <p className="mt-4 text-xs leading-relaxed text-muted">{STORAGE_EXPLANATION}</p>
            <button
              type="submit"
              disabled={!birthDate}
              className="mt-8 w-full rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium disabled:opacity-40"
            >
              続ける
            </button>
          </form>
        </Screen>
      )}

      {step === "future" && (
        <Screen>
          <div className="space-y-6">
            <p className="animate-fade-in whitespace-pre-line leading-relaxed text-lg">
              {`${futureAge}歳になった自分を、\n少しだけ想像してみてください。`}
            </p>
            <p
              className="animate-fade-in whitespace-pre-line leading-relaxed text-muted"
              style={{ animationDelay: "0.6s" }}
            >
              {`思い出しているのは、今の年齢の頃の、\n何でもない一日。`}
            </p>
            <p
              className="animate-fade-in whitespace-pre-line leading-relaxed text-muted"
              style={{ animationDelay: "1.2s" }}
            >
              {"いつもの部屋。聞き慣れた声。\n帰り道に見上げた空。"}
            </p>
            <p
              className="animate-fade-in whitespace-pre-line leading-relaxed"
              style={{ animationDelay: "1.8s" }}
            >
              {`未来のあなたが懐かしく思うとしたら、\nどんな場面でしょう。`}
            </p>
            <p
              className="animate-fade-in leading-relaxed text-muted"
              style={{ animationDelay: "2.4s" }}
            >
              何も浮かばなくても、大丈夫です。
            </p>
          </div>
          <button
            onClick={goToReturnToday}
            className="animate-fade-in mt-12 rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium"
            style={{ animationDelay: "3s" }}
          >
            今日へ戻る
          </button>
        </Screen>
      )}

      {step === "returnToday" && (
        <Screen>
          <p className="animate-fade-in whitespace-pre-line leading-relaxed text-lg">
            今日は、まだここにあります。
          </p>
          <p
            className="animate-fade-in mt-6 whitespace-pre-line leading-relaxed text-muted"
            style={{ animationDelay: "0.4s" }}
          >
            {"特別な一日にしなくても大丈夫。\nこのあとも、あなたの今日が続きます。"}
          </p>
          <button
            onClick={finish}
            className="animate-fade-in mt-12 w-full sm:w-auto rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium"
            style={{ animationDelay: "0.9s" }}
          >
            今日に戻る
          </button>
          <button
            type="button"
            onClick={goToNote}
            className="animate-fade-in mt-6 block text-sm text-muted underline underline-offset-2 hover:text-foreground"
            style={{ animationDelay: "1.2s" }}
          >
            何か浮かんだら、ひと言だけ残す
          </button>
        </Screen>
      )}

      {step === "note" && (
        <Screen>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              finish();
            }}
            className="animate-fade-in w-full"
          >
            <p className="leading-relaxed text-lg">今、少し心に浮かんだことはありますか。</p>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-muted">
              {"何かをする約束でなくて大丈夫。\n書かずに終えてもかまいません。"}
            </p>
            <label htmlFor="note-textarea" className="sr-only">
              心に浮かんだこと
            </label>
            <textarea
              id="note-textarea"
              autoFocus
              value={noteText}
              onChange={(e) => handleNoteChange(e.target.value)}
              maxLength={MAX_NOTE_LENGTH}
              rows={5}
              className="mt-8 w-full resize-none rounded-xl border border-border bg-transparent px-4 py-3 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <div className="mt-2 text-right text-xs text-muted">
              {noteText.length} / {MAX_NOTE_LENGTH}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">{STORAGE_EXPLANATION}</p>
            <button
              type="submit"
              className="mt-8 w-full rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium"
            >
              終える
            </button>
          </form>
        </Screen>
      )}

      {step === "end" && (
        <Screen>
          <p className="animate-fade-in whitespace-pre-line leading-relaxed text-2xl font-medium tracking-tight">
            {"また、いつか。\nこの画面は、ここで閉じて大丈夫です。"}
          </p>
          <button
            onClick={onFinish}
            className="animate-fade-in mt-14 text-sm text-muted underline underline-offset-2 hover:text-foreground"
            style={{ animationDelay: "0.9s" }}
          >
            今日のページを見る
          </button>
        </Screen>
      )}
    </div>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return <div className="w-full max-w-md text-center sm:text-left">{children}</div>;
}
