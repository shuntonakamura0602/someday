"use client";

import { useMemo, useState } from "react";
import { useHideNav } from "@/components/nav-visibility";
import {
  ageBreakdown,
  computeFutureAge,
  currentAgeYears,
  daysSinceBirth,
  formatNumber,
  todayISO,
} from "@/lib/age";
import { saveProfile, saveReflection, saveYouthValue } from "@/lib/storage";
import type { YouthValueOption } from "@/lib/types";

type Step =
  | "landing"
  | "birthdate"
  | "currentAge"
  | "futurePerspective"
  | "hereNow"
  | "youthValue"
  | "today"
  | "saved";

const YOUTH_OPTIONS: { value: YouthValueOption; label: string; amount: number | null }[] = [
  { value: "100000", label: "¥100,000", amount: 100_000 },
  { value: "1000000", label: "¥1,000,000", amount: 1_000_000 },
  { value: "5000000", label: "¥5,000,000", amount: 5_000_000 },
  { value: "10000000", label: "¥10,000,000", amount: 10_000_000 },
  { value: "50000000", label: "¥50,000,000", amount: 50_000_000 },
  { value: "half", label: "財産の半分", amount: null },
  { value: "almost_all", label: "ほぼすべて", amount: null },
];

const MAX_TODAY_LENGTH = 300;

