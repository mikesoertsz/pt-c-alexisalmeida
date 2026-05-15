"use client";

import { useState } from "react";
import { ExternalLink, Minus, Plus } from "lucide-react";
import { Wrapper, InnerWrap } from "@/app/components/atoms";
import { TitleBlock } from "@/app/components/TitleBlock";
import type { ContentSchema } from "@/app/content";

interface FAQAccordionProps {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}

function AccordionItem({ q, a, open, onToggle }: FAQAccordionProps) {
  return (
    <div className="border-b border-border/30 last:border-b-0 break-inside-avoid">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full min-h-11 items-start justify-between gap-4 py-4 text-left text-xs md:text-sm font-sans font-medium text-ink/80 hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50 motion-reduce:transition-none"
        aria-expanded={open}
      >
        <span className="leading-snug">{q}</span>
        {open ? (
          <Minus
            className="mt-0.5 size-3.5 shrink-0 text-fg-muted/60 transition-transform duration-200 motion-reduce:transition-none"
            strokeWidth={1.5}
            aria-hidden
          />
        ) : (
          <Plus
            className="mt-0.5 size-3.5 shrink-0 text-fg-muted/60 transition-transform duration-200 motion-reduce:transition-none"
            strokeWidth={1.5}
            aria-hidden
          />
        )}
      </button>
      {open && (
        <p className="pb-4 text-xs text-fg-muted leading-[1.75] font-sans pr-6">{a}</p>
      )}
    </div>
  );
}

interface Props {
  slice: ContentSchema["faq"];
}

export function FAQ({ slice }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const studioQuery = encodeURIComponent(slice.studioAddress);
  const googleMapsEmbedSrc = `https://maps.google.com/maps?q=${studioQuery}&z=16&output=embed`;
  const googleMapsOpenHref = `https://www.google.com/maps/search/?api=1&query=${studioQuery}`;

  return (
    <Wrapper id="faq" className="bg-surface scroll-mt-16 py-28 md:py-32">
      <InnerWrap className="items-start px-4 md:px-6">
        <TitleBlock
          orientation="left"
          preheading={slice.preheading}
          heading={slice.heading}
        />

        <div className="mt-12 grid w-full grid-cols-1 items-start gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] xl:gap-16">
          <div className="min-h-0 w-full min-w-0 max-w-3xl border-t border-border/30 xl:columns-2 xl:gap-x-12 [&>div]:break-inside-avoid">
            {slice.items.map((item, i) => (
              <AccordionItem
                key={i}
                q={item.q}
                a={item.a}
                open={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>

          <div className="flex h-full w-full min-w-0 justify-center xl:justify-end">
            <div className="relative w-full max-w-[420px] overflow-hidden bg-surface-muted/20 p-2 ring-1 ring-border/30 shadow-sm xl:max-w-none">
              <div className="relative aspect-square w-full overflow-hidden">
                <iframe
                  title={`Map: ${slice.studioAddress}`}
                  src={googleMapsEmbedSrc}
                  className="absolute inset-0 h-full w-full border-0 grayscale-[0.55] contrast-[0.88]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href={googleMapsOpenHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 z-10 inline-flex min-h-10 items-center gap-1.5 bg-ink px-3 py-2 text-[0.65rem] font-sans font-medium uppercase tracking-[0.12em] text-surface shadow-md transition-colors hover:bg-ink/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface/50"
                >
                  {slice.openInGoogleMaps}
                  <ExternalLink className="size-3 shrink-0" aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </div>
      </InnerWrap>
    </Wrapper>
  );
}
