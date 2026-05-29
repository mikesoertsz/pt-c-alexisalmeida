export {
  LOCALES,
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_LABELS,
  LOCALE_SHORT,
  PREFIX_LOCALES,
  type Locale,
} from "@/config/locale";

import { LOCALES, DEFAULT_LOCALE, type Locale } from "@/config/locale";

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

/** Home page section anchors (work, about, booking) — valid from any route. */
export type HomeSectionId = "work" | "about" | "booking";

export function localizedHomeAnchor(locale: Locale, section: HomeSectionId): string {
  return localizedPath(locale, `/#${section}`);
}
