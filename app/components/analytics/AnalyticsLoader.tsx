"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useConsent } from "@/app/hooks/useConsent";

export function AnalyticsLoader() {
  const { analyticsConsented } = useConsent();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  if (!analyticsConsented || !gaId) return null;
  return <GoogleAnalytics gaId={gaId} />;
}
