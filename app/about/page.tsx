import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Someday",
};

export default function AboutPage() {
  return (
    <div className="flex-1 px-6 py-14">
      <div className="mx-auto w-full max-w-xl">
        <p className="whitespace-pre-line leading-loose text-lg">
          {`Somedayは、\nあなたを急かすためのサービスではありません。\n\n人生は有限です。\n\nでも、それは今日を焦って生きなければならない\nという意味ではありません。\n\n未来から振り返ったとき、\n今のあなたの日常は、\n思っている以上に愛おしい時間かもしれません。\n\nSomedayは、\nそれを時々思い出すための場所です。`}
        </p>
        <p className="mt-10 whitespace-pre-line text-sm leading-relaxed text-muted">
          {"生年月日と記録は、このブラウザーにだけ保存されます（サーバーには送信されません）。\n別の端末には引き継がれません。\nブラウザーのデータを消去したり、プライベートブラウズを終了したりすると失われる場合があります。"}
        </p>
      </div>
    </div>
  );
}
