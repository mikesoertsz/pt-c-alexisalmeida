import Script from "next/script";

const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

/**
 * Loads the Meta (Facebook) Pixel and fires a PageView.
 *
 * GDPR / ePrivacy handling mirrors the Google Consent Mode approach used
 * elsewhere on the site. The pixel is initialised with consent REVOKED, so
 * fbevents.js loads but holds all events and cookies until the visitor opts
 * in to marketing. useConsent().save() calls updateMetaConsent() directly
 * (see src/lib/consent.ts) which fires fbq('consent', 'grant'|'revoke')
 * whenever the visitor's choice changes — this component only handles the
 * initial load and revoke.
 *
 * Standard conversion events are fired elsewhere via trackMetaEvent()
 * (see src/lib/analytics.ts), e.g. the "Lead" event on /thank-you.
 *
 * Renders nothing until NEXT_PUBLIC_META_PIXEL_ID is configured.
 */
export function MetaPixel() {
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
