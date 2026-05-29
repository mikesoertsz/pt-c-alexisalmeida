import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocumentFrame } from "@/components/organisms/LegalDocumentFrame/LegalDocumentFrame";
import { DEFAULT_LOCALE, isValidLocale, localizedPath, type Locale } from "@/lib/locale";

interface Props {
  params: Promise<{ locale: string }>;
}

const COPY: Record<
  Locale,
  {
    meta: { title: string; description: string };
    preTitle: string;
    heading: string;
    intro: string;
    docs: Array<{ title: string; description: string; href: string }>;
  }
> = {
  en: {
    meta: {
      title: "Legal",
      description: "Terms, privacy policy, GDPR rights, refund policy, and cookie information for Lex Almeida Tattoo.",
    },
    preTitle: "Legal",
    heading: "Legal documents",
    intro: "All policies and legal information for Lex Almeida Tattoo, Porto, Portugal.",
    docs: [
      {
        title: "Terms and conditions",
        description: "Services, booking, cancellation, intellectual property, and governing law.",
        href: "/legal/terms",
      },
      {
        title: "Privacy policy",
        description: "How we collect, use, and protect your personal data under GDPR.",
        href: "/legal/privacy",
      },
      {
        title: "GDPR information",
        description: "Short summary of your data rights and how to submit a request.",
        href: "/legal/gdpr",
      },
      {
        title: "Refund and deposit policy",
        description: "Deposits, cancellations, touch-ups, and distance contract rules.",
        href: "/legal/refunds",
      },
      {
        title: "Cookie policy",
        description: "Which cookies we use, why, and how to manage them.",
        href: "/legal/cookies",
      },
    ],
  },
  pt: {
    meta: {
      title: "Legal",
      description: "Termos, privacidade, RGPD, reembolsos e cookies da Lex Almeida Tattoo.",
    },
    preTitle: "Legal",
    heading: "Documentos legais",
    intro: "Todas as políticas e informações legais da Lex Almeida Tattoo, Porto, Portugal.",
    docs: [
      {
        title: "Termos e condições",
        description: "Serviços, marcações, cancelamentos, propriedade intelectual e foro.",
        href: "/legal/terms",
      },
      {
        title: "Política de privacidade",
        description: "Como recolhemos, usamos e protegemos os seus dados pessoais ao abrigo do RGPD.",
        href: "/legal/privacy",
      },
      {
        title: "Informação sobre o RGPD",
        description: "Resumo dos seus direitos sobre dados e como exercê-los.",
        href: "/legal/gdpr",
      },
      {
        title: "Política de reembolsos e sinais",
        description: "Sinais, cancelamentos, retoques e regime de contratos à distância.",
        href: "/legal/refunds",
      },
      {
        title: "Política de cookies",
        description: "Que cookies utilizamos, para quê e como os gerir.",
        href: "/legal/cookies",
      },
    ],
  },
  de: {
    meta: {
      title: "Rechtliches",
      description: "AGB, Datenschutz, DSGVO, Erstattungen und Cookies von Lex Almeida Tattoo.",
    },
    preTitle: "Rechtliches",
    heading: "Rechtliche Dokumente",
    intro: "Alle Richtlinien und rechtlichen Informationen von Lex Almeida Tattoo, Porto, Portugal.",
    docs: [
      {
        title: "Allgemeine Geschäftsbedingungen",
        description: "Leistungen, Buchung, Stornierung, Urheberrecht und Gerichtsstand.",
        href: "/legal/terms",
      },
      {
        title: "Datenschutzerklärung",
        description: "Wie wir Ihre personenbezogenen Daten nach DSGVO verarbeiten und schützen.",
        href: "/legal/privacy",
      },
      {
        title: "Hinweis zur DSGVO",
        description: "Kurzüberblick über Betroffenenrechte und wie Sie eine Anfrage stellen.",
        href: "/legal/gdpr",
      },
      {
        title: "Erstattungs- und Anzahlungsrichtlinie",
        description: "Anzahlungen, Stornierungen, Retouches und Fernabsatzrecht.",
        href: "/legal/refunds",
      },
      {
        title: "Cookie-Hinweise",
        description: "Welche Cookies wir verwenden, wozu und wie Sie diese verwalten.",
        href: "/legal/cookies",
      },
    ],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  return {
    title: COPY[locale].meta.title,
    description: COPY[locale].meta.description,
  };
}

export default async function LegalIndexPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isValidLocale(raw) ? raw : DEFAULT_LOCALE;
  const copy = COPY[locale];

  return (
    <LegalDocumentFrame locale={locale}>
      <div className="mx-auto max-w-3xl space-y-10 px-6 py-12 md:py-16">
        <header className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-brand-muted">
            {copy.preTitle}
          </p>
          <h1 className="font-display text-3xl font-black uppercase tracking-tighter text-brand-black md:text-4xl">
            {copy.heading}
          </h1>
          <p className="font-body text-sm leading-relaxed text-brand-black/70 md:text-base">
            {copy.intro}
          </p>
        </header>

        <ul className="divide-y-2 divide-brand-black border-y-2 border-brand-black">
          {copy.docs.map((doc) => (
            <li key={doc.href}>
              <Link
                href={localizedPath(locale, doc.href)}
                className="group flex items-start justify-between gap-6 py-5 transition-colors hover:bg-brand-cotton px-2 -mx-2"
              >
                <div className="space-y-1">
                  <p className="font-display text-base font-black uppercase tracking-tighter text-brand-black group-hover:text-brand-tangerine transition-colors">
                    {doc.title}
                  </p>
                  <p className="font-body text-xs leading-relaxed text-brand-black/60">
                    {doc.description}
                  </p>
                </div>
                <span
                  aria-hidden
                  className="mt-1 shrink-0 font-mono text-xs text-brand-black/40 group-hover:text-brand-tangerine transition-colors"
                >
                  &rarr;
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </LegalDocumentFrame>
  );
}
