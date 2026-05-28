"use client";

import Script from "next/script";

const gaId = process.env.NEXT_PUBLIC_GA_ID ?? "";
const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "";

/**
 * Loads a single gtag.js and configures both GA4 and Google Ads.
 *
 * Intentionally NOT gated on consent. Consent Mode v2 defaults are set
 * by GoogleConsentMode (beforeInteractive) which runs before this script.
 * With denied defaults Google sets no cookies and sends no PII — but it
 * CAN model conversions from non-consenting users, which is why the tag
 * must load unconditionally. Gating it on consent defeats Consent Mode
 * entirely and causes total data loss for non-accepting visitors.
 *
 * Ref: https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced
 */
export function GoogleTagsInit() {
  if (!gaId && !adsId) return null;

  const primaryId = gaId || adsId;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
        strategy="afterInteractive"
      />
      <Script id="google-tags-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${gaId ? `gtag('config', '${gaId}');` : ""}
          ${adsId ? `gtag('config', '${adsId}');` : ""}
        `}
      </Script>
    </>
  );
}
