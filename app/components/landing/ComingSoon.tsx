"use client";

import Image from "next/image";
import Link from "next/link";
import { SiInstagram } from "react-icons/si";
import LanguageSwitcher from "@/app/components/shared/LanguageSwitcher";
import StyleSwitcher from "@/app/components/shared/StyleSwitcher";
import { CookieConsentBanner } from "@/app/components/shared/CookieConsentBanner";
import { TitleBlock } from "@/app/components/TitleBlock";
import type { Locale } from "@/app/lib/locale";
import { localizedPath } from "@/app/lib/locale";
import type { ContentSchema } from "@/app/content";
import { useStyleMedia } from "@/app/components/ArtistStyleProvider";

interface ComingSoonProps {
  locale: Locale;
  content: ContentSchema;
}

export default function ComingSoon({ locale, content }: ComingSoonProps) {
  const slice = content.comingSoon;
  const cookiesPolicyHref = localizedPath(locale, "/legal/cookies");
  const privacyPolicyHref = localizedPath(locale, "/legal/privacy");
  const logoHref = localizedPath(locale, "/");
  const bgSrc = useStyleMedia(content.hero.media).backgroundSrc;

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-sage/20 bg-mist/95 backdrop-blur supports-backdrop-filter:bg-mist/82">
        <div className="flex min-h-14 w-full items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
          <Link
            href={logoHref}
            className="text-sm font-semibold tracking-tight text-ink transition-colors hover:text-terracotta shrink-0"
          >
            {content.nav.logo}
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            <StyleSwitcher
              labels={{
                fineLine: content.nav.styleFineLine,
                blackwork: content.nav.styleBlackwork,
              }}
            />
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </div>
      </header>

      <section className="relative mx-auto flex min-h-dvh w-full flex-col justify-center overflow-hidden bg-ink pt-16 pb-12 md:pb-16">
        <div className="pointer-events-none absolute inset-0 z-0">
          <Image
            key={bgSrc}
            src={bgSrc}
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-[1.02] object-cover object-center brightness-[0.42] contrast-[1.08] grayscale"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 z-1 bg-transparent backdrop-blur-md"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 z-1 bg-ink/52" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 z-1 bg-[radial-gradient(ellipse_120%_80%_at_0%_-10%,color-mix(in_oklab,var(--color-mist)_24%,transparent),transparent_55%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-1 bg-terracotta/14 mix-blend-soft-light"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-1 bg-olive/22 mix-blend-multiply"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-1 bg-linear-to-br from-mist/14 via-transparent to-sage/12"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-[-20%] top-1/2 z-1 h-[140%] w-[55%] -translate-y-1/2 rotate-18 bg-linear-to-l from-ink/72 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex w-full max-w-lg flex-col items-center px-4 md:px-8">
          <TitleBlock
            isHero={false}
            headingLevel="h1"
            theme="dark"
            orientation="center"
            preheading={slice.preheading}
            heading={slice.headline}
            subheading={slice.sub}
          />
          <a
            href={content.nav.socialInstagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-sm text-white/65 underline decoration-white/25 underline-offset-4 transition-colors hover:text-blush hover:decoration-blush/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/40"
          >
            <SiInstagram className="h-4 w-4 shrink-0" aria-hidden />
            {slice.instagramCta}
          </a>
        </div>
      </section>

      <CookieConsentBanner
        content={content.cookieConsent}
        cookiesPolicyHref={cookiesPolicyHref}
        privacyPolicyHref={privacyPolicyHref}
      />
    </>
  );
}
