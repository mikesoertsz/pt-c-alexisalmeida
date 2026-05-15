"use client";

import { useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Wrapper } from "@/app/components/atoms";
import { TitleBlock } from "@/app/components/TitleBlock";
import type { ContentSchema } from "@/app/content";
import { useStyleMedia } from "@/app/components/ArtistStyleProvider";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

function isVideo(src: string) {
  return src.endsWith(".mp4");
}

interface Props {
  slice: ContentSchema["gallery"];
}

export function Gallery({ slice }: Props) {
  const items = useStyleMedia(slice.items);
  const itemKeys = items.map((item) => item.src).join("|");
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) emblaApi.reInit();
  }, [emblaApi, itemKeys]);

  return (
    <Wrapper id="gallery" className="bg-surface scroll-mt-16 overflow-hidden py-6 md:py-10">
      <div className="max-w-[1440px] mx-auto px-4 mb-8 md:mb-10">
        <TitleBlock
          orientation="left"
          preheading={slice.preheading}
          heading={slice.heading}
        />
      </div>

      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef} key={itemKeys}>
          <div className="flex gap-3 pl-4 md:pl-[max(1rem,calc((100vw-1440px)/2+1rem))]">
            {items.map((item) => (
              <div
                key={item.src}
                className="flex-none w-[280px] sm:w-[320px] md:w-[380px] lg:w-[420px]"
              >
                <div className="group relative aspect-4/5 overflow-hidden bg-surface-muted/40 ring-1 ring-border/25 cursor-grab active:cursor-grabbing">
                  {isVideo(item.src) ? (
                    <ReactPlayer
                      src={item.src}
                      playing
                      muted
                      loop
                      playsInline
                      width="100%"
                      height="100%"
                    />
                  ) : (
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-700 motion-reduce:duration-0 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                      sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 380px, 420px"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 mt-7 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[0.65rem] uppercase tracking-[0.22em] text-fg-muted font-sans">Drag to explore</p>
          <div className="flex items-center gap-0">
            <button
              type="button"
              onClick={scrollPrev}
              className="inline-flex size-10 items-center justify-center border border-border/40 text-ink/60 bg-surface hover:border-accent hover:text-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55 motion-reduce:transition-none"
              aria-label="Previous slide"
            >
              <ChevronLeft className="size-4" strokeWidth={1.5} aria-hidden />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="inline-flex size-10 items-center justify-center border border-border/40 border-l-0 text-ink/60 bg-surface hover:border-accent hover:text-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55 motion-reduce:transition-none"
              aria-label="Next slide"
            >
              <ChevronRight className="size-4" strokeWidth={1.5} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
