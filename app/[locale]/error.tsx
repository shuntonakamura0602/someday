"use client";

import { useEffect } from "react";
import { useDict } from "@/lib/i18n/locale-context";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const t = useDict().error;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center sm:text-left">
        <p className="whitespace-pre-line text-lg leading-relaxed">{t.message}</p>
        <button
          onClick={() => retry()}
          className="mt-10 rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium"
        >
          {t.retry}
        </button>
      </div>
    </div>
  );
}
