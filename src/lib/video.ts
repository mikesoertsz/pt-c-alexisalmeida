/**
 * Resolves a video asset path to the correct delivery URL.
 *
 * Lookup order:
 *   1. cloudinary-manifest.json  (build-time snapshot — stores YouTube URLs after migration)
 *   2. Path unchanged             (local /public files in dev)
 *
 * Usage:
 *   import { videoSrc, youtubeId, videoThumbSrc } from "@/lib/video";
 */
import manifest from "@/data/cloudinary-manifest.json";

export function videoSrc(path: string): string {
  const key = path.startsWith("/") ? path : `/${path}`;
  const entry = (manifest as Record<string, string>)[key];
  if (entry) return entry;
  return path;
}

/** Extract YouTube video ID from a YouTube URL, or null if not YouTube. */
export function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

/**
 * Returns the best available thumbnail URL for a video path.
 *
 * Lookup order:
 *   1. YouTube hqdefault thumbnail  (when the resolved source is a YouTube URL)
 *   2. Locally generated poster     (/img/<dir>/thumbs/<name>.jpg — see scripts/gen-video-thumbs)
 *
 * Always returns a usable URL so the caller can render an <img> with a
 * static image fallback rather than an empty placeholder.
 */
export function videoThumbSrc(path: string): string {
  const src = videoSrc(path);
  const id = youtubeId(src);
  if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

  // Derive the co-located poster: /a/b/name.mp4 -> /a/b/thumbs/name.jpg
  const key = path.startsWith("/") ? path : `/${path}`;
  const slash = key.lastIndexOf("/");
  const dir = key.slice(0, slash);
  const file = key.slice(slash + 1).replace(/\.[^.]+$/, "");
  return `${dir}/thumbs/${file}.jpg`;
}
