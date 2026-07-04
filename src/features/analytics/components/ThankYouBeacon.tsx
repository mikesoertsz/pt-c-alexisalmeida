"use client";

import { useEffect } from "react";
import { trackEvent, trackMetaEvent } from "@/lib/analytics";
import { trackBookingConversion } from "@/lib/google-ads";

/**
 * Fires ad platform conversion events when the thank-you / booking confirmation
 * page loads. Runs once on mount (no server execution).
 *
 * Google Ads: "generate_lead" is the recommended standard event for lead-gen
 * conversion actions. A matching Google Ads conversion action should be created
 * with "Event" trigger and event name "generate_lead".
 *
 * Meta Pixel: "Lead" is the standard event. Configure the corresponding Meta
 * Ads conversion event against this pixel event.
 */
export function ThankYouBeacon() {
  useEffect(() => {
    // Google Ads — fires the Booking Confirmed conversion action (AW-XXXXXXXXX/label)
    trackBookingConversion();

    // Google Analytics 4 — standard lead conversion event (marked as the
    // GA4 Key Event for this property — see admin/events/hub in GA4)
    trackEvent("generate_lead", { event_category: "booking", event_label: "consultation" });

    // Meta Pixel — standard Lead event (fires only when Pixel is loaded)
    trackMetaEvent("Lead", { content_name: "consultation_booking" });
  }, []);
  return null;
}
