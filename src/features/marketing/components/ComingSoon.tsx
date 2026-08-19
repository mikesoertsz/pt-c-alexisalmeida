import Link from "next/link";
import Image from "next/image";
import { CookieConsentBanner } from "@/components/organisms/CookieConsentBanner/CookieConsentBanner";
import ButtonStyled from "@/components/atoms/ButtonStyled/ButtonStyled";
import type { Locale } from "@/lib/locale";
import { localizedPath } from "@/lib/locale";
import type { ContentSchema } from "@/content/schema";
import { logoNavSrc } from "@/config/branding";

interface ComingSoonProps {
  locale: Locale;
  content: ContentSchema;
}

export function ComingSoon({ locale, content }: ComingSoonProps) {
  const slice = content.comingSoon;
  const cookiesPolicyHref = localizedPath(locale, "/legal/cookies");
  const logoHref = localizedPath(locale, "/");

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b-2 border-brand-black bg-brand-linen">
        <div className="flex min-h-16 w-full items-center justify-between gap-2 px-6 md:px-8">
          <Link
            href={logoHref}
            className="relative inline-flex h-9 max-h-10 items-center focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-tangerine"
          >
            <Image
              src={logoNavSrc()}
              alt={content.nav.logo}
              width={200}
              height={40}
              className="h-9 w-auto max-h-10 max-w-[min(200px,50vw)] object-contain object-left"
              sizes="200px"
              priority
            />
          </Link>
          <a
            href={content.nav.socialInstagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs uppercase tracking-[0.12em] text-brand-black/60 hover:text-brand-black transition-colors focus-visible:outline-none"
          >
            Instagram
          </a>
        </div>
      </header>

      <section className="relative min-h-dvh w-full bg-brand-linen flex flex-col justify-end pb-20 md:pb-28 px-6 md:px-12 lg:px-20 pt-32 border-b-2 border-brand-black">
        <div className="max-w-[1440px] mx-auto w-full">
          <span className="font-mono text-xs text-brand-muted uppercase tracking-[0.12em] block mb-8">
            [ {slice.preheading} ]
          </span>

          <h1 className="font-display font-black uppercase text-brand-black leading-[0.9] tracking-tighter text-[clamp(3.5rem,12vw,9rem)] mb-10">
            {slice.headline}
          </h1>

          <div className="w-16 h-0.5 bg-brand-black mb-6" />

          <p className="font-body text-brand-black/70 text-base md:text-lg max-w-md leading-relaxed mb-10">
            {slice.sub}
          </p>

          <ButtonStyled
            href={content.nav.socialInstagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {slice.instagramCta}
          </ButtonStyled>
        </div>
      </section>

      <CookieConsentBanner
        content={content.cookieConsent}
        cookiesPolicyHref={cookiesPolicyHref}
      />
    </>
  );
}
