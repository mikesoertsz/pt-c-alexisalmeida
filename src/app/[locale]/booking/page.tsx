import type { Metadata } from "next";
import { LegalDocumentFrame } from "@/components/organisms/LegalDocumentFrame/LegalDocumentFrame";
import { BookingIntakeForm, CalConsultationEmbed } from "@/features/booking";
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

      {/* ------------------------------------------------------------------ */}
      {/* Intake form — project details Lex needs before the consultation    */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-brand-linen border-t-2 border-brand-black px-6 md:px-12 py-16 md:py-20">
        <div className="max-w-[900px] mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <p className="font-mono text-xs text-brand-black/50 uppercase tracking-[0.12em]">
              [ Step 02 ]
            </p>
            <h2 className="font-display font-black uppercase text-brand-black text-3xl md:text-5xl leading-[0.9] tracking-tighter">
              Tell Lex about the piece
            </h2>
            <p className="font-body text-sm text-brand-black/60 leading-relaxed max-w-[60ch]">
              Send your concept, placement, size and references. Every request is reviewed
              personally, and you receive an answer within 48 hours.
            </p>
          </div>

          <BookingIntakeForm privacyHref={localizedPath(locale, "/legal/privacy")} />
        </div>
      </div>
    </LegalDocumentFrame>
  );
}
