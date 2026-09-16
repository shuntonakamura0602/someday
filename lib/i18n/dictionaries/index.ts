import type { Locale } from "../config";
import { ja } from "./ja";
import { en } from "./en";

export type { Dictionary } from "./types";

export const dictionaries = { ja, en } satisfies Record<Locale, unknown>;
