import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import AppShell from "@/components/app-shell";
import { NavVisibilityProvider } from "@/components/nav-visibility";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import { locales, isLocale } from "@/lib/i18n/config";
import { dictionaries } from "@/lib/i18n/dictionaries";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = dictionaries[locale].meta;

  return {
    title: t.title,
    description: t.description,
    alternates: {
      languages: { ja: "/ja", en: "/en" },
    },
    openGraph: {
      title: t.title,
      description: t.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
    },
    appleWebApp: {
      title: "Someday",
      statusBarStyle: "default",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f6" },
    { media: "(prefers-color-scheme: dark)", color: "#161513" },
  ],
};

export default async function RootLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LocaleProvider locale={locale}>
          <NavVisibilityProvider>
            <AppShell>{children}</AppShell>
          </NavVisibilityProvider>
        </LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}
