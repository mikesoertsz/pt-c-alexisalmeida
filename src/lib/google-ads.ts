/**
 * Google Ads conversion tracking helpers.
 *
 * The gtag function is loaded by components/google/GoogleTagsInit.tsx which
 * runs unconditionally. Consent Mode v2 (GoogleConsentMode) handles privacy
 * compliance — with denied defaults, Google models but does not cookie.
 *
 * Conversion labels must be created manually in Google Ads:
 *   Goals → Conversions → New conversion action → Website
 * Then paste the Conversion ID (AW-XXXXXXXXX) and Label here, and set
 * NEXT_PUBLIC_GOOGLE_ADS_ID + NEXT_PUBLIC_GOOGLE_ADS_BOOKING_LABEL etc in Vercel.
 */

export const GOOGLE_ADS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "";

/** Fired on /thank-you after a confirmed Cal.com booking. */
export const GOOGLE_ADS_BOOKING_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_BOOKING_LABEL ?? "";

/** Fired when a visitor clicks the WhatsApp floating button. */
export const GOOGLE_ADS_WHATSAPP_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL ?? "";

/** Fired when a visitor clicks a tel: phone link. */
export const GOOGLE_ADS_PHONE_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_PHONE_LABEL ?? "";

export function isGtagReady(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

/**
 * Fire a generic Google Ads conversion event.
 * No-op if gtag has not loaded or label is empty.
 */
export function trackGoogleAdsConversion(label: string, value?: number) {
  if (!isGtagReady() || !GOOGLE_ADS_ID || !label) return;
  try {
    window.gtag("event", "conversion", {
      send_to: `${GOOGLE_ADS_ID}/${label}`,
      ...(value !== undefined ? { value, currency: "EUR" } : {}),
    });
  } catch {
    /* swallow */
  }
}

/** Confirmed Cal.com booking — fire on /thank-you page mount. */
export function trackBookingConversion() {
  trackGoogleAdsConversion(GOOGLE_ADS_BOOKING_LABEL);
}

/** WhatsApp FAB click — fire on click handler. */
export function trackWhatsAppConversion() {
  trackGoogleAdsConversion(GOOGLE_ADS_WHATSAPP_LABEL);
}

/** tel: link click — fire on click handler. */
export function trackPhoneConversion() {
  trackGoogleAdsConversion(GOOGLE_ADS_PHONE_LABEL);
}
