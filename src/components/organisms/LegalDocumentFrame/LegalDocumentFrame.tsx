import { SiteNav } from "@/components/organisms/SiteNav/SiteNav";
import { SiteFooter } from "@/components/organisms/SiteFooter/SiteFooter";
import { CookieConsentBanner } from "@/components/organisms/CookieConsentBanner/CookieConsentBanner";
import type { Locale } from "@/lib/locale";
import { localizedPath } from "@/lib/locale";
import { getContent } from "@/content/get-content";
import type { PropsWithChildren } from "react";

export async function LegalDocumentFrame({
  locale,
  children,
}: PropsWithChildren<{
  locale: Locale;
}>) {
  const content = getContent(locale);
  const cookiesPolicyHref = localizedPath(locale, "/legal/cookies");
  const privacyPolicyHref = localizedPath(locale, "/legal/privacy");

  return (
    <>
      <SiteNav
        nav={content.nav}
        locale={locale}
        logoHref={localizedPath(locale, "/")}
      />
      <main data-nav-tone="light" className="grow w-full bg-brand-linen text-brand-black">
        {children}
      </main>
      <SiteFooter footer={content.footer} locale={locale} />
      <CookieConsentBanner
        content={content.cookieConsent}
        cookiesPolicyHref={cookiesPolicyHref}
        privacyPolicyHref={privacyPolicyHref}
      />
    </>
  );
}
