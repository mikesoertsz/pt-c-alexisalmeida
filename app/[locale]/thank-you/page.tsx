import type { Metadata } from "next";
import Link from "next/link";
import LegalDocumentFrame from "@/app/components/shared/LegalDocumentFrame";
import ThankYouBeacon from "@/app/components/analytics/ThankYouBeacon";
import { thankYouCopy } from "../legal/copy";
import { DEFAULT_LOCALE, localizedPath, type Locale } from "@/app/lib/locale";
import { isValidLocale } from "@/app/lib/locale";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  return {
    title: thankYouCopy[locale].title,
    robots: { index: false, follow: true },
  };
}

export default async function ThankYouPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  const t = thankYouCopy[locale];

  return (
    <LegalDocumentFrame locale={locale}>
      <ThankYouBeacon />
      <div className="mx-auto max-w-lg px-4 py-20 text-center space-y-6">
        <h1 className="text-2xl font-semibold text-ink">{t.title}</h1>
        <p className="text-sm text-ink/80">{t.body}</p>
        <Link
          href={localizedPath(locale, "/")}
          className="inline-flex justify-center rounded-md bg-terracotta px-5 py-2.5 text-sm font-medium text-white hover:bg-terracotta/90 transition-colors"
        >
          {t.cta}
        </Link>
      </div>
    </LegalDocumentFrame>
  );
}
