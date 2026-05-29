import Image from "next/image";
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
