/**
 * Resolves a video asset path to the correct delivery URL.
 *
 * Lookup order:
 *   1. cloudinary-manifest.json  (build-time snapshot of all Cloudinary assets)
 *   2. Constructed Cloudinary URL from env vars (fallback for unlisted assets)
 *   3. Path unchanged             (local /public files in dev when CLOUD is unset)
 *
 * Cloudinary URL format:
 *   https://res.cloudinary.com/{cloud}/video/upload/{folder}/{public_id}.mp4
 *
 * Env vars (set in Vercel dashboard and .env.local):
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=drifter
 *   NEXT_PUBLIC_CLOUDINARY_VIDEO_FOLDER=Portugal%20Tattoo/alexis-almeida
 *
 * To regenerate the manifest after uploading new videos to Cloudinary:
 *   node scripts/sync-cloudinary.mjs
 *
 * Usage:
 *   import { videoSrc } from "@/lib/video";
 *   <video src={videoSrc("/img/gallery/gallery-10.mp4")} />
 */
import manifest from "@/data/cloudinary-manifest.json";

const CLOUD  = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME  ?? "").trim();
const FOLDER = (process.env.NEXT_PUBLIC_CLOUDINARY_VIDEO_FOLDER ?? "").replace(/^\/|\/$/g, "");

export function videoSrc(path: string): string {
  // Normalise to "/img/gallery/gallery-10.mp4" style key
  const key = path.startsWith("/") ? path : `/${path}`;

  // 1. Manifest lookup (preferred — exact public_id, no guessing)
  const entry = (manifest as Record<string, string>)[key];
  if (entry) return entry;

  // 2. Construct URL from env vars (for assets not yet in the manifest)
  if (CLOUD) {
    const filename  = path.replace(/^\/+/, "").replace(/^.*\//, "");
    const folderPath = FOLDER ? `${FOLDER}/${filename}` : filename;
    return `https://res.cloudinary.com/${CLOUD}/video/upload/${folderPath}`;
  }

  // 3. Local dev fallback
  return path;
}
