import type { Metadata } from "next";
import { LegalDocumentFrame } from "@/components/organisms/LegalDocumentFrame/LegalDocumentFrame";
import { CalConsultationEmbed } from "@/features/booking";
import { LOCALES, DEFAULT_LOCALE, isValidLocale, localizedPath, type Locale } from "@/lib/locale";
import { getSiteBaseUrl } from "@/lib/site-url";

interface Props {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const meta: Record<Locale, { title: string }> = {
  en: { title: "Book a Consultation — Lex Almeida" },
  pt: { title: "Marcar consulta — Lex Almeida" },
  de: { title: "Beratung buchen — Lex Almeida" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  return {
    title: meta[locale].title,
    robots: { index: false, follow: true },
  };
}

// ---------------------------------------------------------------------------
// cal.eu config
// ---------------------------------------------------------------------------

const CAL_USERNAME = "lextattoo";
const CAL_CONSULTATION_SLUG =
  process.env.CAL_CONSULTATION_EVENT_SLUG?.trim() || "free-intake-consultation";

export default async function BookingPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;

  const base = getSiteBaseUrl() || "https://lextattoo.com";
  const thankYouPath = localizedPath(locale, "/thank-you");
  const redirectUrl = `${base}${thankYouPath}`;
  const calLink = `${CAL_USERNAME}/${CAL_CONSULTATION_SLUG}`;

  return (
    <LegalDocumentFrame locale={locale}>
      {/* ------------------------------------------------------------------ */}
      {/* Cal.com embed — booking calendar only, above the fold               */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-brand-linen px-6 md:px-12 pt-28 md:pt-32 pb-16">
        <div className="max-w-[1440px] mx-auto">
          <CalConsultationEmbed calLink={calLink} redirectUrl={redirectUrl} />
        </div>
      </div>
    </LegalDocumentFrame>
  );
}
