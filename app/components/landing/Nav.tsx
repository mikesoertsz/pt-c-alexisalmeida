"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { SiInstagram, SiTiktok } from "react-icons/si";
import type { Locale } from "@/app/lib/locale";
import type { ContentSchema } from "@/app/content";
import LanguageSwitcher from "@/app/components/shared/LanguageSwitcher";
import StyleSwitcher from "@/app/components/shared/StyleSwitcher";

const socialIconBtn =
  "p-2.5 text-ink/45 hover:text-ink transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50";

const navLinkClass =
  "text-xs font-sans font-medium text-ink/60 hover:text-ink transition-colors tracking-wide focus-visible:text-ink focus-visible:outline-none motion-reduce:transition-none";

interface NavProps {
  nav: ContentSchema["nav"];
  locale: Locale;
  logoHref: string;
  mapsHref: string;
  styleSwitcherLabels: Pick<ContentSchema["nav"], "styleFineLine" | "styleBlackwork">;
}

function ExternalIconLink(props: {
  href: string;
  ariaLabel: string;
  children: ReactNode;
}) {
  return (
    <a
      href={props.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={props.ariaLabel}
      className={socialIconBtn}
    >
      {props.children}
    </a>
  );
}

export function Nav({ nav, locale, logoHref, mapsHref, styleSwitcherLabels }: NavProps) {
  const [open, setOpen] = useState(false);

  const iconCluster = (
    <div className="flex items-center gap-0 border-l border-border/25 pl-3 ml-1 md:pl-4 md:ml-2">
      <ExternalIconLink href={nav.socialInstagramUrl} ariaLabel="Lex Almeida on Instagram">
        <SiInstagram className="h-4 w-4" aria-hidden />
      </ExternalIconLink>
      <ExternalIconLink href={nav.socialTiktokUrl} ariaLabel="Lex Almeida on TikTok">
        <SiTiktok className="h-4 w-4" aria-hidden />
      </ExternalIconLink>
      <ExternalIconLink href={mapsHref} ariaLabel="Open studio location in Google Maps">
        <MapPin className="h-4 w-4" aria-hidden />
      </ExternalIconLink>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-surface/88 backdrop-blur-sm supports-backdrop-filter:bg-surface/75">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 min-h-14 md:min-h-16 flex items-center justify-between gap-3">
        <Link
          href={logoHref}
          className="font-sans font-light text-base tracking-[0.12em] uppercase text-ink hover:text-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50 shrink-0"
        >
          {nav.logo}
        </Link>

        <nav className="hidden md:flex items-center gap-7 lg:gap-9 border-r border-border/25 pr-6 lg:pr-8 mr-1" aria-label="Primary">
          <Link href="#gallery" className={navLinkClass}>
            {nav.work}
          </Link>
          <Link href="#how-it-works" className={navLinkClass}>
            {nav.howItWorks}
          </Link>
          <Link href="#pricing" className={navLinkClass}>
            {nav.pricing}
          </Link>
          <Link href="#faq" className={navLinkClass}>
            {nav.faq}
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-2 lg:gap-3 flex-1 justify-end min-w-0">
          {iconCluster}

          <StyleSwitcher
            labels={{ fineLine: styleSwitcherLabels.styleFineLine, blackwork: styleSwitcherLabels.styleBlackwork }}
            className="shrink-0 border-l border-border/25 pl-3 lg:pl-4"
          />

          <LanguageSwitcher currentLocale={locale} className="shrink-0 border-l border-border/25 pl-3 lg:pl-4" />

          <Link
            href="#booking"
            className="shrink-0 inline-flex h-9 items-center justify-center bg-accent px-5 text-[0.7rem] font-sans font-medium uppercase tracking-[0.15em] text-on-accent transition-colors hover:bg-accent/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/80"
          >
            {nav.booking}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="md:hidden inline-flex min-h-11 min-w-11 items-center justify-center text-ink/60 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/20 bg-surface">
          <div className="px-4 sm:px-6 py-4 flex flex-col gap-4 border-b border-border/15">
            <StyleSwitcher
              labels={{ fineLine: styleSwitcherLabels.styleFineLine, blackwork: styleSwitcherLabels.styleBlackwork }}
              className="w-full"
            />
            <LanguageSwitcher currentLocale={locale} className="w-full" />
            <div className="flex items-center gap-1 -ml-1">{iconCluster}</div>
          </div>
          <nav className="flex flex-col" aria-label="Mobile">
            <Link
              href="#gallery"
              onClick={() => setOpen(false)}
              className="text-sm font-sans font-medium text-ink/70 py-4 px-4 border-b border-border/15 active:bg-surface-muted/40 tracking-wide"
            >
              {nav.work}
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setOpen(false)}
              className="text-sm font-sans font-medium text-ink/70 py-4 px-4 border-b border-border/15 active:bg-surface-muted/40 tracking-wide"
            >
              {nav.howItWorks}
            </Link>
            <Link
              href="#pricing"
              onClick={() => setOpen(false)}
              className="text-sm font-sans font-medium text-ink/70 py-4 px-4 border-b border-border/15 active:bg-surface-muted/40 tracking-wide"
            >
              {nav.pricing}
            </Link>
            <Link
              href="#faq"
              onClick={() => setOpen(false)}
              className="text-sm font-sans font-medium text-ink/70 py-4 px-4 border-b border-border/15 active:bg-surface-muted/40 tracking-wide"
            >
              {nav.faq}
            </Link>
            <Link
              href="#booking"
              onClick={() => setOpen(false)}
              className="mx-4 my-4 inline-flex h-11 items-center justify-center bg-accent px-5 text-[0.7rem] font-sans font-medium uppercase tracking-[0.15em] text-on-accent"
            >
              {nav.booking}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
