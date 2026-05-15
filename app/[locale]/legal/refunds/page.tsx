import type { Metadata } from "next";
import LegalDocumentFrame from "@/app/components/shared/LegalDocumentFrame";
import LegalProseArticle from "../LegalProseArticle";
import { refundsDocument } from "../documents";
import { getLegalEntity } from "@/app/lib/legal-entity";
import { DEFAULT_LOCALE, type Locale } from "@/app/lib/locale";
import { isValidLocale } from "@/app/lib/locale";

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
