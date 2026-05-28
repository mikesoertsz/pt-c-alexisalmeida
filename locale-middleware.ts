/** Edge-safe locale helpers for middleware only (no path aliases). */

export const LOCALES = ["en", "pt", "de"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isValidLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function resolveLocaleFromHeader(acceptLanguage: string): Locale {
  const preferred = acceptLanguage
    .split(",")
    .map((l) => l.split(";")[0].trim().toLowerCase());
  for (const lang of preferred) {
    if (lang.startsWith("pt")) return "pt";
    if (lang.startsWith("de")) return "de";
    if (lang.startsWith("en")) return "en";
  }
  return DEFAULT_LOCALE;
}

export function isPrefixedLocaleSegment(
  seg: string | undefined,
): seg is Exclude<Locale, "en"> {
  return seg === "pt" || seg === "de";
}
