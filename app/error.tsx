"use client";

import { useEffect } from "react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center sm:text-left">
        <p className="text-lg leading-relaxed">
          うまくいきませんでした。
          <br />
          もう一度お試しください。
        </p>
        <button
          onClick={() => retry()}
          className="mt-10 rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium"
        >
          もう一度試す
        </button>
      </div>
    </div>
  );
}
