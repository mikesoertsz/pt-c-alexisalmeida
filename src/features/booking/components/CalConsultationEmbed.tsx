"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

// cal.eu is the EU-hosted Cal instance used for this client.
const CAL_ORIGIN = "https://cal.eu";
const CAL_EMBED_JS_URL = "https://app.cal.eu/embed/embed.js";

interface CalConsultationEmbedProps {
  /** e.g. "lextattoo/free-intake-consultation" */
  calLink: string;
  /** Full absolute URL of the confirmation page */
  redirectUrl: string;
}

/**
 * Inline cal.eu embed for the consultation event type.
 *
 * Redirect behaviour:
 *   1. `config.redirectUrl` — handled natively by the cal.eu embed script
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
    getCalApi(CAL_EMBED_JS_URL).then((cal) => {
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
      calOrigin={CAL_ORIGIN}
      embedJsUrl={CAL_EMBED_JS_URL}
      style={{ width: "100%", minHeight: "600px" }}
      config={{
        layout: "month_view",
        theme: "light",
        redirectUrl,
      }}
    />
  );
}
