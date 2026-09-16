import Link from "next/link";

// Only reached when the URL doesn't even resolve to a valid /ja or /en
// segment (e.g. a mistyped locale) — the proxy sends every normal
// navigation through one of those first, where app/[locale]/not-found.tsx
// handles unknown pages with the right language and styling.
export default function NotFound() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 24, fontFamily: "system-ui, sans-serif", background: "#faf9f6", color: "#1a1a1a" }}>
      <div style={{ textAlign: "center" }}>
        <p>Page not found.</p>
        <Link href="/ja" style={{ color: "#c1653d" }}>日本語</Link>
        {" / "}
        <Link href="/en" style={{ color: "#c1653d" }}>English</Link>
      </div>
    </div>
  );
}
