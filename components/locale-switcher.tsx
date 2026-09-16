"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales } from "@/lib/i18n/config";
import { useDict, useLocale } from "@/lib/i18n/locale-context";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const label = useDict().localeSwitcher.label;

  const otherLocale = locales.find((l) => l !== locale)!;
  const rest = pathname.replace(new RegExp(`^/${locale}`), "");
  const href = `/${otherLocale}${rest}`;

  return (
    <Link
      href={href}
      onClick={() => {
        document.cookie = `NEXT_LOCALE=${otherLocale}; path=/; max-age=31536000`;
      }}
      className="fixed top-4 right-4 z-30 rounded-full border border-border bg-background/90 backdrop-blur px-3 py-1.5 text-xs text-muted hover:text-foreground"
    >
      {label}
    </Link>
  );
}
