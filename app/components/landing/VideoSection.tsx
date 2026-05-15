"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Wrapper, InnerWrap } from "@/app/components/atoms";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
import { TitleBlock } from "@/app/components/TitleBlock";
import type { ContentSchema } from "@/app/content";
import { useStyleMedia } from "@/app/components/ArtistStyleProvider";

interface Props {
  section: ContentSchema["videoSection"];
}

export function VideoSection({ section }: Props) {
  const posterSrc = useStyleMedia(section.poster);
  return (
    <Wrapper className="bg-mist py-20 md:py-28">
      <InnerWrap className="px-4 md:px-8 max-w-6xl items-stretch">
        <div className="flex flex-col gap-12 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)] lg:gap-14 xl:gap-20 w-full">
          <div className="lg:sticky lg:top-28 lg:self-start space-y-0">
            <TitleBlock
              orientation="left"
              preheading={section.preheading}
              heading={section.heading}
            />
          </div>

          <div className="w-full min-w-0">
            <div className="relative aspect-video w-full overflow-hidden bg-blush/40">
              {section.videoUrl ? (
                <ReactPlayer
                  src={section.videoUrl}
                  light={posterSrc}
                  controls
                  width="100%"
                  height="100%"
                  playIcon={
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-ink/80 flex items-center justify-center">
                        <svg
                          className="w-7 h-7 md:w-8 md:h-8 text-white ml-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  }
                />
              ) : (
                <>
                  <div className="absolute inset-0 z-0">
                    <Image
                      key={posterSrc}
                      src={posterSrc}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 52vw, 100vw"
                    />
                  </div>
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-ink/80 flex items-center justify-center">
                      <svg
                        className="w-7 h-7 md:w-8 md:h-8 text-white ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="text-sm text-white drop-shadow-sm">Video coming soon</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </InnerWrap>
    </Wrapper>
  );
}
