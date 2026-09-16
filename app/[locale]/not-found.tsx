"use client";

import Link from "next/link";
import { useDict, useLocale } from "@/lib/i18n/locale-context";

export default function NotFound() {
  const locale = useLocale();
  const t = useDict().notFound;

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center sm:text-left">
        <p className="text-lg leading-relaxed">{t.message}</p>
        <Link
          href={`/${locale}`}
          className="mt-10 inline-block rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium"
        >
          {t.backHome}
        </Link>
      </div>
    </div>
  );
}
