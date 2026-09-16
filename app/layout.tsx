import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import AppShell from "@/components/app-shell";
import { NavVisibilityProvider } from "@/components/nav-visibility";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Someday — You'll miss today.",
  description:
    "未来の自分から今日を見ることで、今という時間の大切さを思い出すWebサービス。A quiet place to see today from the perspective of your future self.",
  openGraph: {
    title: "Someday — You'll miss today.",
    description:
      "A quiet place to see today from the perspective of your future self.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Someday — You'll miss today.",
    description:
      "A quiet place to see today from the perspective of your future self.",
  },
  appleWebApp: {
    title: "Someday",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f6" },
    { media: "(prefers-color-scheme: dark)", color: "#161513" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      data-scroll-behavior="smooth"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NavVisibilityProvider>
          <AppShell>{children}</AppShell>
        </NavVisibilityProvider>
        <Analytics />
      </body>
    </html>
  );
}
