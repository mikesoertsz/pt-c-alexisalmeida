/**
 * Canonical site origin for metadata, json-ld, and robots sitemap.
 * Set NEXT_PUBLIC_BASE_URL or NEXT_PUBLIC_SITE_URL in production (e.g. https://lextattoo.com).
 */
export function getSiteBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const trimmed = raw.trim();
  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
}

export function absoluteUrl(path: string): string | undefined {
  const base = getSiteBaseUrl();
  if (!base) return undefined;
  if (path === "/" || path === "") return `${base}/`;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
