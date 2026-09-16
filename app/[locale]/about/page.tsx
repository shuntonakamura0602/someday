import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { dictionaries } from "@/lib/i18n/dictionaries";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: dictionaries[locale].about.pageTitle };
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale: rawLocale } = await params;
  const dict = dictionaries[isLocale(rawLocale) ? rawLocale : "ja"];

  return (
    <div className="flex-1 px-6 py-14">
      <div className="mx-auto w-full max-w-xl">
        <p className="whitespace-pre-line leading-loose text-lg">{dict.about.body}</p>
        <p className="mt-10 whitespace-pre-line text-sm leading-relaxed text-muted">
          {dict.storage.full}
        </p>
        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">
          {dict.about.analytics}
        </p>
      </div>
    </div>
  );
}
