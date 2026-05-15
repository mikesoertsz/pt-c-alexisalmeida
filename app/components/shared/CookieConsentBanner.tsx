"use client";

import Link from "next/link";
import { useConsent } from "@/app/hooks/useConsent";
import type { ContentSchema } from "@/app/content";

interface Props {
  content: ContentSchema["cookieConsent"];
  cookiesPolicyHref: string;
  privacyPolicyHref: string;
}

export function CookieConsentBanner({
  content,
  cookiesPolicyHref,
  privacyPolicyHref,
}: Props) {
  const { consentState, accept, decline } = useConsent();

  if (consentState !== null) return null;

  const linkClass =
    "text-brand-dusty-white underline underline-offset-4 decoration-brand-dusty-white/80 hover:decoration-brand-dusty-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dusty-white";

  return (
    <div
      role="dialog"
      aria-label={content.ariaLabel}
      aria-modal="false"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-brand-foggy-gray/25 bg-brand-granite px-4 py-4 text-brand-dusty-white md:px-6 md:py-5"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
        <p className="max-w-prose text-xs font-sans leading-relaxed text-brand-dusty-white/70">
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
            className="min-h-10 border border-brand-dusty-white/20 bg-transparent px-4 py-2 text-[0.68rem] font-sans font-medium uppercase tracking-[0.12em] text-brand-dusty-white/70 hover:text-brand-dusty-white hover:border-brand-dusty-white/40 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dusty-white/40"
          >
            {content.declineLabel}
          </button>
          <button
            type="button"
            onClick={accept}
            className="min-h-10 bg-accent px-4 py-2 text-[0.68rem] font-sans font-medium uppercase tracking-[0.12em] text-on-accent hover:bg-accent/85 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/60"
          >
            {content.acceptLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
