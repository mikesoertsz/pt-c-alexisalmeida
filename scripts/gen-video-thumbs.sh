#!/usr/bin/env bash
#
# Generate static poster JPGs for every video in a directory.
# Posters are written to a `thumbs/` subfolder alongside the videos and are
# consumed by videoThumbSrc() in src/lib/video.ts as image fallbacks for the
# VideoGallery grid (and any other non-YouTube video source).
#
# Usage:
#   scripts/gen-video-thumbs.sh [dir]
#   scripts/gen-video-thumbs.sh public/img/shortlist   # default
#
# Requires: ffmpeg
set -euo pipefail

DIR="${1:-public/img/shortlist}"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg not found on PATH" >&2
  exit 1
fi

cd "$DIR"
mkdir -p thumbs

made=0
for f in *.mp4; do
  [ -e "$f" ] || continue
  base="${f%.mp4}"
  out="thumbs/${base}.jpg"
  # Prefer a frame ~0.4s in (skips black intro frames); fall back to the first frame.
  if ! ffmpeg -y -loglevel error -ss 0.4 -i "$f" -frames:v 1 -vf "scale=400:-1" -q:v 4 "$out" 2>/dev/null || [ ! -s "$out" ]; then
    ffmpeg -y -loglevel error -i "$f" -frames:v 1 -vf "scale=400:-1" -q:v 4 "$out"
  fi
  made=$((made + 1))
done

echo "Generated $made poster(s) in $DIR/thumbs"
