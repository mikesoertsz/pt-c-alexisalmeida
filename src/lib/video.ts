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
 * For YouTube-hosted videos, returns the YouTube hqdefault thumbnail.
 * Falls back to null (caller should show a placeholder).
 */
export function videoThumbSrc(path: string): string | null {
  const src = videoSrc(path);
  const id = youtubeId(src);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}
