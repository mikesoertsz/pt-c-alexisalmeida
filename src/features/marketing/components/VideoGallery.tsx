"use client";

import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { AnimateIn } from "@/components/atoms/AnimateIn/AnimateIn";
import { videoSrc, youtubeId, videoThumbSrc } from "@/lib/video";

interface VideoEntry {
  id: string;
  src: string;
}

const POOL: VideoEntry[] = [
  { id: "gallery-49",  src: "/img/shortlist/gallery-49.mp4" },
  { id: "gallery-55",  src: "/img/shortlist/gallery-55.mp4" },
  { id: "gallery-120", src: "/img/shortlist/gallery-120.mp4" },
  { id: "gallery-137", src: "/img/shortlist/gallery-137.mp4" },
  { id: "gallery-138", src: "/img/shortlist/gallery-138.mp4" },
  { id: "gallery-164", src: "/img/shortlist/gallery-164.mp4" },
  { id: "gallery-180", src: "/img/shortlist/gallery-180.mp4" },
  { id: "gallery-183", src: "/img/shortlist/gallery-183.mp4" },
  { id: "gallery-186", src: "/img/shortlist/gallery-186.mp4" },
  { id: "gallery-189", src: "/img/shortlist/gallery-189.mp4" },
  { id: "gallery-213", src: "/img/shortlist/gallery-213.mp4" },
  { id: "gallery-240", src: "/img/shortlist/gallery-240.mp4" },
  { id: "gallery-246", src: "/img/shortlist/gallery-246.mp4" },
  { id: "gallery-247", src: "/img/shortlist/gallery-247.mp4" },
  { id: "gallery-249", src: "/img/shortlist/gallery-249.mp4" },
  { id: "gallery-254", src: "/img/shortlist/gallery-254.mp4" },
  { id: "gallery-302", src: "/img/shortlist/gallery-302.mp4" },
  { id: "gallery-327", src: "/img/shortlist/gallery-327.mp4" },
  { id: "gallery-334", src: "/img/shortlist/gallery-334.mp4" },
  { id: "gallery-343", src: "/img/shortlist/gallery-343.mp4" },
  { id: "gallery-384", src: "/img/shortlist/gallery-384.mp4" },
  { id: "gallery-413", src: "/img/shortlist/gallery-413.mp4" },
  { id: "gallery-423", src: "/img/shortlist/gallery-423.mp4" },
  { id: "gallery-438", src: "/img/shortlist/gallery-438.mp4" },
  { id: "gallery-442", src: "/img/shortlist/gallery-442.mp4" },
  { id: "gallery-443", src: "/img/shortlist/gallery-443.mp4" },
  { id: "gallery-444", src: "/img/shortlist/gallery-444.mp4" },
  { id: "gallery-456", src: "/img/shortlist/gallery-456.mp4" },
  { id: "gallery-459", src: "/img/shortlist/gallery-459.mp4" },
  { id: "gallery-470", src: "/img/shortlist/gallery-470.mp4" },
  { id: "gallery-487", src: "/img/shortlist/gallery-487.mp4" },
  { id: "gallery-498", src: "/img/shortlist/gallery-498.mp4" },
  { id: "gallery-502", src: "/img/shortlist/gallery-502.mp4" },
  { id: "gallery-513", src: "/img/shortlist/gallery-513.mp4" },
  { id: "gallery-543", src: "/img/shortlist/gallery-543.mp4" },
  { id: "gallery-544", src: "/img/shortlist/gallery-544.mp4" },
  { id: "gallery-552", src: "/img/shortlist/gallery-552.mp4" },
  { id: "gallery-563", src: "/img/shortlist/gallery-563.mp4" },
  { id: "gallery-567", src: "/img/shortlist/gallery-567.mp4" },
  { id: "gallery-578", src: "/img/shortlist/gallery-578.mp4" },
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
  const thumb = videoThumbSrc(video.src);

  return (
    <button
      type="button"
      onMouseEnter={onActivate}
      onClick={onActivate}
      aria-label={`Play ${video.id}`}
      className={[
        "relative overflow-hidden bg-brand-black block w-full aspect-square lg:aspect-auto lg:h-full",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-tangerine focus-visible:outline-offset-[-2px]",
        isActive ? "outline outline-2 outline-brand-tangerine outline-offset-[-2px]" : "",
      ].join(" ")}
    >
      {thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumb}
          alt={video.id}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-brand-black" />
      )}

      {isActive && (
        <span className="absolute bottom-1 right-1 text-white animate-pulse">
          <Play size={14} fill="currentColor" strokeWidth={0} />
        </span>
      )}
    </button>
  );
}

export function VideoGallery() {
  const [videos, setVideos] = useState<VideoEntry[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const picked = shuffle(POOL).slice(0, 24);
    setVideos(picked);
    setActiveId(picked[0].id);
  }, []);

  const activeVideo = videos.find((v) => v.id === activeId) ?? videos[0] ?? null;
  const activeSrc = activeVideo ? videoSrc(activeVideo.src) : null;
  const isYoutube = activeSrc ? !!youtubeId(activeSrc) : false;

  return (
    <section data-nav-tone="dark" className="w-full bg-brand-black border-t-2 border-brand-black py-20 md:py-28 px-6 md:px-12">
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

            {/* Thumbnail grid */}
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

            {/* Featured player */}
            <div className="relative aspect-[9/16] lg:aspect-auto lg:w-[360px] shrink-0 overflow-hidden bg-brand-black">
              {activeVideo && activeSrc && (
                isYoutube ? (
                  <iframe
                    key={activeVideo.id}
                    src={`https://www.youtube.com/embed/${youtubeId(activeSrc)}?autoplay=1&mute=1&loop=1&playlist=${youtubeId(activeSrc)}&rel=0&modestbranding=1&playsinline=1`}
                    title={activeVideo.id}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                    style={{ position: "absolute", top: 0, left: 0 }}
                  />
                ) : (
                  <video
                    key={activeVideo.id}
                    src={activeSrc}
                    controls
                    playsInline
                    muted
                    loop
                    autoPlay
                    className="absolute inset-0 h-full w-full object-cover"
                    preload="auto"
                  />
                )
              )}
            </div>

          </div>
        </AnimateIn>

      </div>
    </section>
  );
}
