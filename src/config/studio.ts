/** Google Maps place ID for the Porto studio (public listing, not raw address). */
export const STUDIO_GOOGLE_PLACE_ID = "ChIJQTPn5ItlJA0R5Nn2vLzzKIQ";

/** Numeric Maps CID for the same listing, derived from the place ID. */
export const STUDIO_GOOGLE_PLACE_CID = "9523129404024609252";

/**
 * Official short review link issued by Google Business Profile ("Ask for
 * reviews" → review link), retrieved directly from Business Profile Manager.
 * This is the authoritative link Google itself generates for review
 * solicitation — prefer it over a constructed maps/cid link.
 */
export const STUDIO_GOOGLE_REVIEW_LINK = "https://g.page/r/CeTZ9ry88yiEEBM/review";

/** Studio coordinates for map preview framing — must match STUDIO_GOOGLE_PLACE_ID (Rua do Paraíso 82, Porto). */
export const STUDIO_GEO = {
  lat: 41.1575712,
  lng: -8.6081723,
} as const;

export function studioMapsEmbedUrl(): string {
  const { lat, lng } = STUDIO_GEO;
  return `https://maps.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
}

export function studioMapsOpenUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=Lex%20Almeida%20Tattoo&query_place_id=${STUDIO_GOOGLE_PLACE_ID}`;
}

/** Review deep link for the studio's GBP listing — used for the in-studio QR code. */
export function studioReviewUrl(): string {
  return STUDIO_GOOGLE_REVIEW_LINK;
}

/** Public WhatsApp number in E.164, used as the schema.org telephone. */
export const STUDIO_TELEPHONE = "+351934613635";

/** Human-readable form of STUDIO_TELEPHONE for the visible NAP block. */
export const STUDIO_TELEPHONE_DISPLAY = "+351 934 613 635";

/** Canonical public studio name, identical to the Google Business Profile listing. */
export const STUDIO_NAME = "Lex Almeida Tattoo";

/** Same-entity profiles for schema.org sameAs (Instagram is added from content). */
export const STUDIO_SAME_AS = [
  `https://www.google.com/maps/search/?api=1&query=Lex%20Almeida%20Tattoo&query_place_id=${STUDIO_GOOGLE_PLACE_ID}`,
  "https://www.facebook.com/tattooart.alexis",
] as const;

/**
 * Google Business Profile rating, read from Business Profile Manager.
 * Update reviewCount when the GBP count changes (last read 2026-09-13).
 */
export const GOOGLE_REVIEWS = {
  ratingValue: 5,
  reviewCount: 19,
} as const;
