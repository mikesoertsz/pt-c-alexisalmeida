"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { videoSrc, youtubeId, videoThumbSrc } from "@/lib/video";

interface WorkGridVideoCellProps {
  src: string;
  alt: string;
  poster?: string;
}

function subscribeReducedMotion(onStoreChange: () => void): () => void {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

export default function WorkGridVideoCell({
  src,
  alt,
  poster,
}: WorkGridVideoCellProps) {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const resolvedSrc = videoSrc(src);
  const isYoutube = !!youtubeId(resolvedSrc);
  const thumb = poster ?? videoThumbSrc(src) ?? undefined;

  if (prefersReducedMotion && thumb) {
    return (
      <div
        className="relative aspect-square bg-brand-linen overflow-hidden"
        aria-label={alt}
      >
        <Image
          src={thumb}
          alt={alt}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
          unoptimized={thumb.startsWith("https://img.youtube.com")}
        />
      </div>
    );
  }

  return (
    <div
      className="work-grid-video relative aspect-square bg-brand-linen overflow-hidden"
      aria-label={alt}
    >
      {isYoutube ? (
        /* Scale the 16:9 iframe up so it covers the square container.
           All native YouTube chrome is disabled and the wrapper blocks
           every click so no YouTube UI is ever shown or reachable. */
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "180%",
            height: "180%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        >
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId(resolvedSrc)}?autoplay=1&mute=1&loop=1&playlist=${youtubeId(resolvedSrc)}&controls=0&rel=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3&playsinline=1&showinfo=0`}
            title={alt}
            allow="autoplay; encrypted-media; picture-in-picture"
            tabIndex={-1}
            className="h-full w-full border-0"
          />
        </div>
      ) : (
        <video
          src={resolvedSrc}
          autoPlay
          muted
          loop
          playsInline
          poster={thumb}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
