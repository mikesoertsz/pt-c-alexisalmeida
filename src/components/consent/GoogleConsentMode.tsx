"use client";

import Script from "next/script";
import { useEffect } from "react";
import { useConsent } from "@/hooks/useConsent";

/**
 * Implements Google Consent Mode v2.
 *
 * The inline script runs as early as possible (beforeInteractive) to define
 * the default denied consent state BEFORE any Google tags load. This lets
 * Google model conversions and traffic from non-consenting users while
 * remaining fully privacy-compliant (GDPR / ePrivacy).
 *
 * When the user makes a choice via CookieConsentBanner, the useEffect fires
 * gtag('consent', 'update', ...) to reflect their decision to all loaded
 * Google tags (GA4 + Google Ads).
 *
 * Portugal is in the EU region list so defaults are denied for PT visitors.
 *
 * Ref: https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced
 */
export function GoogleConsentMode() {
  const { consentState } = useConsent();

  useEffect(() => {
    // Only fire an update when the visitor has made an explicit choice.
    // consentState === null means the banner hasn't been interacted with yet.
    if (consentState === null) return;
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;

    const state = consentState === "accepted" ? "granted" : "denied";

    window.gtag("consent", "update", {
      ad_storage: state,
      analytics_storage: state,
      ad_user_data: state,
      ad_personalization: state,
    });
  }, [consentState]);

  return (
    <Script id="google-consent-mode-default" strategy="beforeInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('consent', 'default', {
          ad_storage: 'denied',
          analytics_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          wait_for_update: 2000,
          region: ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','GB','IS','LI','NO','CH'],
        });
        gtag('set', 'ads_data_redaction', true);
        gtag('set', 'url_passthrough', true);
      `}
    </Script>
  );
}
