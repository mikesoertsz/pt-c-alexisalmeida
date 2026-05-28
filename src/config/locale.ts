export const LOCALES = ["en", "pt", "de"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  pt: "Português",
  de: "Deutsch",
};

export const LOCALE_SHORT: Record<Locale, string> = {
  en: "EN",
  pt: "PT",
  de: "DE",
};

/** Locales whose routes use URL prefix (/pt, /de). English uses unprefixed URLs with rewrite to /en. */
export const PREFIX_LOCALES: readonly Exclude<Locale, "en">[] = ["pt", "de"];
