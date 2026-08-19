import Image from "next/image";
import { AnimateIn } from "@/components/atoms/AnimateIn/AnimateIn";
import type { ContentSchema } from "@/content/schema";
import WorkGridVideoCell from "./WorkGridVideoCell";

interface WorkGridProps {
  slice: ContentSchema["workGrid"];
}

type WorkGridItem = ContentSchema["workGrid"]["images"][number];

function isVideoItem(
  item: WorkGridItem,
): item is Extract<WorkGridItem, { kind: "video" }> {
  return "kind" in item && item.kind === "video";
}

export function WorkGrid({ slice }: WorkGridProps) {
  return (
    <section id="work" data-nav-tone="dark" className="w-full bg-brand-black scroll-mt-16 border-t-2 border-brand-black">
      <AnimateIn>
        <div className="flex flex-col gap-3 px-6 md:px-12 pt-20 md:pt-28 pb-10">
          <span className="font-mono text-xs text-brand-linen/50 uppercase tracking-[0.12em]">
            {slice.label}
          </span>
          <h2 className="font-display font-black uppercase text-brand-linen text-4xl md:text-5xl lg:text-6xl leading-[0.9] tracking-tighter">
            {slice.heading}
          </h2>
        </div>
      </AnimateIn>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-brand-black">
        {slice.images.map((item) => {
          const key = `${"kind" in item ? item.kind : "image"}-${item.src}`;

          if (isVideoItem(item)) {
            return (
              <WorkGridVideoCell
                key={key}
                src={item.src}
                alt={item.alt}
                poster={item.poster}
              />
            );
          }

          return (
            <div
              key={key}
              className="relative aspect-square bg-brand-linen overflow-hidden"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
