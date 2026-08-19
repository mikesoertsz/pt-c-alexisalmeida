import Image from "next/image";
import { AnimateIn } from "@/components/atoms/AnimateIn/AnimateIn";
import type { ContentSchema } from "@/content/schema";

interface FlashGridProps {
  slice: ContentSchema["flashGrid"];
}

/** The flash section only earns its place once there is a real sheet to show. */
const MIN_FLASH_ITEMS = 10;

export function FlashGrid({ slice }: FlashGridProps) {
  if (slice.images.length < MIN_FLASH_ITEMS) return null;

  return (
    <section id="flash" data-nav-tone="light" className="w-full bg-brand-linen scroll-mt-16 border-t-2 border-brand-black">
      <AnimateIn>
        <div className="flex flex-col gap-3 px-6 md:px-12 pt-20 md:pt-28 pb-10">
          <span className="font-mono text-xs text-brand-black/50 uppercase tracking-[0.12em]">
            {slice.label}
          </span>
          <h2 className="font-display font-black uppercase text-brand-black text-4xl md:text-5xl lg:text-6xl leading-[0.9] tracking-tighter">
            {slice.heading}
          </h2>
          <p className="max-w-xl text-brand-black/70 text-base md:text-lg leading-relaxed">
            {slice.intro}
          </p>
          <p className="font-mono text-xs text-brand-tangerine uppercase tracking-[0.12em] mt-1">
            [ {slice.walkInNote} ]
          </p>
        </div>
      </AnimateIn>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-brand-black border-t-2 border-brand-black">
        {slice.images.map((item) => (
          <div
            key={item.src}
            className="relative aspect-[4/5] bg-brand-cotton overflow-hidden"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
