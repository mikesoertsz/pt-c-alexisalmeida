import { Nav } from "@/app/components/landing/Nav";
import { FooterGutter } from "@/app/components/shared/FooterGutter";
import WhatsAppFloatingButton from "@/app/components/shared/WhatsAppFloatingButton";
import { CookieConsentBanner } from "@/app/components/shared/CookieConsentBanner";
import type { Locale } from "@/app/lib/locale";
import { localizedPath } from "@/app/lib/locale";
import { getContent } from "@/app/content";
import type { PropsWithChildren } from "react";

export default async function LegalDocumentFrame({
  locale,
  children,
}: PropsWithChildren<{
  locale: Locale;
}>) {
  const content = getContent(locale);
  const cookiesPolicyHref = localizedPath(locale, "/legal/cookies");
  const privacyPolicyHref = localizedPath(locale, "/legal/privacy");
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.faq.studioAddress)}`;

  return (
    <>
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
      <main className="grow w-full">{children}</main>
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
