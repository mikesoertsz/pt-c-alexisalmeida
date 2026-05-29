/**
 * Regenerates src/data/cloudinary-manifest.json from the live Cloudinary account.
 *
 * Run after uploading new videos to Cloudinary:
 *   CLOUDINARY_URL=cloudinary://KEY:SECRET@drifter node scripts/sync-cloudinary.mjs
 *
 * Or with individual env vars:
 *   CLOUDINARY_CLOUD_NAME=drifter \
 *   CLOUDINARY_API_KEY=997946182989472 \
 *   CLOUDINARY_API_SECRET=<secret> \
 *   node scripts/sync-cloudinary.mjs
 *
 * Commit the updated manifest so the build picks it up.
 */

import { v2 as cloudinary } from "cloudinary";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? "drifter",
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const CLOUD  = cloudinary.config().cloud_name;
const PREFIXES = [
  { prefix: "Portugal Tattoo/alexis-almeida/gallery/",   localDir: "/img/gallery" },
  { prefix: "Portugal Tattoo/alexis-almeida/shortlist/", localDir: "/img/shortlist" },
  { prefix: "Portugal Tattoo/alexis-almeida/video/",     localDir: "/video" },
];

async function fetchAll(prefix) {
  const assets = [];
  let next_cursor;
  do {
    const res = await cloudinary.api.resources({
      type: "upload",
      resource_type: "video",
      prefix,
      max_results: 500,
      ...(next_cursor ? { next_cursor } : {}),
    });
    assets.push(...res.resources);
    next_cursor = res.next_cursor;
  } while (next_cursor);
  return assets;
}

const manifest = {};

for (const { prefix, localDir } of PREFIXES) {
  const assets = await fetchAll(prefix);
  for (const a of assets) {
    const basename  = a.public_id.split("/").pop();
    const localPath = `${localDir}/${basename}.mp4`;
    const encoded   = a.public_id.split("/").map(encodeURIComponent).join("/");
    manifest[localPath] = `https://res.cloudinary.com/${CLOUD}/video/upload/${encoded}.mp4`;
  }
  console.log(`${prefix.trim()}: ${assets.length} assets`);
}

const outDir  = join(ROOT, "src", "data");
const outFile = join(outDir, "cloudinary-manifest.json");
mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\nWrote ${Object.keys(manifest).length} entries to ${outFile}`);
