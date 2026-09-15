import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/components/organisms/SiteNav/SiteNav";
import { SiteFooter } from "@/components/organisms/SiteFooter/SiteFooter";
import { CookieConsentBanner } from "@/components/organisms/CookieConsentBanner/CookieConsentBanner";
import { ContactSection } from "./ContactSection";
import { BookingSection } from "./BookingSection";
import type { Locale } from "@/lib/locale";
import { localizedPath } from "@/lib/locale";
import type { ContentSchema } from "@/content/schema";
import {
  SERVICE_PAGE_PRICE_FROM,
  servicePagePath,
  type ServicePageKey,
  type ServicePagesBundle,
} from "@/content/pages/types";
import { STUDIO_GEO, STUDIO_TELEPHONE, STUDIO_SAME_AS, GOOGLE_REVIEWS } from "@/config/studio";
import { absoluteUrl } from "@/lib/site-url";
import { ogImagePath } from "@/config/branding";

interface ServicePageLandingProps {
  locale: Locale;
  content: ContentSchema;
  bundle: ServicePagesBundle;
  pageKey: ServicePageKey;
}

export function ServicePageLanding({ locale, content, bundle, pageKey }: ServicePageLandingProps) {
  const page = bundle.pages[pageKey];
  const chrome = bundle.chrome;

  const homeHref = localizedPath(locale, "/");
  const pageHref = localizedPath(locale, servicePagePath(pageKey));
  const bookingHref = localizedPath(locale, "/booking");
  const cookiesPolicyHref = localizedPath(locale, "/legal/cookies");

  const homeUrl = absoluteUrl(homeHref === "/" ? "/" : homeHref);
  const pageUrl = absoluteUrl(pageHref);
  const ogImageAbs = absoluteUrl(ogImagePath());
  const priceFrom = SERVICE_PAGE_PRICE_FROM[pageKey];

  const provider: Record<string, unknown> = {
    "@type": "TattooParlor",
    name: content.nav.logo,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rua do Paraíso 82",
      postalCode: "4000-374",
      addressLocality: "Porto",
      addressCountry: "PT",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: STUDIO_GEO.lat,
      longitude: STUDIO_GEO.lng,
    },
    telephone: STUDIO_TELEPHONE,
    sameAs: [content.nav.socialInstagramUrl, ...STUDIO_SAME_AS],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: GOOGLE_REVIEWS.ratingValue,
      reviewCount: GOOGLE_REVIEWS.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  };
  if (homeUrl) provider.url = homeUrl;

  const serviceJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.h1.replace(/\.$/, ""),
    description: page.metaDescription,
    serviceType: page.breadcrumb,
    provider,
    areaServed: [
      { "@type": "City", name: "Porto" },
      { "@type": "Country", name: "Portugal" },
    ],
    availableLanguage: ["English", "Portuguese", "German"],
  };
  if (pageUrl) serviceJsonLd.url = pageUrl;
  if (ogImageAbs) serviceJsonLd.image = [ogImageAbs];
  if (priceFrom !== undefined) {
    serviceJsonLd.offers = {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: priceFrom,
      availability: "https://schema.org/InStock",
    };
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: chrome.breadcrumbHome,
        ...(homeUrl ? { item: homeUrl } : {}),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.breadcrumb,
        ...(pageUrl ? { item: pageUrl } : {}),
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const related = page.related.map((key) => ({
    key,
    href: localizedPath(locale, servicePagePath(key)),
    label: bundle.pages[key].breadcrumb,
    lead: bundle.pages[key].lead,
  }));

  return (
    <>
      <script
        key={`ldjson-service-${locale}-${pageKey}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        key={`ldjson-breadcrumb-${locale}-${pageKey}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        key={`ldjson-faq-${locale}-${pageKey}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <SiteNav
        nav={content.nav}
        locale={locale}
        logoHref={homeHref}
        whatsapp={content.whatsapp}
      />

      <main>
        <section
          data-nav-tone="light"
          className="w-full bg-brand-linen px-6 pt-32 pb-14 md:px-12 md:pt-40 md:pb-20"
        >
          <div className="mx-auto max-w-[1440px]">
            <nav aria-label={chrome.breadcrumbLabel} className="mb-10">
              <ol className="flex flex-row flex-wrap items-center gap-x-2">
                <li>
                  <Link
                    href={homeHref}
                    className="font-mono text-xs uppercase tracking-[0.12em] text-brand-muted no-underline transition-colors hover:text-brand-black"
                  >
                    {chrome.breadcrumbHome}
                  </Link>
                </li>
                <li aria-hidden className="font-mono text-xs text-brand-black/30 select-none">
                  /
                </li>
                <li>
                  <span
                    aria-current="page"
                    className="font-mono text-xs uppercase tracking-[0.12em] text-brand-black"
                  >
                    {page.breadcrumb}
                  </span>
                </li>
              </ol>
            </nav>

            <span className="font-mono text-xs uppercase tracking-[0.12em] text-brand-muted">
              [ {page.preheading} ]
            </span>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-black uppercase leading-[0.9] tracking-tighter text-brand-black md:text-7xl">
              {page.h1}
            </h1>
            <p className="mt-8 max-w-2xl font-body text-lg leading-relaxed text-brand-black/70">
              {page.lead}
            </p>
            <div className="mt-10 flex flex-row flex-wrap items-center gap-4">
              <Link
                href={bookingHref}
                className="inline-flex items-center justify-center border-2 border-brand-tangerine bg-brand-tangerine px-6 py-3 font-body text-xs font-semibold uppercase tracking-[0.12em] text-brand-linen no-underline transition-opacity hover:opacity-90"
              >
                {page.cta.button}
              </Link>
              <Link
                href={homeHref}
                className="inline-flex items-center justify-center border-2 border-brand-black px-6 py-3 font-body text-xs font-semibold uppercase tracking-[0.12em] text-brand-black no-underline transition-colors hover:bg-brand-black hover:text-brand-linen"
              >
                {content.nav.work}
              </Link>
            </div>
          </div>
        </section>

        <section
          data-nav-tone="light"
          aria-label={chrome.highlightsLabel}
          className="w-full border-y-2 border-brand-black bg-brand-cotton px-6 py-10 md:px-12 md:py-12"
        >
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {page.highlights.map((item) => (
              <div key={item.label} className="flex flex-col gap-2 border-t-2 border-brand-black pt-4">
                <span className="font-mono text-xs uppercase tracking-[0.12em] text-brand-muted">
                  {item.label}
                </span>
                <span className="font-mono text-lg leading-tight text-brand-black">{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section
          data-nav-tone="light"
          className="w-full bg-brand-linen px-6 py-20 md:px-12 md:py-28"
        >
          <div className="mx-auto flex max-w-[1440px] flex-col gap-16 md:gap-20">
            {page.sections.map((section) => (
              <article
                key={section.heading}
                className="grid grid-cols-1 gap-6 border-t-2 border-brand-black pt-8 md:grid-cols-3 md:gap-12"
              >
                <h2 className="font-display text-3xl font-black uppercase leading-[0.95] tracking-tighter text-brand-black md:text-4xl">
                  {section.heading}
                </h2>
                <div className="flex flex-col gap-5 md:col-span-2">
                  {section.body.map((paragraph, index) => (
                    <p key={index} className="font-body text-base leading-relaxed text-brand-black/70">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          data-nav-tone="light"
          className="w-full border-t-2 border-brand-black bg-brand-linen"
        >
          <div className="flex flex-col gap-3 px-6 pt-20 pb-10 md:px-12 md:pt-28">
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-brand-muted">
              [ {page.preheading} ]
            </span>
            <h2 className="font-display text-4xl font-black uppercase leading-[0.9] tracking-tighter text-brand-black md:text-5xl">
              {chrome.galleryHeading}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-px bg-brand-linen md:grid-cols-3">
            {page.gallery.map((image) => (
              <div
                key={image.src}
                className="relative aspect-square overflow-hidden bg-brand-linen ring-1 ring-brand-black"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        <section
          data-nav-tone="light"
          className="w-full border-t-2 border-brand-black bg-brand-cotton px-6 py-20 md:px-12 md:py-28"
        >
          <div className="mx-auto flex max-w-[1440px] flex-col gap-12">
            <div className="flex flex-col gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-brand-muted">
                [ {page.breadcrumb} ]
              </span>
              <h2 className="font-display text-4xl font-black uppercase leading-[0.9] tracking-tighter text-brand-black md:text-5xl">
                {chrome.faqHeading}
              </h2>
            </div>
            <div className="flex max-w-3xl flex-col gap-px border-2 border-brand-black bg-brand-black">
              {page.faq.map((item) => (
                <details key={item.q} className="group bg-brand-cotton px-6 py-1 open:pb-4">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 font-display text-lg font-black uppercase text-brand-black marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-tangerine [&::-webkit-details-marker]:hidden">
                    <span className="pt-0.5">{item.q}</span>
                    <span
                      aria-hidden
                      className="mt-1 shrink-0 font-mono text-xs uppercase tracking-[0.12em] text-brand-muted transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="font-body text-sm leading-relaxed text-brand-black/70">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section
          data-nav-tone="light"
          className="w-full border-t-2 border-brand-black bg-brand-linen px-6 py-20 md:px-12 md:py-28"
        >
          <div className="mx-auto flex max-w-[1440px] flex-col gap-12">
            <div className="flex flex-col gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-brand-muted">
                [ {chrome.relatedHeading} ]
              </span>
              <h2 className="font-display text-4xl font-black uppercase leading-[0.9] tracking-tighter text-brand-black md:text-5xl">
                {page.cta.heading}
              </h2>
              <p className="mt-2 max-w-2xl font-body text-base leading-relaxed text-brand-black/70">
                {page.cta.body}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="group flex flex-col gap-3 border-t-2 border-brand-black pt-6 no-underline"
                >
                  <span className="font-display text-2xl font-black uppercase leading-none tracking-tighter text-brand-black transition-colors group-hover:text-brand-tangerine">
                    {item.label}
                  </span>
                  <span className="font-body text-sm leading-relaxed text-brand-black/70">
                    {item.lead}
                  </span>
                </Link>
              ))}
            </div>

            <div>
              <Link
                href={bookingHref}
                className="inline-flex items-center justify-center border-2 border-brand-tangerine bg-brand-tangerine px-6 py-3 font-body text-xs font-semibold uppercase tracking-[0.12em] text-brand-linen no-underline transition-opacity hover:opacity-90"
              >
                {page.cta.button}
              </Link>
            </div>
          </div>
        </section>

        <ContactSection slice={content.contact} />
        <BookingSection slice={content.bookingSection} locale={locale} />
      </main>

      <SiteFooter footer={content.footer} cookieConsent={content.cookieConsent} locale={locale} />
      <CookieConsentBanner content={content.cookieConsent} cookiesPolicyHref={cookiesPolicyHref} />
    </>
  );
}