export default function OnboardingFlow({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState<Step>("landing");
  useHideNav(true);
  const [birthDate, setBirthDate] = useState<string>("");
  const [youthSelection, setYouthSelection] = useState<YouthValueOption | null>(null);
  const [todayText, setTodayText] = useState("");

  const currentAge = birthDate ? currentAgeYears(birthDate) : 0;
  const futureAge = useMemo(() => computeFutureAge(currentAge), [currentAge]);
  const yearsAgo = futureAge - currentAge;
  const breakdown = birthDate ? ageBreakdown(birthDate) : null;
  const totalDays = birthDate ? daysSinceBirth(birthDate) : 0;

  function handleBirthDateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!birthDate) return;
    const age = currentAgeYears(birthDate);
    saveProfile({ birthDate, futureAge: computeFutureAge(age) });
    setStep("currentAge");
  }

  function handleYouthSelect(option: YouthValueOption) {
    setYouthSelection(option);
    const chosen = YOUTH_OPTIONS.find((o) => o.value === option);
    saveYouthValue({
      selectedOption: option,
      selectedValue: chosen?.amount ?? null,
    });
  }

  function handleTodaySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!todayText.trim()) return;
    saveReflection(todayISO(), todayText.trim());
    setStep("saved");
  }

  const selectedYouthOption = YOUTH_OPTIONS.find((o) => o.value === youthSelection);
  const perDayValue =
    selectedYouthOption?.amount != null ? Math.round(selectedYouthOption.amount / 365) : null;

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16">
      {step === "landing" && (
        <Screen>
          <h1 className="animate-fade-in text-3xl sm:text-4xl font-medium tracking-tight leading-tight">
            Someday, you&apos;ll miss today.
          </h1>
          <p
            className="animate-fade-in mt-6 text-muted whitespace-pre-line leading-relaxed"
            style={{ animationDelay: "0.3s" }}
          >
            {"いつかあなたは、\n今日の自分に戻りたいと思う。"}
          </p>
          <button
            onClick={() => setStep("birthdate")}
            className="animate-fade-in mt-12 rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium"
            style={{ animationDelay: "0.6s" }}
          >
            未来から今日を見る
          </button>
        </Screen>
      )}

      {step === "birthdate" && (
        <Screen>
          <form onSubmit={handleBirthDateSubmit} className="animate-fade-in w-full">
            <h2 className="text-2xl font-medium tracking-tight">
              あなたはいつ生まれましたか？
            </h2>
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
            <button
              type="submit"
              disabled={!birthDate}
              className="mt-10 w-full rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium disabled:opacity-40"
            >
              続ける
            </button>
          </form>
        </Screen>
      )}

      {step === "currentAge" && breakdown && (
        <Screen>
          <p className="animate-fade-in text-sm text-muted">You are</p>
          <p className="animate-fade-in mt-2 text-4xl sm:text-5xl font-medium tracking-tight">
            {currentAge} years old.
          </p>
          <p
            className="animate-fade-in mt-6 text-muted"
            style={{ animationDelay: "0.25s" }}
          >
            {breakdown.years} years {breakdown.months} months {breakdown.days} days
          </p>
          <p
            className="animate-fade-in mt-2 text-muted"
            style={{ animationDelay: "0.4s" }}
          >
            あなたが生まれてから <span className="text-foreground">{formatNumber(totalDays)}日</span>
          </p>
          <p
            className="animate-fade-in mt-8 whitespace-pre-line leading-relaxed text-muted"
            style={{ animationDelay: "0.65s" }}
          >
            {"今は当たり前に感じるこの年齢も、\nいつか戻りたい時間になるかもしれません。"}
          </p>
          <button
            onClick={() => setStep("futurePerspective")}
            className="animate-fade-in mt-12 rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium"
            style={{ animationDelay: "0.9s" }}
          >
            {futureAge}歳の自分から見てみる
          </button>
        </Screen>
      )}

      {step === "futurePerspective" && (
        <Screen>
          <div className="space-y-8">
            <p className="animate-fade-in whitespace-pre-line leading-relaxed text-lg">
              {`あなたは${futureAge}歳です。\n\n${yearsAgo}年前の今日を思い出しています。`}
            </p>
            <p
              className="animate-fade-in whitespace-pre-line leading-relaxed text-muted"
              style={{ animationDelay: "0.9s" }}
            >
              {`あの頃は、自分が若いなんて\nあまり考えていませんでした。\n\nでも今振り返ると、\n${currentAge}歳だった自分には、\nまだたくさんの時間と可能性がありました。`}
            </p>
            <p
              className="animate-fade-in whitespace-pre-line leading-relaxed text-lg"
              style={{ animationDelay: "1.8s" }}
            >
              {`もし今日だけ、\n${currentAge}歳の自分に戻れるとしたら。`}
            </p>
          </div>
          <button
            onClick={() => setStep("hereNow")}
            className="animate-fade-in mt-14 rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium"
            style={{ animationDelay: "2.4s" }}
          >
            今日へ戻る
          </button>
        </Screen>
      )}

      {step === "hereNow" && (
        <Screen>
          <p className="animate-fade-in text-3xl sm:text-4xl font-medium tracking-tight">
            You are here now.
          </p>
          <p
            className="animate-fade-in mt-4 text-muted"
            style={{ animationDelay: "0.4s" }}
          >
            あなたは今、ここにいます。
          </p>
          <button
            onClick={() => setStep("youthValue")}
            className="animate-fade-in mt-14 rounded-full border border-border px-7 py-3 text-sm font-medium text-foreground"
            style={{ animationDelay: "1.4s" }}
          >
            続ける
          </button>
        </Screen>
      )}

      {step === "youthValue" && (
        <Screen>
          <p className="animate-fade-in whitespace-pre-line leading-relaxed text-lg">
            {`${futureAge}歳のあなたに、\n今の年齢に1年間だけ戻れる権利が売られていたら、\nいくら払いますか？`}
          </p>

          <div
            className="animate-fade-in mt-8 grid grid-cols-2 gap-3"
            style={{ animationDelay: "0.3s" }}
          >
            {YOUTH_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleYouthSelect(option.value)}
                aria-pressed={youthSelection === option.value}
                className={`rounded-xl border px-3 py-3 text-sm transition-colors ${
                  youthSelection === option.value
                    ? "border-accent bg-accent-soft text-foreground"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {youthSelection && (
            <div className="animate-fade-in mt-10 space-y-4">
              {perDayValue != null ? (
                <p className="whitespace-pre-line leading-relaxed">
                  {"あなたがつけた価値では、\n今のあなたの1日は"}
                  <br />
                  <span className="text-2xl font-medium text-accent">
                    約 ¥{formatNumber(perDayValue)}
                  </span>
                </p>
              ) : (
                <p className="leading-relaxed">数字にできないほどの価値、ということですね。</p>
              )}
              <p className="whitespace-pre-line leading-relaxed text-muted">
                {"そして今日、\nあなたはその1日をすでに持っています。"}
              </p>
              <p className="text-xs text-muted">
                ※これは人生や若さの客観的な金銭価値を示すものではありません。
              </p>
              <button
                onClick={() => setStep("today")}
                className="mt-6 rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium"
              >
                続ける
              </button>
            </div>
          )}
        </Screen>
      )}

      {step === "today" && (
        <Screen>
          <form onSubmit={handleTodaySubmit} className="animate-fade-in w-full">
            <p className="whitespace-pre-line leading-relaxed text-lg">
              {`もし${futureAge}歳の自分が\n今日に24時間だけ戻ってきたなら、\n\n`}
              <span className="font-medium">何をしたいですか？</span>
            </p>
            <label htmlFor="today-textarea" className="sr-only">
              今日やりたいこと
            </label>
            <textarea
              id="today-textarea"
              value={todayText}
              onChange={(e) => setTodayText(e.target.value.slice(0, MAX_TODAY_LENGTH))}
              maxLength={MAX_TODAY_LENGTH}
              rows={5}
              placeholder={
                "例：\n公園を散歩する\n好きな人に連絡する\n作りたかったものを少し作る\n何もせずゆっくりする"
              }
              className="mt-8 w-full resize-none rounded-xl border border-border bg-transparent px-4 py-3 text-base leading-relaxed placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <div className="mt-2 text-right text-xs text-muted">
              {todayText.length} / {MAX_TODAY_LENGTH}
            </div>
            <button
              type="submit"
              disabled={!todayText.trim()}
              className="mt-8 w-full rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium disabled:opacity-40"
            >
              今日に残す
            </button>
          </form>
        </Screen>
      )}

      {step === "saved" && (
        <Screen>
          <p className="animate-fade-in text-2xl font-medium tracking-tight">
            それで十分です。
          </p>
          <p
            className="animate-fade-in mt-6 whitespace-pre-line leading-relaxed text-muted"
            style={{ animationDelay: "0.4s" }}
          >
            {"今日を完璧な一日にする必要はありません。\n\n今日という日を、\n少しだけ自分のものにしてください。"}
          </p>
          <p
            className="animate-fade-in mt-10 text-lg"
            style={{ animationDelay: "0.9s" }}
          >
            See you someday.
          </p>
          <button
            onClick={onFinish}
            className="animate-fade-in mt-14 rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium"
            style={{ animationDelay: "1.3s" }}
          >
            ホームへ
          </button>
        </Screen>
      )}
    </div>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return <div className="w-full max-w-md text-center sm:text-left">{children}</div>;
}
