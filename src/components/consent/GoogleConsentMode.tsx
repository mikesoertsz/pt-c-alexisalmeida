import Script from "next/script";
import { CONSENT_DEFAULT_SCRIPT } from "@/lib/consent";

/**
 * Implements Google Consent Mode v2 defaults.
 *
 * Runs as early as possible (beforeInteractive) to deny all optional
 * storage BEFORE any Google tag loads, then replays a returning visitor's
 * saved cookie choice inline so there's no flash of denied state before
 * React hydrates. Explicit updates on choice/change are fired directly by
 * useConsent().save() via updateGoogleConsent() — this component only
 * establishes the default.
 *
 * Ref: https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced
 */
export function GoogleConsentMode() {
  return (
    <Script
      id="google-consent-mode-defaults"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }}
    />
  );
}
