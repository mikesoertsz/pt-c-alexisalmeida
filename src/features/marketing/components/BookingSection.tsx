import type { ContentSchema } from "@/content/schema";
import type { Locale } from "@/lib/locale";
import { localizedPath } from "@/lib/locale";
import ButtonStyled from "@/components/atoms/ButtonStyled/ButtonStyled";
import { AnimateIn } from "@/components/atoms/AnimateIn/AnimateIn";

interface BookingSectionProps {
  slice: ContentSchema["bookingSection"];
  locale: Locale;
}

export function BookingSection({ slice, locale }: BookingSectionProps) {
  return (
    <section id="booking" className="w-full bg-brand-linen border-t-2 border-brand-black py-28 md:py-36 px-6 md:px-12 scroll-mt-16">
      <AnimateIn>
        <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center gap-8">
          <h2 className="font-display font-black uppercase text-brand-black text-4xl md:text-6xl lg:text-7xl leading-[0.9] tracking-tighter">
            {slice.headline}
          </h2>

          <div className="w-16 h-0.5 bg-brand-black" />

          <ButtonStyled
            href={localizedPath(locale, "/booking")}
            className="px-10 py-5"
          >
            {slice.cta}
          </ButtonStyled>

          <p className="font-mono text-xs text-brand-muted uppercase tracking-[0.12em]">
            [ {slice.note} ]
          </p>
        </div>
      </AnimateIn>
    </section>
  );
}
