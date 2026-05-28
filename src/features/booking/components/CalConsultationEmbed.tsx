"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

interface CalConsultationEmbedProps {
  /** e.g. "lextattoo/consultation" */
  calLink: string;
  /** Full absolute URL of the confirmation page */
  redirectUrl: string;
}

/**
 * Inline Cal.com embed for the consultation event type.
 *
 * Redirect behaviour:
 *   1. `config.redirectUrl` — handled natively by the Cal.com embed script
 *      after the booking completes.
 *   2. `bookingSuccessful` event — fallback programmatic redirect in case the
 *      native redirect does not fire (observed in some embed versions).
 *
 * Styling:
 *   - Light theme, tangerine (#FF6D1F) as the brand accent.
 *   - No event-type detail panel (cleaner inline experience).
 */
export function CalConsultationEmbed({ calLink, redirectUrl }: CalConsultationEmbedProps) {
  useEffect(() => {
    getCalApi().then((cal) => {
      cal("ui", {
        theme: "light",
        hideEventTypeDetails: false,
        layout: "month_view",
        cssVarsPerTheme: {
          light: { "cal-brand": "#FF6D1F" },
          dark: { "cal-brand": "#FF6D1F" },
        },
      });

      // Programmatic fallback redirect after booking completes
      cal("on", {
        action: "bookingSuccessful",
        callback: () => {
          window.location.href = redirectUrl;
        },
      });
    });
  }, [redirectUrl]);

  return (
    <Cal
      calLink={calLink}
      style={{ width: "100%", minHeight: "600px" }}
      config={{
        layout: "month_view",
        theme: "light",
        redirectUrl,
      }}
    />
  );
}
