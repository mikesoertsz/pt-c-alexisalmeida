"use client";

import Image from "next/image";
import { useState, useEffect, useId } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Menu, X } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import type { Locale } from "@/lib/locale";
import { localizedPath } from "@/lib/locale";
import type { ContentSchema } from "@/content/schema";
import { LanguageSwitcher } from "@/components/molecules/LanguageSwitcher/LanguageSwitcher";
import ButtonStyled from "@/components/atoms/ButtonStyled/ButtonStyled";
import { trackEvent } from "@/lib/analytics";
import { logoNavSrc } from "@/config/branding";
import { useNavTone } from "./useNavTone";

interface SiteNavProps {
  nav: ContentSchema["nav"];
  locale: Locale;
  logoHref: string;
}

export function SiteNav({ nav, logoHref, locale }: SiteNavProps) {
  const [open, setOpen] = useState(false);
  const tone = useNavTone();
  const mobileMenuId = useId();
  const logoSrc = logoNavSrc();
  const overDark = tone === "dark";

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(ev: KeyboardEvent) {
      if (ev.key === "Escape") setOpen(false);
    }

    function onResize() {
      if (window.matchMedia("(min-width: 768px)").matches) setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  function onBookClick(): void {
    trackEvent("cta_click", { event_category: "engagement", event_label: "nav_book" });
  }

  const navLinkClass = clsx(
    "uppercase transition-colors duration-300 focus-visible:outline-none",
    overDark
      ? "text-sm font-semibold text-white hover:text-white/90 focus-visible:text-white"
      : "font-body text-xs text-brand-black/60 tracking-[0.12em] hover:text-brand-black focus-visible:text-brand-black",
  );

  const utilityButtonClass = clsx(
    "inline-flex items-center justify-center rounded-md transition-colors duration-300 hover:bg-white/20",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-tangerine",
    overDark ? "text-white" : "text-brand-black/60 hover:text-brand-black",
  );

  const navCtaClass = clsx(
    "px-5 py-2 transition-opacity duration-300 hover:opacity-90",
    overDark ? "bg-white text-brand-black" : "bg-brand-black text-white",
  );

  const mobileNavLinkClass =
    "font-body text-sm font-semibold uppercase tracking-[0.12em] text-brand-black/70 hover:text-brand-black transition-colors";

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 w-full transition-[background-color,backdrop-filter,color] duration-300",
        overDark ? "bg-white/10 backdrop-blur-md" : "bg-brand-linen/95 backdrop-blur-sm",
      )}
    >
      <div className="w-full px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center justify-start min-w-0">
          <Link
            href={logoHref}
            className="relative inline-flex shrink-0 h-9 max-h-10 items-center focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-tangerine"
          >
            <Image
              src={logoSrc}
              alt={nav.logo}
              width={200}
              height={40}
              className={clsx(
                "h-9 w-auto max-h-10 max-w-[min(200px,42vw)] object-contain object-left transition-[filter] duration-300",
                overDark && "brightness-0 invert",
              )}
              sizes="200px"
              priority
            />
          </Link>
        </div>

        <nav
          className="hidden md:flex flex-1 items-center justify-center gap-6 lg:gap-8"
          aria-label="Primary"
        >
          <Link href="#work" className={navLinkClass}>
            {nav.work}
          </Link>
          <Link href="#about" className={navLinkClass}>
            {nav.about ?? "About"}
          </Link>
          <Link href={localizedPath(locale, "/booking")} className={navLinkClass} onClick={onBookClick}>
            {nav.booking}
          </Link>
        </nav>

        <div className="flex flex-1 items-center justify-end gap-5 shrink-0 min-w-0">
          <div className="hidden md:flex items-center gap-5">
            <LanguageSwitcher currentLocale={locale} variant="nav" inverse={overDark} />
            <a
              href={nav.socialInstagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(utilityButtonClass, "h-9 w-9")}
              aria-label="Instagram"
            >
              <FaInstagram className="h-5 w-5" aria-hidden />
            </a>
            <ButtonStyled
              href={localizedPath(locale, "/booking")}
              onClick={onBookClick}
              className={navCtaClass}
            >
              {nav.booking}
            </ButtonStyled>
          </div>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className={clsx(
              "md:hidden inline-flex min-h-11 min-w-11 items-center justify-center shrink-0 transition-colors duration-300",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-tangerine",
              overDark
                ? "text-white hover:text-white/90"
                : "text-brand-black/70 hover:text-brand-black",
            )}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls={mobileMenuId}
          >
            {open ? (
              <X className="h-6 w-6" strokeWidth={1.5} aria-hidden />
            ) : (
              <Menu className="h-6 w-6" strokeWidth={1.5} aria-hidden />
            )}
          </button>
        </div>
      </div>

      <div
        id={mobileMenuId}
        className={clsx(
          "md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out",
          open ? "max-h-[min(100dvh,48rem)] opacity-100" : "max-h-0 opacity-0 pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <nav className="flex flex-col px-4 py-6 gap-5 bg-brand-linen" aria-label="Mobile">
          <LanguageSwitcher currentLocale={locale} variant="nav" className="w-full" />
          <Link href="#work" onClick={() => setOpen(false)} className={mobileNavLinkClass}>
            {nav.work}
          </Link>
          <Link href="#about" onClick={() => setOpen(false)} className={mobileNavLinkClass}>
            {nav.about ?? "About"}
          </Link>
          <Link
            href={localizedPath(locale, "/booking")}
            onClick={() => {
              onBookClick();
              setOpen(false);
            }}
            className={mobileNavLinkClass}
          >
            {nav.booking}
          </Link>
          <a
            href={nav.socialInstagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className={clsx(mobileNavLinkClass, "inline-flex items-center gap-2")}
          >
            <FaInstagram className="h-4 w-4" aria-hidden />
            Instagram
          </a>
          <ButtonStyled
            href={localizedPath(locale, "/booking")}
            onClick={() => {
              onBookClick();
              setOpen(false);
            }}
            className={clsx("mt-2 w-full justify-center", navCtaClass)}
          >
            {nav.booking}
          </ButtonStyled>
        </nav>
      </div>
    </header>
  );
}
