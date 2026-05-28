/** Google Maps place ID for the Porto studio (public listing, not raw address). */
export const STUDIO_GOOGLE_PLACE_ID = "ChIJQTPn5ItlJA0R5Nn2vLzzKIQ";

/** Approximate studio coordinates for map preview framing. */
export const STUDIO_GEO = {
  lat: 41.1447,
  lng: -8.6065,
} as const;

export function studioMapsEmbedUrl(): string {
  const { lat, lng } = STUDIO_GEO;
  return `https://maps.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
}

export function studioMapsOpenUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=Lex%20Almeida%20Tattoo&query_place_id=${STUDIO_GOOGLE_PLACE_ID}`;
}
