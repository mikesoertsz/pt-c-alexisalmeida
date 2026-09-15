import type { MetadataRoute } from "next";
import { SERVICE_PAGE_KEYS, servicePagePath } from "@/content/pages/types";

const LEGAL_PATHS = [
  "/legal/terms",
  "/legal/privacy",
  "/legal/refunds",
  "/legal/gdpr",
  "/legal/cookies",
] as const;

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
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 1,
  }));

  const legalEntries = locales.flatMap((loc) =>
    LEGAL_PATHS.map((p) => ({
      url: absoluteForPath(base, publicPath(loc, p)),
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    }))
  );

  const serviceEntries = locales.flatMap((loc) =>
    SERVICE_PAGE_KEYS.map((key) => ({
      url: absoluteForPath(base, publicPath(loc, servicePagePath(key))),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }))
  );

  return [...homeEntries, ...serviceEntries, ...legalEntries];
}
