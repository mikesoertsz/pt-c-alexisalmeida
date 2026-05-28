"use client";

import Link from "next/link";
import { useConsent } from "@/hooks/useConsent";
import type { ContentSchema } from "@/content/schema";

interface CookieConsentBannerProps {
  content: ContentSchema["cookieConsent"];
  cookiesPolicyHref: string;
  privacyPolicyHref: string;
}

export function CookieConsentBanner({
  content,
  cookiesPolicyHref,
  privacyPolicyHref,
}: CookieConsentBannerProps) {
  const { consentState, accept, decline } = useConsent();

  if (consentState !== null) return null;

  const linkClass =
    "text-brand-black underline underline-offset-4 decoration-brand-black/40 hover:decoration-brand-tangerine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-tangerine";

  return (
    <div
      role="dialog"
      aria-label={content.ariaLabel}
      aria-modal="false"
      className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-brand-black bg-brand-cotton px-6 py-5 md:px-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
        <p className="max-w-prose font-body text-xs leading-relaxed text-brand-black/70">
          {content.body}{" "}
          <Link href={cookiesPolicyHref} className={linkClass}>
            {content.learnMoreLabel}
          </Link>
          {" · "}
          <Link href={privacyPolicyHref} className={linkClass}>
            {content.privacyLinkLabel}
          </Link>
        </p>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={decline}
            className="min-h-[2.5rem] border-2 border-brand-black bg-transparent px-5 py-2 font-body text-xs uppercase tracking-[0.12em] text-brand-muted hover:text-brand-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-tangerine"
          >
            {content.declineLabel}
          </button>
          <button
            type="button"
            onClick={accept}
            className="min-h-[2.5rem] border-2 border-brand-tangerine bg-brand-tangerine px-5 py-2 font-body text-xs uppercase tracking-[0.12em] text-brand-linen hover:bg-brand-black hover:border-brand-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-tangerine"
          >
            {content.acceptLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
