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
// Page copy
// ---------------------------------------------------------------------------

const copy: Record<
  Locale,
  {
    pre: string;
    heading: string;
    lead: string;
    prepHeading: string;
    prepItems: { label: string; note: string }[];
    calNote: string;
  }
> = {
  en: {
    pre: "Custom work only. By appointment.",
    heading: "Book a Consultation.",
    lead: "Every piece starts with a conversation. Select a time below, answer a few questions about your idea, and Lex will follow up personally within 48 hours.",
    prepHeading: "What to have ready",
    prepItems: [
      { label: "Your concept", note: "The idea, theme, or imagery you have in mind." },
      { label: "Placement", note: "Where on the body and approximate size." },
      { label: "Style reference", note: "Fine line, blackwork, dark art, or neo-traditional." },
      { label: "Reference images", note: "Share via WhatsApp or email after booking." },
    ],
    calNote: "Select a date and time to begin.",
  },
  pt: {
    pre: "Trabalho personalizado. Por marcação.",
    heading: "Marcar consulta.",
    lead: "Cada peça começa com uma conversa. Escolhe um horário abaixo, responde a algumas perguntas sobre a tua ideia e a Lex responde pessoalmente em 48 horas.",
    prepHeading: "O que ter pronto",
    prepItems: [
      { label: "O teu conceito", note: "A ideia, tema ou imagem que tens em mente." },
      { label: "Colocação", note: "Onde no corpo e tamanho aproximado." },
      { label: "Referência de estilo", note: "Fine line, blackwork, dark art ou neo-tradicional." },
      { label: "Imagens de referência", note: "Partilha via WhatsApp ou e-mail após a marcação." },
    ],
    calNote: "Seleciona uma data e hora para começar.",
  },
  de: {
    pre: "Individuell. Nur nach Termin.",
    heading: "Beratung buchen.",
    lead: "Jedes Stück beginnt mit einem Gespräch. Wähle unten einen Termin, beantworte ein paar Fragen zu deiner Idee — Lex meldet sich persönlich innerhalb von 48 Stunden.",
    prepHeading: "Was du bereit halten solltest",
    prepItems: [
      { label: "Dein Konzept", note: "Die Idee, das Thema oder Motiv, das du dir vorstellst." },
      { label: "Platzierung", note: "Körperstelle und ungefähre Größe." },
      { label: "Stilreferenz", note: "Fine Line, Blackwork, Dark Art oder Neo-Traditional." },
      { label: "Referenzbilder", note: "Teile sie nach der Buchung per WhatsApp oder E-Mail." },
    ],
    calNote: "Wähle ein Datum und eine Uhrzeit.",
  },
};

// ---------------------------------------------------------------------------
// Cal.com config
// ---------------------------------------------------------------------------

const CAL_USERNAME = "lextattoo";
const CAL_CONSULTATION_SLUG =
  process.env.CAL_CONSULTATION_EVENT_SLUG?.trim() || "consultation";

export default async function BookingPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  const t = copy[locale];

  const base = getSiteBaseUrl() || "https://lextattoo.com";
  const thankYouPath = localizedPath(locale, "/thank-you");
  const redirectUrl = `${base}${thankYouPath}`;
  const calLink = `${CAL_USERNAME}/${CAL_CONSULTATION_SLUG}`;

  return (
    <LegalDocumentFrame locale={locale}>
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                               */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-b-2 border-brand-black bg-brand-linen px-6 md:px-12 pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="max-w-[1440px] mx-auto">
          <p className="font-mono text-xs text-brand-muted uppercase tracking-[0.12em] mb-8">
            [ {t.pre} ]
          </p>
          <h1 className="font-display font-black uppercase text-brand-black leading-[0.9] tracking-tighter text-5xl md:text-7xl lg:text-[6rem] mb-10">
            {t.heading}
          </h1>
          <div className="w-16 h-0.5 bg-brand-black mb-8" />
          <p className="font-body text-sm md:text-base text-brand-black/70 max-w-xl leading-relaxed">
            {t.lead}
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* What to prepare                                                      */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-b-2 border-brand-black bg-brand-cotton px-6 md:px-12 py-12">
        <div className="max-w-[1440px] mx-auto">
          <p className="font-mono text-xs text-brand-muted uppercase tracking-[0.12em] mb-8">
            [ {t.prepHeading} ]
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {t.prepItems.map((item, i) => (
              <div
                key={item.label}
                className={[
                  "py-6 pr-6",
                  i < t.prepItems.length - 1 ? "border-r border-brand-black/20" : "",
                  i > 0 ? "pl-6" : "",
                ].join(" ")}
              >
                <p className="font-mono text-xs text-brand-tangerine uppercase tracking-[0.10em] mb-2">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="font-display font-black uppercase text-brand-black text-sm leading-tight tracking-tight mb-2">
                  {item.label}
                </p>
                <p className="font-body text-xs text-brand-black/60 leading-relaxed">
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Cal.com embed                                                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-brand-linen px-0">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-8">
          <p className="font-mono text-xs text-brand-muted uppercase tracking-[0.12em]">
            [ {t.calNote} ]
          </p>
        </div>
        <CalConsultationEmbed calLink={calLink} redirectUrl={redirectUrl} />
      </div>
    </LegalDocumentFrame>
  );
}
