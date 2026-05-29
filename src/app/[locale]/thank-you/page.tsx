import type { Metadata } from "next";
import { LegalDocumentFrame } from "@/components/organisms/LegalDocumentFrame/LegalDocumentFrame";
import { ThankYouBeacon, ThankYouContent } from "@/features/analytics";
import { thankYouCopy } from "../legal/_lib/copy";
import { DEFAULT_LOCALE, localizedPath, isValidLocale, type Locale } from "@/lib/locale";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  return {
    title: thankYouCopy[locale].title,
    robots: { index: false, follow: true },
  };
}

export default async function ThankYouPage({ params, searchParams }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  const t = thankYouCopy[locale];

  // Cal.eu appends booking data to the redirect URL as search params
  const sp = await searchParams;
  const startTime = typeof sp.start === "string" ? sp.start : undefined;
  const endTime = typeof sp.end === "string" ? sp.end : undefined;
  const eventTitle = typeof sp.title === "string" ? sp.title : undefined;

  return (
    <LegalDocumentFrame locale={locale}>
      <ThankYouBeacon />
      <ThankYouContent
        title={t.title}
        body={t.body}
        emailNote={t.emailNote}
        calendarLabel={t.calendarLabel}
        cta={t.cta}
        ctaHref={localizedPath(locale, "/")}
        startTime={startTime}
        endTime={endTime}
        eventTitle={eventTitle}
      />
    </LegalDocumentFrame>
  );
}
