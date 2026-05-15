import Link from "next/link";
import type { Locale } from "@/app/lib/locale";
import { localizedPath } from "@/app/lib/locale";
import type { ContentSchema } from "@/app/content";

interface Props {
  footer: ContentSchema["footer"];
  locale: Locale;
}

export function FooterGutter({ footer, locale }: Props) {
  return (
    <footer className="w-full border-t border-border/25 bg-surface">
      <div className="grid w-full grid-cols-1 items-center gap-4 px-4 py-4 md:h-[40px] md:grid-cols-3 lg:px-6 lg:py-0">
        <div className="flex flex-row flex-wrap items-center justify-center gap-x-1 md:justify-start">
          <span className="text-[0.68rem] font-sans text-fg-muted">
            {footer.copyright} &copy; {new Date().getFullYear()}.
          </span>
          <p className="text-[0.68rem] font-sans text-fg-muted">{footer.rights}</p>
        </div>

        <nav
          aria-label="Legal"
          className="flex w-full items-center justify-center"
        >
          <ul className="flex flex-row flex-wrap items-center justify-center gap-x-1 gap-y-2">
            {footer.links.map((link, index) => (
              <li key={index} className="flex items-center">
                {index > 0 ? (
                  <span className="text-fg-muted/40 select-none" aria-hidden>
                    ·
                  </span>
                ) : null}
                <Link
                  href={localizedPath(locale, link.url)}
                  className="px-1 text-[0.68rem] font-sans text-fg-muted no-underline transition-colors hover:text-accent"
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center justify-center text-center md:justify-end md:text-right">
          <p className="text-[0.68rem] font-sans text-fg-muted">
            {footer.agencyCreditPrefix}
            <a
              href={footer.agencyUrl}
              className="font-medium text-fg-muted transition-colors hover:text-accent"
              target="_blank"
              rel="noopener noreferrer"
            >
              {footer.agency}
            </a>
            {footer.agencyCreditSuffix}
          </p>
        </div>
      </div>
    </footer>
  );
}
