import Link from "next/link";
import { Wrapper, InnerWrap } from "@/app/components/atoms";
import { TitleBlock } from "@/app/components/TitleBlock";
import type { ContentSchema } from "@/app/content";
import { getWhatsAppUrl } from "@/app/lib/whatsapp";

interface Props {
  slice: ContentSchema["closingCta"];
  whatsapp: ContentSchema["whatsapp"];
}

export function ClosingCTA({ slice: closingCta, whatsapp }: Props) {
  const whatsAppUrl = getWhatsAppUrl();

  return (
    <Wrapper className="border-t border-brand-foggy-gray/20 bg-brand-granite scroll-mt-16 py-16 md:py-24">
      <InnerWrap className="items-start px-4 md:px-10 lg:px-14 w-full max-w-2xl self-start">
        <TitleBlock
          orientation="left"
          theme="dark"
          heading={closingCta.heading}
          subheading={closingCta.subheading}
        />

        <div className="mt-8 flex w-full flex-col gap-4 sm:flex-row sm:justify-start sm:items-center">
          <Link
            href="#booking"
            scroll
            className="inline-flex min-h-11 items-center justify-center px-8 py-3.5 text-[0.7rem] font-sans font-medium uppercase tracking-[0.16em] text-brand-granite bg-brand-dusty-white hover:bg-brand-dusty-white/85 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dusty-white/80"
          >
            {closingCta.cta}
          </Link>
          {whatsAppUrl && (
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center px-6 py-3.5 text-[0.7rem] font-sans font-medium uppercase tracking-[0.14em] text-brand-dusty-white/70 hover:text-brand-dusty-white border border-brand-dusty-white/15 hover:border-brand-dusty-white/35 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dusty-white/30"
            >
              {whatsapp.closingLink}
            </a>
          )}
        </div>

        <div
          className="mt-12 mb-10 w-16 h-px bg-accent/35"
          aria-hidden="true"
        />

        <p className="text-[0.68rem] font-sans text-brand-dusty-white/35 max-w-md tracking-[0.06em] leading-relaxed">{closingCta.guarantee}</p>
      </InnerWrap>
    </Wrapper>
  );
}
