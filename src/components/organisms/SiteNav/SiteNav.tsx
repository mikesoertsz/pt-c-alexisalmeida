"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa";
import type { Locale } from "@/lib/locale";
import { localizedPath } from "@/lib/locale";
import type { ContentSchema } from "@/content/schema";
import { LanguageSwitcher } from "@/components/molecules/LanguageSwitcher/LanguageSwitcher";
import ButtonStyled from "@/components/atoms/ButtonStyled/ButtonStyled";
import { trackEvent } from "@/lib/analytics";
import { logoNavSrc } from "@/config/branding";

interface SiteNavProps {
  nav: ContentSchema["nav"];
  locale: Locale;
  logoHref: string;
}

export function SiteNav({ nav, logoHref, locale }: SiteNavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const logoSrc = logoNavSrc();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function onBookClick(): void {
    trackEvent("cta_click", { event_category: "engagement", event_label: "nav_book" });
  }

  const navLinkClass =
    "font-body text-xs text-brand-black/60 hover:text-brand-black uppercase tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:text-brand-black";

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 w-full transition-colors duration-300",
        scrolled
          ? "bg-brand-linen border-b border-border"
          : "bg-brand-linen/80",
      ].join(" ")}
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-8 h-16 flex items-center justify-between gap-4">
        <Link
          href={logoHref}
          className="relative inline-flex shrink-0 h-9 max-h-10 items-center focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-tangerine"
        >
          <Image
            src={logoSrc}
            alt={nav.logo}
            width={200}
            height={40}
            className="h-9 w-auto max-h-10 max-w-[min(200px,42vw)] object-contain object-left"
            sizes="200px"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Primary">
          <Link href="#work" className={navLinkClass}>{nav.work}</Link>
          <Link href="#about" className={navLinkClass}>{nav.about ?? "About"}</Link>
          <Link href="#faq" className={navLinkClass}>{nav.faq}</Link>
          <Link href="#contact" className={navLinkClass}>{nav.contact}</Link>
          <Link href={localizedPath(locale, "/booking")} className={navLinkClass} onClick={onBookClick}>{nav.booking}</Link>
        </nav>

        <div className="hidden md:flex items-center gap-5 shrink-0">
          <LanguageSwitcher currentLocale={locale} />
          <a
            href={nav.socialInstagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center text-brand-black/60 hover:text-brand-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-tangerine"
            aria-label="Instagram"
          >
            <FaInstagram className="h-5 w-5" aria-hidden />
          </a>
          <ButtonStyled
            href={localizedPath(locale, "/booking")}
            onClick={onBookClick}
            className="px-5 py-2"
          >
            {nav.booking}
          </ButtonStyled>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="md:hidden inline-flex min-h-11 min-w-11 items-center justify-center text-brand-black/70 hover:text-brand-black focus-visible:outline-none shrink-0"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-brand-linen border-t border-border">
          <nav className="flex flex-col px-6 py-6 gap-5" aria-label="Mobile">
            <LanguageSwitcher currentLocale={locale} className="w-full" />
            <Link
              href="#work"
              onClick={() => setOpen(false)}
              className="font-body text-sm uppercase tracking-[0.12em] text-brand-black/70 hover:text-brand-black transition-colors"
            >
              {nav.work}
            </Link>
            <Link
              href="#about"
              onClick={() => setOpen(false)}
              className="font-body text-sm uppercase tracking-[0.12em] text-brand-black/70 hover:text-brand-black transition-colors"
            >
              {nav.about ?? "About"}
            </Link>
            <Link
              href="#faq"
              onClick={() => setOpen(false)}
              className="font-body text-sm uppercase tracking-[0.12em] text-brand-black/70 hover:text-brand-black transition-colors"
            >
              {nav.faq}
            </Link>
            <Link
              href="#contact"
              onClick={() => setOpen(false)}
              className="font-body text-sm uppercase tracking-[0.12em] text-brand-black/70 hover:text-brand-black transition-colors"
            >
              {nav.contact}
            </Link>
            <Link
              href={localizedPath(locale, "/booking")}
              onClick={() => {
                onBookClick();
                setOpen(false);
              }}
              className="font-body text-sm uppercase tracking-[0.12em] text-brand-black/70 hover:text-brand-black transition-colors"
            >
              {nav.booking}
            </Link>
            <a
              href={nav.socialInstagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 font-body text-sm uppercase tracking-[0.12em] text-brand-black/70 hover:text-brand-black transition-colors"
            >
              Instagram
            </a>
            <ButtonStyled
              href={localizedPath(locale, "/booking")}
              onClick={() => {
                onBookClick();
                setOpen(false);
              }}
              className="mt-2 w-full justify-center"
            >
              {nav.booking}
            </ButtonStyled>
          </nav>
        </div>
      )}
    </header>
  );
}
