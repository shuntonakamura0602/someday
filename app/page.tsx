"use client";

import { useEffect, useState } from "react";
import HomeView from "@/components/home-view";
import OnboardingFlow from "@/components/onboarding-flow";
import { todayISO } from "@/lib/age";
import { getProfile, getReflectionByDate } from "@/lib/storage";
import type { DailyReflection, UserProfile } from "@/lib/types";

export default function Page() {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [reflection, setReflection] = useState<DailyReflection | null>(null);

  useEffect(() => {
    // localStorage is only readable client-side; loading it post-mount (gated by
    // `ready`) avoids a server/client hydration mismatch and any flash of the
    // wrong screen (onboarding vs. home) before the real value is known.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile(getProfile());
    setReflection(getReflectionByDate(todayISO()));
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="flex-1" />;
  }

  if (!profile) {
    return (
      <OnboardingFlow
        onFinish={() => {
          setProfile(getProfile());
          setReflection(getReflectionByDate(todayISO()));
        }}
      />
    );
  }

  return <HomeView profile={profile} initialReflection={reflection} />;
}
