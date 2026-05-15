import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AnalyticsLoader } from "@/app/components/analytics/AnalyticsLoader";
import ArtistStyleProvider from "@/app/components/ArtistStyleProvider";
import { LOCALES, isValidLocale, type Locale } from "@/app/lib/locale";
import { getArtistStyleForRequest } from "@/app/lib/artist-style-server";
import type { PropsWithChildren } from "react";
import { notFound } from "next/navigation";

export async function generateStaticParams(): Promise<{ locale: Locale }[]> {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: PropsWithChildren<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale: raw } = await params;
  const locale = isValidLocale(raw) ? raw : null;
  if (!locale) {
    notFound();
  }

  const artistStyle = await getArtistStyleForRequest();

  return (
    <ArtistStyleProvider initialStyle={artistStyle}>
      {children}
      <AnalyticsLoader />
      <Analytics />
      <SpeedInsights />
    </ArtistStyleProvider>
  );
}
