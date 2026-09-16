"use client";

import LocaleSwitcher from "@/components/locale-switcher";
import Nav from "@/components/nav";
import { useNavVisibility } from "@/components/nav-visibility";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { hidden } = useNavVisibility();
  return (
    <>
      <Nav />
      <LocaleSwitcher />
      <main className={`flex-1 flex flex-col ${hidden ? "" : "pb-20 md:pb-0"}`}>
        {children}
      </main>
    </>
  );
}
