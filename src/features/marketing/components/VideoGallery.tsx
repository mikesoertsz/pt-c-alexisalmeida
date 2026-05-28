"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Play } from "lucide-react";
import { AnimateIn } from "@/components/atoms/AnimateIn/AnimateIn";
import { videoSrc } from "@/lib/video";

interface VideoEntry {
  id: string;
  src: string;
}

const POOL: VideoEntry[] = [
  { id: "gallery-1",   src: "/img/gallery/gallery-1.mp4" },
  { id: "gallery-10",  src: "/img/gallery/gallery-10.mp4" },
  { id: "gallery-12",  src: "/img/gallery/gallery-12.mp4" },
  { id: "gallery-100", src: "/img/gallery/gallery-100.mp4" },
  { id: "gallery-103", src: "/img/gallery/gallery-103.mp4" },
  { id: "gallery-104", src: "/img/gallery/gallery-104.mp4" },
  { id: "gallery-107", src: "/img/gallery/gallery-107.mp4" },
  { id: "gallery-120", src: "/img/gallery/gallery-120.mp4" },
  { id: "gallery-122", src: "/img/gallery/gallery-122.mp4" },
  { id: "gallery-125", src: "/img/gallery/gallery-125.mp4" },
  { id: "gallery-128", src: "/img/gallery/gallery-128.mp4" },
  { id: "gallery-133", src: "/img/gallery/gallery-133.mp4" },
  { id: "gallery-134", src: "/img/gallery/gallery-134.mp4" },
  { id: "gallery-137", src: "/img/gallery/gallery-137.mp4" },
  { id: "gallery-138", src: "/img/gallery/gallery-138.mp4" },
  { id: "gallery-144", src: "/img/gallery/gallery-144.mp4" },
  { id: "gallery-148", src: "/img/gallery/gallery-148.mp4" },
  { id: "gallery-151", src: "/img/gallery/gallery-151.mp4" },
  { id: "gallery-154", src: "/img/gallery/gallery-154.mp4" },
  { id: "gallery-157", src: "/img/gallery/gallery-157.mp4" },
  { id: "gallery-161", src: "/img/gallery/gallery-161.mp4" },
  { id: "gallery-164", src: "/img/gallery/gallery-164.mp4" },
  { id: "gallery-167", src: "/img/gallery/gallery-167.mp4" },
  { id: "gallery-171", src: "/img/gallery/gallery-171.mp4" },
  { id: "gallery-174", src: "/img/gallery/gallery-174.mp4" },
  { id: "gallery-177", src: "/img/gallery/gallery-177.mp4" },
  { id: "gallery-180", src: "/img/gallery/gallery-180.mp4" },
  { id: "gallery-183", src: "/img/gallery/gallery-183.mp4" },
  { id: "gallery-184", src: "/img/gallery/gallery-184.mp4" },
  { id: "gallery-185", src: "/img/gallery/gallery-185.mp4" },
  { id: "gallery-186", src: "/img/gallery/gallery-186.mp4" },
  { id: "gallery-189", src: "/img/gallery/gallery-189.mp4" },
  { id: "gallery-19",  src: "/img/gallery/gallery-19.mp4" },
  { id: "gallery-192", src: "/img/gallery/gallery-192.mp4" },
  { id: "gallery-197", src: "/img/gallery/gallery-197.mp4" },
  { id: "gallery-204", src: "/img/gallery/gallery-204.mp4" },
  { id: "gallery-207", src: "/img/gallery/gallery-207.mp4" },
  { id: "gallery-210", src: "/img/gallery/gallery-210.mp4" },
  { id: "gallery-213", src: "/img/gallery/gallery-213.mp4" },
  { id: "gallery-216", src: "/img/gallery/gallery-216.mp4" },
  { id: "gallery-22",  src: "/img/gallery/gallery-22.mp4" },
  { id: "gallery-228", src: "/img/gallery/gallery-228.mp4" },
  { id: "gallery-231", src: "/img/gallery/gallery-231.mp4" },
  { id: "gallery-234", src: "/img/gallery/gallery-234.mp4" },
  { id: "gallery-237", src: "/img/gallery/gallery-237.mp4" },
  { id: "gallery-24",  src: "/img/gallery/gallery-24.mp4" },
  { id: "gallery-240", src: "/img/gallery/gallery-240.mp4" },
  { id: "gallery-243", src: "/img/gallery/gallery-243.mp4" },
];

function shuffle(arr: VideoEntry[]): VideoEntry[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function VideoThumb({
  video,
  isActive,
  onActivate,
}: {
  video: VideoEntry;
  isActive: boolean;
  onActivate: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const seek = () => { el.currentTime = 0; };
    if (el.readyState >= 1) seek();
    else el.addEventListener("loadedmetadata", seek, { once: true });
  }, [video.src]);

  return (
    <button
      type="button"
      onMouseEnter={onActivate}
      onClick={onActivate}
      aria-label={`Play ${video.id}`}
      className={[
        "relative overflow-hidden bg-brand-black block w-full h-full",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-tangerine focus-visible:outline-offset-[-2px]",
        isActive ? "outline outline-2 outline-brand-tangerine outline-offset-[-2px]" : "",
      ].join(" ")}
    >
      {/* Static first-frame thumbnail */}
      <video
        ref={ref}
        src={videoSrc(video.src)}
        preload="metadata"
        playsInline
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />

      {isActive && (
        <span className="absolute bottom-1 right-1 text-white animate-pulse">
          <Play size={14} fill="currentColor" strokeWidth={0} />
        </span>
      )}
    </button>
  );
}

export function VideoGallery() {
  // Randomly pick 24 from the pool on each mount
  const videos = useMemo(() => shuffle(POOL).slice(0, 24), []);

  // Active video tracked by id — not by array index — to prevent mismatch
  const [activeId, setActiveId] = useState<string>(videos[0].id);

  const featuredRef = useRef<HTMLVideoElement>(null);

  const activeVideo = videos.find((v) => v.id === activeId) ?? videos[0];

  // Play featured player whenever the active video changes
  useEffect(() => {
    const el = featuredRef.current;
    if (!el) return;
    el.load();
    el.play().catch(() => {});
  }, [activeId]);

  return (
    <section className="w-full bg-brand-black border-t-2 border-brand-black py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-10">

        <AnimateIn>
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs text-brand-linen/50 uppercase tracking-[0.12em]">
              [ Process ]
            </span>
            <h2 className="font-display font-black uppercase text-brand-linen text-4xl md:text-5xl lg:text-6xl leading-[0.9] tracking-tighter">
              The work in motion.
            </h2>
          </div>
        </AnimateIn>

        <AnimateIn>
          <div className="flex flex-col lg:flex-row lg:h-[640px]">

            {/* Thumbnail grid — each button keyed by video.id */}
            <div className="flex-1 grid grid-cols-6 grid-rows-4 overflow-hidden">
              {videos.map((video) => (
                <VideoThumb
                  key={video.id}
                  video={video}
                  isActive={video.id === activeId}
                  onActivate={() => setActiveId(video.id)}
                />
              ))}
            </div>

            {/* Featured player — keyed by activeVideo.id so it remounts on change */}
            <div className="relative aspect-[9/16] lg:aspect-auto lg:w-[360px] shrink-0 overflow-hidden bg-brand-black">
              <video
                ref={featuredRef}
                key={activeVideo.id}
                src={videoSrc(activeVideo.src)}
                controls
                playsInline
                muted
                loop
                className="absolute inset-0 h-full w-full object-cover"
                preload="auto"
              />
            </div>

          </div>
        </AnimateIn>

      </div>
    </section>
  );
}
