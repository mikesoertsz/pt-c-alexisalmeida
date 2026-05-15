import { headers } from "next/headers";
import { ARTIST_STYLE_HEADER, parseArtistStyle, type ArtistStyle } from "@/app/lib/artist-style";

export async function getArtistStyleForRequest(): Promise<ArtistStyle> {
  const hdrs = await headers();
  return parseArtistStyle(hdrs.get(ARTIST_STYLE_HEADER));
}
