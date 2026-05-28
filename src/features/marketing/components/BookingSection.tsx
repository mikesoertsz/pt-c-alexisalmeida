import type { ContentSchema } from "@/content/schema";
import ButtonStyled from "@/components/atoms/ButtonStyled/ButtonStyled";

const CAL_USERNAME = "lextattoo";
const CAL_CONSULTATION_SLUG =
  process.env.CAL_CONSULTATION_EVENT_SLUG?.trim() || "consultation";

function consultationUrl(): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL?.trim() || "https://lextattoo.com";
  const confirmPage = `${base}/thank-you`;
  return (
    `https://cal.com/${CAL_USERNAME}/${CAL_CONSULTATION_SLUG}` +
    `?redirectUrl=${encodeURIComponent(confirmPage)}`
  );
}

interface BookingSectionProps {
  slice: ContentSchema["bookingSection"];
}

export function BookingSection({ slice }: BookingSectionProps) {
  const calUrl = consultationUrl();

  return (
    <section id="booking" className="w-full bg-brand-linen border-t-2 border-brand-black py-28 md:py-36 px-6 md:px-12 scroll-mt-16">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center gap-8">
        <h2 className="font-display font-black uppercase text-brand-black text-4xl md:text-6xl lg:text-7xl leading-[0.9] tracking-tighter">
          {slice.headline}
        </h2>

        <div className="w-16 h-0.5 bg-brand-black" />

        <ButtonStyled
          href={calUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-10 py-5"
        >
          {slice.cta}
        </ButtonStyled>

        <p className="font-mono text-xs text-brand-muted uppercase tracking-[0.12em]">
          [ {slice.note} ]
        </p>
      </div>
    </section>
  );
}
