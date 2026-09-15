"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavVisibility } from "@/components/nav-visibility";

const LINKS = [
  { href: "/", label: "今日" },
  { href: "/memories", label: "ひと言" },
  { href: "/about", label: "Somedayについて" },
];

export default function Nav() {
  const pathname = usePathname();
  const { hidden } = useNavVisibility();

  if (hidden) return null;

  return (
    <>
      <header className="hidden md:flex items-center justify-between px-8 py-5 border-b border-border">
        <Link
          href="/"
          className="text-[15px] font-medium tracking-tight text-foreground"
        >
          Someday
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-7">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm transition-colors ${
                  active ? "text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <nav
        aria-label="Main navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-20 flex items-center justify-around border-t border-border bg-background/95 backdrop-blur py-2.5"
      >
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`px-4 py-1.5 text-sm transition-colors ${
                active ? "text-accent" : "text-muted"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
