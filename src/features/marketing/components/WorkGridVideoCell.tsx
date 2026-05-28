"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { videoSrc } from "@/lib/video";

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

  if (prefersReducedMotion && poster) {
    return (
      <div
        className="relative aspect-square bg-brand-linen overflow-hidden"
        aria-label={alt}
      >
        <Image
          src={poster}
          alt={alt}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className="work-grid-video relative aspect-square bg-brand-linen overflow-hidden"
      aria-label={alt}
    >
      <video
        src={videoSrc(src)}
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
