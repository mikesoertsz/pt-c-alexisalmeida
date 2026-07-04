"use client";

import Script from "next/script";
import { useEffect } from "react";
import { useConsent } from "@/hooks/useConsent";

const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

/**
 * Loads the Meta (Facebook) Pixel and fires a PageView.
 *
 * GDPR / ePrivacy handling mirrors the Google Consent Mode approach used
 * elsewhere on the site. The pixel is initialised with consent REVOKED, so
 * fbevents.js loads but holds all events and cookies until the visitor opts
 * in. When the visitor accepts via CookieConsentBanner, the useEffect below
 * calls fbq('consent', 'grant') and the queued PageView (plus any later
 * standard events such as the booking "Lead") are released. Declining keeps
 * consent revoked.
 *
 * Standard conversion events are fired elsewhere via trackMetaEvent()
 * (see src/lib/analytics.ts), e.g. the "Lead" event on /thank-you.
 *
 * Renders nothing until NEXT_PUBLIC_META_PIXEL_ID is configured.
 */
export function MetaPixel() {
  const { consentState } = useConsent();

  useEffect(() => {
    if (!pixelId) return;
    if (consentState === null) return;
    if (typeof window === "undefined") return;
    const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
    if (typeof fbq !== "function") return;

    fbq("consent", consentState === "accepted" ? "grant" : "revoke");
  }, [consentState]);

  if (!pixelId) return null;

  return (
    <>
      <Script id="meta-pixel-init" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('consent', 'revoke');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
