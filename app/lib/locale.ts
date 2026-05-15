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

export function isValidLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function resolveLocaleFromHeader(acceptLanguage: string): Locale {
  const preferred = acceptLanguage.split(",").map((l) => l.split(";")[0].trim().toLowerCase());
  for (const lang of preferred) {
    if (lang.startsWith("pt")) return "pt";
    if (lang.startsWith("de")) return "de";
    if (lang.startsWith("en")) return "en";
  }
  return DEFAULT_LOCALE;
}

export function isPrefixedLocaleSegment(seg: string | undefined): seg is Exclude<Locale, "en"> {
  return seg === "pt" || seg === "de";
}

/**
 * Canonical path after removing leading /pt or /de (pathname from usePathname()).
 */
export function stripLocalePrefixFromPath(pathname: string): string {
  if (pathname === "/pt" || pathname.startsWith("/pt/")) {
    const rest = pathname.slice(3);
    return rest === "" ? "/" : rest.startsWith("/") ? rest : `/${rest}`;
  }
  if (pathname === "/de" || pathname.startsWith("/de/")) {
    const rest = pathname.slice(3);
    return rest === "" ? "/" : rest.startsWith("/") ? rest : `/${rest}`;
  }
  return pathname;
}

/**
 * Public URL path for linking (English has no locale prefix).
 */
export function localizedPath(locale: Locale, path: string): string {
  const normalized =
    path === "" || path === "/"
      ? "/"
      : path.startsWith("/")
        ? path
        : `/${path}`;
  if (locale === DEFAULT_LOCALE) {
    return normalized;
  }
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}
