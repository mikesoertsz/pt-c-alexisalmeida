import type { Metadata } from "next";
import { LegalDocumentFrame } from "@/components/organisms/LegalDocumentFrame/LegalDocumentFrame";
import { LegalProseArticle } from "@/features/legal";
import { refundsDocument } from "../documents/refunds";
import { getLegalEntity } from "@/lib/legal-entity";
import { DEFAULT_LOCALE, isValidLocale, type Locale } from "@/lib/locale";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  const doc = refundsDocument(locale, getLegalEntity());
  return {
    title: doc.meta.documentTitle,
    description: doc.meta.description,
  };
}

export default async function RefundsPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;

  return (
    <LegalDocumentFrame locale={locale}>
      <LegalProseArticle document={refundsDocument(locale, getLegalEntity())} />
    </LegalDocumentFrame>
  );
}
