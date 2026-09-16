import { notFound } from "next/navigation";

// Matches any path under a valid /ja or /en prefix that isn't a real page,
// so it mounts the [locale] layout (and its not-found.tsx) instead of
// falling through to the locale-less root fallback.
export default function CatchAll() {
  notFound();
}
