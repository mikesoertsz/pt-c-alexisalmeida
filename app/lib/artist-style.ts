export const ARTIST_STYLES = ["fine-line", "blackwork"] as const;
export type ArtistStyle = (typeof ARTIST_STYLES)[number];

export const DEFAULT_ARTIST_STYLE: ArtistStyle = "fine-line";

export const ARTIST_STYLE_COOKIE = "ARTIST_STYLE";
export const ARTIST_STYLE_STORAGE_KEY = "artist-style";
export const ARTIST_STYLE_HEADER = "x-artist-style";

export function isArtistStyle(value: unknown): value is ArtistStyle {
  return typeof value === "string" && (ARTIST_STYLES as readonly string[]).includes(value);
}

export function parseArtistStyle(value: string | null | undefined): ArtistStyle {
  const v = value?.trim().toLowerCase();
  if (v === "blackwork") return "blackwork";
  return DEFAULT_ARTIST_STYLE;
}

export type StyleMediaMap<TFine, TBw = TFine> = {
  readonly fineLine: TFine;
  readonly blackwork: TBw;
};

export function pickStyleMedia<TFine, TBw>(
  style: ArtistStyle,
  map: StyleMediaMap<TFine, TBw>,
): TFine | TBw {
  return style === "blackwork" ? map.blackwork : map.fineLine;
}

export const ARTIST_STYLE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function artistStyleCookieAttributes(): string {
  const secure = process.env.NODE_ENV === "production" ? ";secure" : "";
  return `path=/;samesite=lax;max-age=${ARTIST_STYLE_COOKIE_MAX_AGE}${secure}`;
}
