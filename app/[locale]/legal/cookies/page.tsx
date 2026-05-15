import type { Metadata } from "next";
import LegalDocumentFrame from "@/app/components/shared/LegalDocumentFrame";
import { DEFAULT_LOCALE, type Locale } from "@/app/lib/locale";
import { isValidLocale } from "@/app/lib/locale";

const UPDATED = {
  en: "Last updated: 10 May 2026",
  pt: "Última atualização: 10 de maio de 2026",
  de: "Stand: 10. Mai 2026",
} as const;

const COOKIE_ROWS: Record<
  Locale,
  Array<{
    name: string;
    purpose: string;
    classification: string;
    consent: string;
    maxAge: string;
  }>
> = {
  en: [
    {
      name: "NEXT_LOCALE",
      purpose: "Stores which site language you prefer.",
      classification: "Functional — always active",
      consent: "Not required",
      maxAge: "1 year",
    },
    {
      name: "COOKIE_CONSENT",
      purpose: "Remembers your analytics consent choice.",
      classification: "Strictly necessary — always active",
      consent: "Not required",
      maxAge: "1 year",
    },
    {
      name: "—",
      purpose:
        "Vercel Web Analytics and Speed Insights: audience and performance metrics. Implemented to avoid third-party advertising cookies; typically no persistent cookies on your device.",
      classification: "Measurement — essential / low impact",
      consent: "Not required (no non-essential tracking cookies)",
      maxAge: "Session / none typical",
    },
    {
      name: "_ga, _ga_*",
      purpose: "Google Analytics 4 measurement (only after you accept analytics).",
      classification: "Analytics — optional",
      consent: "Required before use",
      maxAge: "Up to 2 years (Google)",
    },
  ],
  pt: [
    {
      name: "NEXT_LOCALE",
      purpose: "Guarda a língua do site que prefere.",
      classification: "Funcional — sempre ativo",
      consent: "Não necessário",
      maxAge: "1 ano",
    },
    {
      name: "COOKIE_CONSENT",
      purpose: "Lembra se aceitou ou recusou cookies estritamente não necessários (analíticos).",
      classification: "Estritamente necessário — sempre ativo",
      consent: "Não necessário",
      maxAge: "1 ano",
    },
    {
      name: "—",
      purpose:
        "Vercel Web Analytics e Speed Insights: métricas de audiência e desempenho, sem cookies publicitários de terceiros; em geral sem cookies persistentes no seu dispositivo.",
      classification: "Medição — essencial / baixo impacto",
      consent: "Não necessário (sem cookies analíticos não essenciais)",
      maxAge: "Sessão / usualmente nenhum",
    },
    {
      name: "_ga, _ga_*",
      purpose: "Medição GA4 apenas após consentimento para cookies analíticos.",
      classification: "Analítico — opcional",
      consent: "Necessário antes de uso",
      maxAge: "Até 2 anos (Google)",
    },
  ],
  de: [
    {
      name: "NEXT_LOCALE",
      purpose: "Speichert Ihre bevorzugte Website‑Sprache.",
      classification: "Funktional — immer aktiv",
      consent: "Nicht erforderlich",
      maxAge: "1 Jahr",
    },
    {
      name: "COOKIE_CONSENT",
      purpose: "Speichert Ihre Entscheidung zu optionalen Analyse‑Cookies.",
      classification: "Unbedingt erforderlich — immer aktiv",
      consent: "Nicht erforderlich",
      maxAge: "1 Jahr",
    },
    {
      name: "—",
      purpose:
        "Vercel Web Analytics und Speed Insights: Reichweite und Performance ohne werbliche Drittanbieter‑Cookies; in der Regel keine dauerhaften Cookies.",
      classification: "Messung — wesentlich / geringe Eingriffstiefe",
      consent: "Nicht nötig (keine nicht notwendigen Analyse‑Cookies)",
      maxAge: "Sitzung / meist keine",
    },
    {
      name: "_ga, _ga_*",
      purpose: "Google Analytics 4 — nur nach Einwilligung.",
      classification: "Analyse — optional",
      consent: "Vor Aktivierung nötig",
      maxAge: "Bis zu 2 Jahre (Google)",
    },
  ],
};

const COPY: Record<
  Locale,
  {
    title: string;
    intro: string[];
    tableCaption: string;
    colName: string;
    colPurpose: string;
    colClass: string;
    colConsent: string;
    colMaxAge: string;
    manageTitle: string;
    manageBody: string;
    thirdPartyTitle: string;
    thirdPartyBody: string;
  }
