"use client";

import { TitleBlock } from "@/components/molecules/TitleBlock/TitleBlock";
import type { ContentSchema } from "@/content/schema";

interface FAQProps {
  slice: ContentSchema["faq"];
}

export function FAQ({ slice }: FAQProps) {
  const hasItems = slice.items.length > 0;

  return (
    <section
      id="faq"
      className="w-full scroll-mt-16 border-t-2 border-brand-black bg-brand-linen py-20 md:py-28 px-6 md:px-12"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-12 md:gap-14">
        <TitleBlock theme="light" orientation="left" preheading={`[ ${slice.preheading} ]`} heading={slice.heading} />

        {hasItems ? (
          <div className="flex max-w-3xl flex-col gap-px bg-brand-black border-2 border-brand-black">
            {slice.items.map((item, index) => (
              <details
                key={index}
                className="group bg-brand-linen px-6 py-1 open:pb-4"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 font-display font-black uppercase text-lg text-brand-black marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-tangerine [&::-webkit-details-marker]:hidden">
                  <span className="pt-0.5">{item.q}</span>
                  <span
                    aria-hidden
                    className="mt-1 shrink-0 font-mono text-xs uppercase tracking-[0.12em] text-brand-muted transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="font-body text-sm leading-relaxed text-brand-black/70">{item.a}</p>
              </details>
            ))}
          </div>
        ) : (
          <p className="font-body text-sm text-brand-muted">FAQ updates are on the way.</p>
        )}
      </div>
    </section>
  );
}
