"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import type { Locale } from "@/lib/locale";
import { localizedHomeAnchor, localizedPath } from "@/lib/locale";
import type { ContentSchema } from "@/content/schema";
import { LanguageSwitcher } from "@/components/molecules/LanguageSwitcher/LanguageSwitcher";
import ButtonStyled from "@/components/atoms/ButtonStyled/ButtonStyled";
import { trackEvent, trackMetaEvent } from "@/lib/analytics";
import { trackWhatsAppConversion } from "@/lib/google-ads";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { logoNavSrc } from "@/config/branding";
import { cn } from "@/lib/cn";
import { useNavTone } from "./useNavTone";
import { useMobileNav } from "./useMobileNav";

interface SiteNavProps {
  nav: ContentSchema["nav"];
  locale: Locale;
  logoHref: string;
  whatsapp?: ContentSchema["whatsapp"];
}

type NavItem = { href: string; label: string; trackBook?: boolean };

const mobileNavLinkClass =
  "font-body text-sm font-semibold uppercase tracking-[0.12em] text-brand-black/70 hover:text-brand-black transition-colors";

export function SiteNav({ nav, logoHref, locale, whatsapp }: SiteNavProps) {
  const tone = useNavTone();
  const { open, toggle, close, menuId } = useMobileNav();
  const bookingHref = localizedPath(locale, "/booking");
  const whatsappUrl = getWhatsAppUrl({ message: whatsapp?.inquiryMessage });
  const whatsappAriaLabel = whatsapp?.fabAriaLabel ?? "Contact on WhatsApp";
  const logoSrc = logoNavSrc();
  const overDark = tone === "dark";

  const items: NavItem[] = [
    { href: localizedHomeAnchor(locale, "work"), label: nav.work },
    { href: localizedHomeAnchor(locale, "about"), label: nav.about ?? "About" },
    { href: bookingHref, label: nav.booking, trackBook: true },
  ];

  function handleBookClick(): void {
    trackEvent("cta_click", { event_category: "engagement", event_label: "nav_book" });
  }

  function handleWhatsAppClick(): void {
    trackEvent("cta_click", { event_category: "engagement", event_label: "nav_whatsapp" });
    trackWhatsAppConversion();
    // Meta Pixel: attribute the WhatsApp path for Meta-sourced visitors (consent-gated)
    trackMetaEvent("Contact", { content_name: "nav_whatsapp" });
  }

  function onNavigate(item: NavItem): void {
    if (item.trackBook) handleBookClick();
    close();
  }

  const navLinkClass = cn(
    "uppercase transition-colors duration-300 focus-visible:outline-none",
    overDark
      ? "text-sm font-semibold text-white hover:text-white/90 focus-visible:text-white"
      : "font-body text-xs text-brand-black/60 tracking-[0.12em] hover:text-brand-black focus-visible:text-brand-black",
  );

  const utilityButtonClass = cn(
    "inline-flex items-center justify-center rounded-md transition-colors duration-300 hover:bg-white/20",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-tangerine",
    overDark ? "text-white" : "text-brand-black/60 hover:text-brand-black",
  );

  const navCtaClass = cn(
    "px-5 py-2 border-2 border-brand-tangerine bg-brand-tangerine text-brand-linen",
    "transition-opacity duration-300 hover:opacity-90 hover:text-brand-linen",
  );

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-[background-color,backdrop-filter,color] duration-300",
        overDark ? "bg-brand-black/90 backdrop-blur-md" : "bg-brand-linen/95 backdrop-blur-sm",
      )}
    >
      <div className="w-full pl-2 pr-2 flex items-center justify-between gap-4 py-1">
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
              className={cn(
                "h-9 w-auto shadow-md max-h-10 max-w-[min(200px,42vw)] object-contain object-left transition-[filter] duration-300",
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
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={navLinkClass}
              onClick={item.trackBook ? handleBookClick : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2 shrink-0 min-w-0">
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher currentLocale={locale} variant="nav" inverse={overDark} />
            <a
              href={nav.socialInstagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(utilityButtonClass, "h-9 w-9")}
              aria-label="Instagram"
            >
              <FaInstagram className="h-5 w-5" aria-hidden />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              aria-label={whatsappAriaLabel}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#25D366] text-white",
                "transition-opacity duration-300 hover:opacity-90",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-tangerine",
              )}
            >
              <FaWhatsapp className="h-5 w-5" aria-hidden />
            </a>
            <ButtonStyled href={bookingHref} onClick={handleBookClick} className={navCtaClass}>
              {nav.booking}
            </ButtonStyled>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            aria-label={whatsappAriaLabel}
            className={cn(
              "md:hidden inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#25D366] text-white",
              "transition-opacity duration-300 hover:opacity-90",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-tangerine",
            )}
          >
            <FaWhatsapp className="h-5 w-5" aria-hidden />
          </a>
          <button
            type="button"
            onClick={toggle}
            className={cn(
              "md:hidden inline-flex items-center justify-center shrink-0 transition-colors duration-300",
              "brand-tangerine cursor-pointer",
              overDark
                ? "text-white hover:text-white/90"
                : "text-brand-black/70 hover:text-brand-black",
            )}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls={menuId}
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
        id={menuId}
        className={cn(
          "md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out",
          open ? "max-h-[min(100dvh,48rem)] opacity-100" : "max-h-0 opacity-0 pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <nav className="flex flex-col px-4 py-6 gap-5 bg-brand-linen" aria-label="Mobile">
          <LanguageSwitcher currentLocale={locale} variant="nav" className="w-full" />
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onNavigate(item)}
              className={mobileNavLinkClass}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={nav.socialInstagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className={cn(mobileNavLinkClass, "inline-flex items-center gap-2")}
          >
            <FaInstagram className="h-4 w-4" aria-hidden />
            Instagram
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              handleWhatsAppClick();
              close();
            }}
            className={cn(mobileNavLinkClass, "inline-flex items-center gap-2")}
          >
            <FaWhatsapp className="h-4 w-4" aria-hidden />
            WhatsApp
          </a>
          <ButtonStyled
            href={bookingHref}
            onClick={() => {
              handleBookClick();
              close();
            }}
            className={cn("mt-2 w-full justify-center", navCtaClass)}
          >
            {nav.booking}
          </ButtonStyled>
        </nav>
      </div>
    </header>
  );
}
