"use client";

import Image from "next/image";
import type { ContentSchema } from "@/content/schema";
import ButtonStyled from "@/components/atoms/ButtonStyled/ButtonStyled";
import { trackEvent } from "@/lib/analytics";

const HERO_IMAGE_SRC = "/img/shortlist/mask-oni-front.jpg";
const HERO_IMAGE_ALT =
  "Oni demon mask blackwork tattoo on upper arm by Lex Almeida, Porto";

interface HeroProps {
  hero: ContentSchema["hero"];
}

export function Hero({ hero }: HeroProps) {
  return (
    <section className="relative isolate w-full min-h-dvh overflow-hidden bg-brand-black flex flex-col justify-center md:justify-end pb-20 md:pb-28 px-6 md:px-12 lg:px-20 border-b-2 border-brand-black">
      <div className="absolute inset-0 -z-10" aria-hidden>
        <Image
          src={HERO_IMAGE_SRC}
          alt={HERO_IMAGE_ALT}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_35%]"
        />
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-1/2 backdrop-blur-sm [mask-image:linear-gradient(to_top,black,transparent)]"
        aria-hidden
      />

      <div className="relative z-10 max-w-[1440px] mx-auto w-full">
        <p className="font-mono text-xs text-white/60 drop-shadow-lg uppercase tracking-[0.12em] mb-8 md:mb-12">
          [ {hero.preheading} ]
        </p>

        <h1 className="font-display font-black uppercase text-white drop-shadow-lg leading-[0.9] tracking-tighter mb-0">
          {hero.headlineLines.map((line) => (
            <span key={line} className="block text-[clamp(3.5rem,12vw,11rem)]">
              {line}
            </span>
          ))}
        </h1>

        <div className="mt-8 md:mt-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="flex flex-col gap-4">
            <div className="w-16 h-0.5 bg-white/60" />
            <p className="font-display font-black uppercase text-white drop-shadow-lg text-2xl md:text-3xl lg:text-4xl tracking-tighter leading-[0.9]">
              {hero.location}
            </p>
            <p className="font-body text-white/60 drop-shadow-lg text-base md:text-lg max-w-md leading-relaxed">
              {hero.sub}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <ButtonStyled
              href="#booking"
              className="bg-white border-white text-brand-black hover:bg-brand-tangerine hover:border-brand-tangerine hover:text-white"
              onClick={() =>
                trackEvent("cta_click", { event_category: "engagement", event_label: "hero_primary" })
              }
            >
              {hero.cta}
            </ButtonStyled>
            <p className="font-mono text-xs text-white/60 drop-shadow-lg uppercase tracking-[0.12em]">
              [ {hero.appointmentNote} ]
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
