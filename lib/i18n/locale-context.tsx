"use client";

import { createContext, useContext } from "react";
import type { Locale } from "./config";
import { dictionaries, type Dictionary } from "./dictionaries";

const LocaleContext = createContext<Locale | null>(null);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  const locale = useContext(LocaleContext);
  if (!locale) throw new Error("useLocale must be used within a LocaleProvider");
  return locale;
}

export function useDict(): Dictionary {
  return dictionaries[useLocale()];
}

/** Intl locale tag for date/number formatting. */
export function useIntlLocale(): string {
  return useLocale() === "ja" ? "ja-JP" : "en-US";
}
