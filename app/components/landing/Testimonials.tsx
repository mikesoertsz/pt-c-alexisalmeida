"use client";

import Image from "next/image";
import { Wrapper, InnerWrap } from "@/app/components/atoms";
import { TitleBlock } from "@/app/components/TitleBlock";
import type { ContentSchema } from "@/app/content";
import { useStyleMedia } from "@/app/components/ArtistStyleProvider";

interface Props {
  slice: ContentSchema["testimonials"];
}

export function Testimonials({ slice: testimonials }: Props) {
  return (
    <Wrapper id="testimonials" className="bg-surface scroll-mt-16 py-24 md:py-32">
      <InnerWrap className="items-start px-4 md:px-8 max-w-5xl">
        <TitleBlock
          orientation="left"
          preheading={testimonials.preheading}
          heading={testimonials.heading}
        />

        <div className="mt-14 md:mt-16 w-full columns-1 md:columns-2 gap-x-14 gap-y-10 space-y-10 md:space-y-0">
          {testimonials.items.map((testimonial, index) => (
            <TestimonialQuote key={testimonial.author} testimonial={testimonial} index={index} />
          ))}
        </div>
      </InnerWrap>
    </Wrapper>
  );
}

function TestimonialQuote(props: {
  testimonial: ContentSchema["testimonials"]["items"][number];
  index: number;
}) {
  const { testimonial, index } = props;
  const avatarSrc = useStyleMedia(testimonial.avatarSrc);
  const stagger = index % 2 === 1 ? "md:pt-12" : "";

  return (
    <article
      className={`break-inside-avoid border-l border-border/35 pl-6 md:pl-8 py-2 ${stagger}`}
    >
      <div className="font-sans text-5xl leading-none text-accent/15 font-light mb-3 select-none" aria-hidden>
        &ldquo;
      </div>
      <blockquote className="font-sans font-light text-lg md:text-xl text-ink leading-[1.45] tracking-[-0.005em]">
        {testimonial.quote}
      </blockquote>

      <div className="flex items-center gap-3 mt-7">
        <div className="relative size-9 shrink-0 overflow-hidden bg-surface-muted ring-1 ring-border/30">
          <Image
            key={avatarSrc}
            fill
            sizes="36px"
            src={avatarSrc}
            alt=""
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink font-sans">{testimonial.author}</p>
          <p className="text-xs text-fg-muted font-sans">{testimonial.role}</p>
        </div>
      </div>
    </article>
  );
}
