import { SiteNav } from "@/components/organisms/SiteNav/SiteNav";
import { SiteFooter } from "@/components/organisms/SiteFooter/SiteFooter";
import { CookieConsentBanner } from "@/components/organisms/CookieConsentBanner/CookieConsentBanner";
import { Hero } from "./Hero";
import { PhilosophyStrip } from "./PhilosophyStrip";
import { WorkGrid } from "./WorkGrid";
import { FlashGrid } from "./FlashGrid";
import { AboutArtist } from "./AboutArtist";
import { Process } from "./Process";
import { Promotions } from "./Promotions";
import { Testimonials } from "./Testimonials";
import { FAQ } from "./FAQ";
import { VideoGallery } from "./VideoGallery";
import { ContactSection } from "./ContactSection";
import { BookingSection } from "./BookingSection";
import { LocationBanner } from "./LocationBanner";
import { TravelScheduleSection } from "./TravelScheduleSection";
import { ServiceLinks } from "./ServiceLinks";
import type { Locale } from "@/lib/locale";
import { localizedPath } from "@/lib/locale";
import type { ContentSchema } from "@/content/schema";
import {
  STUDIO_GEO,
  STUDIO_TELEPHONE,
  STUDIO_SAME_AS,
  GOOGLE_REVIEWS,
  STUDIO_PAYMENT_ACCEPTED,
  STUDIO_CURRENCIES_ACCEPTED,
  studioMapsOpenUrl,
  studioSchemaId,
} from "@/config/studio";
import { absoluteUrl } from "@/lib/site-url";
import { ogImagePath } from "@/config/branding";

interface HomeLandingProps {
  locale: Locale;
  content: ContentSchema;
}

export function HomeLanding({ locale, content }: HomeLandingProps) {
  const cookiesPolicyHref = localizedPath(locale, "/legal/cookies");
  const canonicalPath = localizedPath(locale, "/");
  const canonical = absoluteUrl(canonicalPath === "/" ? "/" : canonicalPath);
  const ogImageAbs = absoluteUrl(ogImagePath());
  const studioId = studioSchemaId();

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TattooParlor",
    ...(studioId ? { "@id": studioId } : {}),
    name: content.nav.logo,
    description: content.meta.description,
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
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "10:00",
        closes: "18:00",
      },
    ],
    areaServed: [
      { "@type": "Country", name: "Portugal" },
      { "@type": "Country", name: "Germany" },
    ],
    availableLanguage: ["English", "Portuguese", "German"],
    priceRange: "€€€",
    paymentAccepted: STUDIO_PAYMENT_ACCEPTED,
    currenciesAccepted: STUDIO_CURRENCIES_ACCEPTED,
    telephone: STUDIO_TELEPHONE,
    hasMap: studioMapsOpenUrl(),
    sameAs: [content.nav.socialInstagramUrl, ...STUDIO_SAME_AS],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: GOOGLE_REVIEWS.ratingValue,
      reviewCount: GOOGLE_REVIEWS.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  if (canonical) jsonLd.url = canonical;
  if (ogImageAbs) jsonLd.image = [ogImageAbs];


  return (
    <>
      <script
        key={`ldjson-${locale}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        key={`ldjson-faq-${locale}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SiteNav
        nav={content.nav}
        locale={locale}
        logoHref={localizedPath(locale, "/")}
        whatsapp={content.whatsapp}
      />
      <main>
        <Hero hero={content.hero} whatsapp={content.whatsapp} locale={locale} />
        <LocationBanner locale={locale} />
        <PhilosophyStrip slice={content.philosophyStrip} />
        <WorkGrid slice={content.workGrid} />
        <FlashGrid slice={content.flashGrid} />
        <ServiceLinks locale={locale} />
        <TravelScheduleSection locale={locale} />
        <AboutArtist slice={content.about} />
        <Process slice={content.process} />
        <Promotions />
        <Testimonials slice={content.testimonials} />
        <VideoGallery />
        <FAQ slice={content.faq} />
        <ContactSection slice={content.contact} />
        <BookingSection slice={content.bookingSection} locale={locale} />
      </main>
      <SiteFooter footer={content.footer} cookieConsent={content.cookieConsent} locale={locale} />
      <CookieConsentBanner
        content={content.cookieConsent}
        cookiesPolicyHref={cookiesPolicyHref}
      />
    </>
  );
}
