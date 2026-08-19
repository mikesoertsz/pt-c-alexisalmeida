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
