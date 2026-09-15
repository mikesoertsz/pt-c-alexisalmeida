import Link from "next/link";
import { AnimateIn, StaggerIn, StaggerItem } from "@/components/atoms/AnimateIn/AnimateIn";
import type { Locale } from "@/lib/locale";
import { localizedPath } from "@/lib/locale";
import { getServicePages } from "@/content/pages/get-service-pages";
import { SERVICE_PAGE_KEYS, servicePagePath } from "@/content/pages/types";

interface ServiceLinksProps {
  locale: Locale;
}

export function ServiceLinks({ locale }: ServiceLinksProps) {
  const { chrome, pages } = getServicePages(locale);

  return (
    <section
      data-nav-tone="light"
      className="w-full border-t-2 border-brand-black bg-brand-linen px-6 py-20 md:px-12 md:py-28"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-12 md:gap-14">
        <AnimateIn>
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-brand-muted">
              [ {chrome.homeLinksLabel} ]
            </span>
            <h2 className="font-display text-4xl font-black uppercase leading-[0.9] tracking-tighter text-brand-black md:text-5xl lg:text-6xl">
              {chrome.homeLinksHeading}
            </h2>
          </div>
        </AnimateIn>

        <StaggerIn className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 md:gap-10">
          {SERVICE_PAGE_KEYS.map((key) => (
            <StaggerItem key={key}>
              <Link
                href={localizedPath(locale, servicePagePath(key))}
                className="group flex h-full flex-col gap-3 border-t-2 border-brand-black pt-6 no-underline"
              >
                <span className="font-display text-2xl font-black uppercase leading-none tracking-tighter text-brand-black transition-colors group-hover:text-brand-tangerine">
                  {pages[key].breadcrumb}
                </span>
                <span className="font-body text-sm leading-relaxed text-brand-black/70">
                  {pages[key].lead}
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerIn>
      </div>
    </section>
  );
}
