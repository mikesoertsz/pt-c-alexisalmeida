import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import WhatsAppFloatingButton from "@/components/organisms/WhatsAppFloatingButton/WhatsAppFloatingButton";
import { getContent } from "@/content/get-content";
import { LOCALES, isValidLocale, type Locale } from "@/lib/locale";
import { getWhatsAppUrl } from "@/lib/whatsapp";
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

  const content = getContent(locale);

  return (
    <>
      {children}
      <WhatsAppFloatingButton
        href={getWhatsAppUrl()}
        label={content.whatsapp.fabLabel}
        ariaLabel={content.whatsapp.fabAriaLabel}
      />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
