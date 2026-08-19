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
import type { Locale } from "@/lib/locale";
import { localizedPath } from "@/lib/locale";
import type { ContentSchema } from "@/content/schema";
import { STUDIO_GEO } from "@/config/studio";
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

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TattooParlor",
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
    sameAs: [content.nav.socialInstagramUrl],
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
      <SiteNav
        nav={content.nav}
        locale={locale}
        logoHref={localizedPath(locale, "/")}
        whatsapp={content.whatsapp}
      />
      <main>
        <Hero hero={content.hero} locale={locale} />
        <LocationBanner locale={locale} />
        <PhilosophyStrip slice={content.philosophyStrip} />
        <WorkGrid slice={content.workGrid} />
        <FlashGrid slice={content.flashGrid} />
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
