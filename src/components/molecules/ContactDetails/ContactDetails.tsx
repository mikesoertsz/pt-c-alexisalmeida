"use client";

import { trackEvent } from "@/lib/analytics";
import { trackPhoneConversion } from "@/lib/google-ads";

interface ContactDetailsProps {
  phoneLabel: string;
  phoneDisplay: string;
  phoneTel: string;
  emailLabel: string;
  email: string;
}

/**
 * Renders the studio phone and email as actionable links.
 *
 * The tel: link fires the Google Ads "Phone Click" conversion (and a GA4
 * cta_click event) on tap. Without this, the Phone Click conversion action
 * that already exists in the Google Ads account can never record — the number
 * was previously only present in structured data, not clickable on the page.
 */
export function ContactDetails({
  phoneLabel,
  phoneDisplay,
  phoneTel,
  emailLabel,
  email,
}: ContactDetailsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-brand-black">
          {phoneLabel}
        </p>
        <a
          href={`tel:${phoneTel}`}
          onClick={() => {
            trackEvent("cta_click", {
              event_category: "engagement",
              event_label: "phone_click",
            });
            trackPhoneConversion();
          }}
          className="font-mono text-sm text-brand-black underline-offset-4 hover:text-brand-tangerine hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-tangerine"
        >
          {phoneDisplay}
        </a>
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-brand-black">
          {emailLabel}
        </p>
        <a
          href={`mailto:${email}`}
          onClick={() =>
            trackEvent("cta_click", {
              event_category: "engagement",
              event_label: "email_click",
            })
          }
          className="text-sm text-brand-black underline-offset-4 hover:text-brand-tangerine hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-tangerine"
        >
          {email}
        </a>
      </div>
    </div>
  );
}
