import { Nav } from "@/app/components/landing/Nav";
import { Hero } from "@/app/components/landing/Hero";
import { VideoSection } from "@/app/components/landing/VideoSection";
import { SocialProof } from "@/app/components/landing/SocialProof";
import { Gallery } from "@/app/components/landing/Gallery";
import { Artists } from "@/app/components/landing/Artists";
import { WhyAura } from "@/app/components/landing/WhyAura";
import { HowItWorks } from "@/app/components/landing/HowItWorks";
import { Pricing } from "@/app/components/landing/Pricing";
import { Testimonials } from "@/app/components/landing/Testimonials";
import { FAQ } from "@/app/components/landing/FAQ";
import { ClosingCTA } from "@/app/components/landing/ClosingCTA";
import { FooterGutter } from "@/app/components/shared/FooterGutter";
import { RevealOnScroll } from "@/app/components/RevealOnScroll";
import WhatsAppFloatingButton from "@/app/components/shared/WhatsAppFloatingButton";
import { CookieConsentBanner } from "@/app/components/shared/CookieConsentBanner";
import type { Locale } from "@/app/lib/locale";
import { localizedPath } from "@/app/lib/locale";
import type { ContentSchema } from "@/app/content";

interface HomeLandingProps {
  locale: Locale;
  content: ContentSchema;
}

export default function HomeLanding({ locale, content }: HomeLandingProps) {
  const cookiesPolicyHref = localizedPath(locale, "/legal/cookies");
  const privacyPolicyHref = localizedPath(locale, "/legal/privacy");
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.faq.studioAddress)}`;

  const jsonLd = {
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
    areaServed: [
      { "@type": "Country", name: "Portugal" },
      { "@type": "Country", name: "Germany" },
    ],
    availableLanguage: ["English", "Portuguese", "German"],
    priceRange: "€€",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav
        nav={content.nav}
        locale={locale}
        logoHref={localizedPath(locale, "/")}
        mapsHref={mapsHref}
        styleSwitcherLabels={{
          styleFineLine: content.nav.styleFineLine,
          styleBlackwork: content.nav.styleBlackwork,
        }}
      />
      <main>
        <RevealOnScroll>
          <Hero hero={content.hero} whatsapp={content.whatsapp} />
        </RevealOnScroll>
        <RevealOnScroll>
          <VideoSection section={content.videoSection} />
        </RevealOnScroll>
        <RevealOnScroll delay={100}>
          <SocialProof stats={content.socialProof.stats} />
        </RevealOnScroll>
        <RevealOnScroll>
          <Gallery slice={content.gallery} />
        </RevealOnScroll>
        <RevealOnScroll>
          <Artists slice={content.artists} />
        </RevealOnScroll>
        <RevealOnScroll>
          <WhyAura slice={content.whyUs} />
        </RevealOnScroll>
        <RevealOnScroll>
          <HowItWorks slice={content.howItWorks} />
        </RevealOnScroll>
        <RevealOnScroll>
          <Pricing
            slice={content.pricing}
            consultationButtonLabel={content.nav.booking}
            locale={locale}
          />
        </RevealOnScroll>
        <RevealOnScroll>
          <Testimonials slice={content.testimonials} />
        </RevealOnScroll>
        <RevealOnScroll>
          <FAQ slice={content.faq} />
        </RevealOnScroll>
        <RevealOnScroll>
          <ClosingCTA slice={content.closingCta} whatsapp={content.whatsapp} />
        </RevealOnScroll>
      </main>
      <FooterGutter footer={content.footer} locale={locale} />
      <WhatsAppFloatingButton whatsapp={content.whatsapp} />
      <CookieConsentBanner
        content={content.cookieConsent}
        cookiesPolicyHref={cookiesPolicyHref}
        privacyPolicyHref={privacyPolicyHref}
      />
    </>
  );
}
