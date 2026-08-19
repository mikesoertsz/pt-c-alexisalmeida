import Link from "next/link";
import type { Locale } from "@/lib/locale";
import { localizedPath } from "@/lib/locale";
import type { ContentSchema } from "@/content/schema";
import { CookieSettingsLink } from "@/components/organisms/CookieConsentBanner/CookieSettingsLink";

interface SiteFooterProps {
  footer: ContentSchema["footer"];
  cookieConsent: ContentSchema["cookieConsent"];
  locale: Locale;
}

export function SiteFooter({ footer, cookieConsent, locale }: SiteFooterProps) {
  return (
    <footer data-nav-tone="light" className="w-full border-t-2 border-brand-black bg-brand-cotton">
      <div className="grid w-full grid-cols-1 items-center gap-4 px-6 py-5 md:h-[48px] md:grid-cols-3 md:py-0 lg:px-8">
        <div className="flex flex-row flex-wrap items-center justify-center gap-x-1 md:justify-start">
          <span className="font-mono text-xs text-brand-muted">
            {footer.copyright} &copy; {new Date().getFullYear()}.
          </span>
          <p className="font-mono text-xs text-brand-muted">{footer.rights}</p>
        </div>

        <nav aria-label="Legal" className="flex w-full items-center justify-center">
          <ul className="flex flex-row flex-wrap items-center justify-center gap-x-1 gap-y-2">
            {footer.links.map((link, index) => (
              <li key={index} className="flex items-center">
                {index > 0 ? (
                  <span className="text-brand-black/30 select-none" aria-hidden>
                    ·
                  </span>
                ) : null}
                <Link
                  href={localizedPath(locale, link.url)}
                  className="px-1 font-mono text-xs text-brand-muted no-underline transition-colors hover:text-brand-black"
                >
                  {link.text}
                </Link>
              </li>
            ))}
            <li className="flex items-center">
              <span className="text-brand-black/30 select-none" aria-hidden>
                ·
              </span>
              <CookieSettingsLink
                label={cookieConsent.manageCookiesLabel}
                className="px-1 font-mono text-xs text-brand-muted no-underline transition-colors hover:text-brand-black"
              />
            </li>
          </ul>
        </nav>

        <div className="flex items-center justify-center gap-4 text-center md:justify-end md:text-right">
          <p className="font-mono text-xs text-brand-muted">
            {footer.agencyCreditPrefix}
            <a
              href={footer.agencyUrl}
              className="text-brand-muted transition-colors hover:text-brand-black"
              target="_blank"
              rel="noopener noreferrer"
            >
              {footer.agency}
            </a>
            {footer.agencyCreditSuffix}
          </p>
          <Link
            href="/admin"
            className="font-mono text-xs text-brand-black/20 hover:text-brand-black/50 transition-colors"
            aria-label="Admin"
          >
            admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
