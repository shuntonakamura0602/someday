import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center sm:text-left">
        <p className="text-lg leading-relaxed">
          ページが見つかりませんでした。
        </p>
        <Link
          href="/"
          className="mt-10 inline-block rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium"
        >
          今日のページへ戻る
        </Link>
      </div>
    </div>
  );
}
