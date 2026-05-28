/**
 * Client-supplied brand assets under /public/img only.
 * Override with env when swapping files (no generated logos / OG art in repo).
 */
export const DEFAULT_LOGO_NAV_SRC = "/img/logo/lex-icon-black.PNG";

/** Strong portfolio still for social previews (Open Graph, rich shares). */
export const DEFAULT_OG_IMAGE_PATH = "/img/gallery/gallery-461.webp";

export function logoNavSrc(): string {
  const v = process.env.NEXT_PUBLIC_LOGO_NAV_SRC?.trim();
  return v && v.length > 0 ? v : DEFAULT_LOGO_NAV_SRC;
}

export function ogImagePath(): string {
  const v = process.env.NEXT_PUBLIC_OG_IMAGE_PATH?.trim();
  return v && v.length > 0 ? v : DEFAULT_OG_IMAGE_PATH;
}