> = {
  en: {
    title: "Cookie policy",
    intro: [
      "This policy explains how Aura Tattoo & Meaning uses storage and similar technologies on this website.",
      "Essential items (language preference and your consent storage) are always active.",
      "Vercel Web Analytics and Speed Insights are loaded to understand traffic and performance; they are configured to avoid advertising cookies and typically do not rely on persistent third-party cookies.",
      "Google Analytics 4 loads only after you tap Accept on optional analytics cookies.",
    ],
    tableCaption: "Cookies and similar technologies on this website",
    colName: "Name",
    colPurpose: "Purpose",
    colClass: "Classification",
    colConsent: "Consent required?",
    colMaxAge: "Max age",
    manageTitle: "How to manage cookies",
    manageBody:
      "Most browsers allow you to block or delete cookies in their privacy or site settings.",
    thirdPartyTitle: "Third‑party embedding",
    thirdPartyBody:
      "Appointment booking widgets (for example Cal.com) may place their own cookies when you interact with them. Please refer to those providers’ policies.",
  },
  pt: {
    title: "Política de cookies",
    intro: [
      "Esta página explica como a Aura Tattoo & Meaning utiliza cookies e tecnologias similares neste website.",
      "Os meios necessários (língua e registo da decisão sobre cookies opcionais) permanecem ativos.",
      "Vercel Web Analytics e Speed Insights permitem medir audiência e desempenho, sem finalidade publicitária de terceiros e, em regra, sem cookies persistentes no seu equipamento.",
      "Google Analytics 4 só é carregado após aceitar cookies analíticos no aviso.",
    ],
    tableCaption: "Cookies e tecnologias utilizadas neste website",
    colName: "Nome",
    colPurpose: "Finalidade",
    colClass: "Classificação",
    colConsent: "Consentimento",
    colMaxAge: "Duração máx.",
    manageTitle: "Como gerir cookies",
    manageBody:
      "Os browsers permitem frequentemente bloquear ou eliminar cookies nas definições de privacidade ou por site.",
    thirdPartyTitle: "Conteúdo de terceiros",
    thirdPartyBody:
      "Widgets de marcação (por exemplo Cal.com) podem definir cookies próprios ao interagir com eles — consulte as políticas desses prestadores.",
  },
  de: {
    title: "Cookie‑Hinweise",
    intro: [
      "Diese Hinweise beschreiben Cookies und ähnliche Technologien auf dieser Website.",
      "Notwendige Speicherung (Sprache und Einwilligung zu optionalen Analyse‑Cookies) bleibt aktiv.",
      "Vercel Web Analytics und Speed Insights messen Reichweite und Performance ohne Werbe‑Cookies Dritter, in der Regel ohne dauerhafte Cookies.",
      "Google Analytics 4 wird erst nach „Akzeptieren“ für optionale Cookies geladen.",
    ],
    tableCaption: "Übersicht der Cookies und ähnlichen Technologien",
    colName: "Name",
    colPurpose: "Zweck",
    colClass: "Kategorie",
    colConsent: "Einwilligung nötig?",
    colMaxAge: "Speicherdauer",
    manageTitle: "Cookies verwalten",
    manageBody:
      "Sie können Cookies in den Datenschutz‑Einstellungen Ihres Browsers löschen oder blockieren.",
    thirdPartyTitle: "Einbindungen Dritter",
    thirdPartyBody:
      "Buchungs‑Widgets (zum Beispiel Cal.com) können bei Nutzung eigene Cookies setzen — dort gelten jeweils deren Hinweise.",
  },
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  return { title: COPY[locale].title };
}

export default async function CookiePolicyPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale: Locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  const copy = COPY[locale];
  const rows = COOKIE_ROWS[locale];

  return (
    <LegalDocumentFrame locale={locale}>
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-12 md:py-16">
        <header className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-ink/70">
            {UPDATED[locale]}
          </p>
          <h1 className="font-display text-3xl font-light tracking-tight text-ink md:text-4xl">
            {copy.title}
          </h1>
        </header>
        <div className="space-y-4 text-sm leading-relaxed text-olive md:text-base">
          {copy.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <div className="overflow-x-auto rounded-lg border border-sage/30">
          <table className="w-full border-collapse text-left">
            <caption className="border-b border-sage/30 bg-blush/30 px-4 py-3 text-left text-xs font-medium text-ink">
              {copy.tableCaption}
            </caption>
            <thead>
              <tr className="border-b border-sage/30 bg-mist">
                <th className="p-3 text-xs font-semibold uppercase tracking-wide text-ink">
                  {copy.colName}
                </th>
                <th className="p-3 text-xs font-semibold uppercase tracking-wide text-ink">
                  {copy.colPurpose}
                </th>
                <th className="p-3 text-xs font-semibold uppercase tracking-wide text-ink">
                  {copy.colClass}
                </th>
                <th className="p-3 text-xs font-semibold uppercase tracking-wide text-ink">
                  {copy.colConsent}
                </th>
                <th className="p-3 text-xs font-semibold uppercase tracking-wide text-ink">
                  {copy.colMaxAge}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-sage/20 last:border-0">
                  <td className="p-3 font-mono text-xs text-olive">{row.name}</td>
                  <td className="p-3 text-sm text-olive">{row.purpose}</td>
                  <td className="p-3 text-sm text-olive">{row.classification}</td>
                  <td className="p-3 text-sm text-olive">{row.consent}</td>
                  <td className="p-3 whitespace-nowrap text-sm text-olive">{row.maxAge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-display text-xl font-medium text-ink md:text-2xl">
          {copy.manageTitle}
        </h2>
        <p className="text-sm leading-relaxed text-olive md:text-base">{copy.manageBody}</p>
        <h2 className="font-display text-xl font-medium text-ink md:text-2xl">
          {copy.thirdPartyTitle}
        </h2>
        <p className="text-sm leading-relaxed text-olive md:text-base">{copy.thirdPartyBody}</p>
      </div>
    </LegalDocumentFrame>
  );
}
