"use client";

import Image from "next/image";
import Link from "next/link";
import { TitleBlock } from "@/app/components/TitleBlock";
import type { ContentSchema } from "@/app/content";
import { getWhatsAppUrl } from "@/app/lib/whatsapp";
import HeroGallery from "@/app/components/landing/HeroGallery";
import { useStyleMedia } from "@/app/components/ArtistStyleProvider";

interface Props {
  hero: ContentSchema["hero"];
  whatsapp: ContentSchema["whatsapp"];
}

export function Hero({ hero, whatsapp }: Props) {
  const whatsAppUrl = getWhatsAppUrl();
  const media = useStyleMedia(hero.media);

  return (
    <section className="relative mx-auto w-full snap-always snap-center overflow-hidden bg-hero-void pt-20 pb-24 md:pt-28 md:pb-32">
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          key={media.backgroundSrc}
          src={media.backgroundSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.02] grayscale brightness-[0.38] contrast-[1.1]"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-1 bg-hero-void/50"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-1 bg-linear-to-r from-hero-void/50 via-hero-void/20 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-1 bg-linear-to-t from-hero-void/30 via-transparent to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16 xl:gap-20 px-4 md:px-8 lg:px-12">
        <div className="flex min-h-[min(56vh,520px)] flex-col justify-center lg:min-h-[min(72vh,640px)] lg:pr-4 xl:pr-8">
          <TitleBlock
            isHero={false}
            headingLevel="h1"
            theme="dark"
            orientation="left"
            className="max-w-prose max-lg:mx-auto max-lg:text-center max-lg:items-center"
            preheading={hero.preheading}
            heading={hero.headline}
            subheading={hero.sub}
          />

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start w-full max-lg:mx-auto">
            <Link
              href="#booking"
              className="inline-flex items-center justify-center bg-accent px-8 py-4 text-[0.7rem] font-sans font-medium uppercase tracking-[0.18em] text-on-accent transition-colors hover:bg-accent/85"
            >
              {hero.cta_primary}
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center border border-brand-dusty-white/25 bg-transparent px-8 py-4 text-[0.7rem] font-sans font-medium uppercase tracking-[0.18em] text-brand-dusty-white/80 transition-colors hover:border-brand-dusty-white/45 hover:text-brand-dusty-white"
            >
              {hero.cta_secondary}
              <svg
                className="ml-2.5 h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </Link>
          </div>

          <p className="mt-6 max-w-md text-[0.68rem] text-brand-dusty-white/40 tracking-[0.12em] uppercase text-center lg:text-left lg:mx-0 mx-auto">{hero.guarantee}</p>

          {whatsAppUrl && (
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-xs text-brand-dusty-white/35 underline underline-offset-3 transition-colors hover:text-brand-dusty-white/60 text-center lg:text-left mx-auto lg:mx-0 font-sans"
            >
              {whatsapp.heroLink}
            </a>
          )}
        </div>

        <div className="relative flex w-full justify-center lg:justify-end lg:border-l lg:border-brand-dusty-white/8 lg:pl-10 xl:pl-14">
          <HeroGallery slides={media.slides} />
        </div>
      </div>
    </section>
  );
}
