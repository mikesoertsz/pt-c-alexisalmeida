import type { MetadataRoute } from "next";
import { SERVICE_PAGE_KEYS, servicePagePath } from "@/content/pages/types";

const LEGAL_PATHS = [
  "/legal/terms",
  "/legal/privacy",
  "/legal/refunds",
  "/legal/gdpr",
  "/legal/cookies",
] as const;

/**
 * Fixed lastmod dates. A per-request `new Date()` stamped every URL as
 * changed today on every crawl, which Google treats as noise and ignores.
 * Bump the relevant date in the same commit that changes that content.
 */
const LAST_MODIFIED = {
  home: new Date("2026-09-22"),
  service: new Date("2026-09-22"),
  legal: new Date("2026-08-19"),
} as const;

function normalizedBase(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";
  return raw.replace(/\/+$/, "");
}

/** Browser-facing path segment after host (always starts with /). */
function publicPath(localePrefix: "" | "/pt" | "/de", suffix: string): string {
  if (localePrefix === "") {
    return suffix === "" ? "/" : suffix;
  }
  return suffix === "" ? localePrefix : `${localePrefix}${suffix}`;
}

function absoluteForPath(base: string, path: string): string {
  return path === "/" ? `${base}/` : `${base}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = normalizedBase();
  if (base === "") {
    return [];
  }

  const locales: ("" | "/pt" | "/de")[] = ["", "/pt", "/de"];

  const homeEntries = locales.map((loc) => ({
    url: absoluteForPath(base, publicPath(loc, "")),
    lastModified: LAST_MODIFIED.home,
    changeFrequency: "monthly" as const,
    priority: 1,
  }));

  const legalEntries = locales.flatMap((loc) =>
    LEGAL_PATHS.map((p) => ({
      url: absoluteForPath(base, publicPath(loc, p)),
      lastModified: LAST_MODIFIED.legal,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    }))
  );

  const serviceEntries = locales.flatMap((loc) =>
    SERVICE_PAGE_KEYS.map((key) => ({
      url: absoluteForPath(base, publicPath(loc, servicePagePath(key))),
      lastModified: LAST_MODIFIED.service,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }))
  );

  return [...homeEntries, ...serviceEntries, ...legalEntries];
}
