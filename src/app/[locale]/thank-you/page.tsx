import type { Metadata } from "next";
import { LegalDocumentFrame } from "@/components/organisms/LegalDocumentFrame/LegalDocumentFrame";
import ButtonStyled from "@/components/atoms/ButtonStyled/ButtonStyled";
import { ThankYouBeacon } from "@/features/analytics";
import { thankYouCopy } from "../legal/_lib/copy";
import { DEFAULT_LOCALE, localizedPath, isValidLocale, type Locale } from "@/lib/locale";

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
      <div className="mx-auto max-w-lg px-6 py-20 text-center space-y-6">
        <h1 className="font-display font-black uppercase text-3xl text-brand-black tracking-tighter">{t.title}</h1>
        <p className="font-body text-sm text-brand-black/70 leading-relaxed">{t.body}</p>
        <ButtonStyled href={localizedPath(locale, "/")}>
          {t.cta}
        </ButtonStyled>
      </div>
    </LegalDocumentFrame>
  );
}
