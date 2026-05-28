import type { LegalEntity } from "@/lib/legal-entity";
import {
  formatEntityIntroDe,
  formatEntityIntroEn,
  formatEntityIntroPt,
} from "@/lib/legal-entity";
import type { Locale } from "@/lib/locale";
import type { LegalDocument } from "@/features/legal";

const UPDATED = {
  en: "Last updated: 10 May 2026",
  pt: "Última atualização: 10 de maio de 2026",
  de: "Stand: 10. Mai 2026",
} as const;

function privacyPt(e: LegalEntity): LegalDocument {
  return {
    meta: {
      lastUpdated: UPDATED.pt,
      documentTitle: "Política de privacidade",
      description: "Informação sobre tratamento de dados pessoais (RGPD).",
    },
    sections: [
      {
        heading: "1. Responsável pelo tratamento",
        blocks: [
          {
            type: "p",
            text: `O responsável pelo tratamento é ${formatEntityIntroPt(e).slice(0, -1)}.`,
          },
        ],
      },
      {
        heading: "2. Dados pessoais tratados",
        blocks: [
          {
            type: "ul",
            items: [
              "Identificação e contacto: nome, email, telefone.",
              "Dados de marcação: datas preferidas, notas sobre o projeto, histórico de mensagens necessário à reserva.",
              "Dados de pagamento: o site não armazena dados completos de cartão; pagamentos decorrem através de prestadores de pagamentos ou do fluxo de marcação (por exemplo Stripe integrado no Cal.com), conforme aplicável.",
              "Dados técnicos: endereço IP, tipo de browser e registos de servidor limitados ao necessário ao funcionamento seguro do site, mediante infraestruturas do alojador.",
            ],
          },
        ],
      },
      {
        heading: "3. Finalidades do tratamento",
        blocks: [
          {
            type: "ul",
            items: [
              "Gestão de pedidos de marcação, consultas e sessões.",
              "Comunicações relacionadas com a prestação do serviço.",
              "Cumprimento de obrigações legais e fiscais (faturação e arquivo de documentos).",
              "Medição estatística anonimizada ou agregada apenas se ativar cookies analíticos e aceitar essa opção.",
            ],
          },
        ],
      },
      {
        heading: "4. Fundamentos de licitude (art.º 6.º RGPD)",
        blocks: [
          {
            type: "ul",
            items: [
              "Execução de contrato ou medidas pré-contratuais: processar marcações e honorários.",
              "Interesse legítimo: garantir segurança do site, responder a pedidos e gestão interna proporcional.",
              "Obrigação legal: conservação de registos contabilísticos e fiscais.",
              "Consentimento: cookies não essenciais (por exemplo Google Analytics), quando aplicável.",
            ],
          },
        ],
      },
      {
        heading: "5. Encarregados de tratamento (subcontratantes)",
        blocks: [
          {
            type: "p",
            text: "Teremos recursos a prestadores que tratam dados por nossa conta, com salvaguardas contratuais previstas no RGPD:",
          },
          {
            type: "ul",
            items: [
              "Vercel Inc. (alojamento e entrega do site), https://vercel.com/legal/privacy-policy",
              "Cal.com, Inc. (agendamento online, quando utilizar o widget), https://cal.com/privacy",
              "Google LLC (Google Analytics 4, apenas após consentimento para cookies analíticos), https://policies.google.com/privacy",
            ],
          },
          {
            type: "p",
            text: "A lista pode ser atualizada; em caso de alteração relevante indicaremos a data de revisão no topo desta política.",
          },
        ],
      },
      {
        heading: "6. Prazos de conservação",
        blocks: [
          {
            type: "ul",
            items: [
              "Dados necessários a faturas e documentação contabilística: até 10 anos, nos termos gerais do ordenamento fiscal português (conservação mínima típica para documentos suportes de obrigações fiscais, ajuste interno com o seu contabilista certificado).",
              "Dados de marcação e contacto: pelo tempo necessário à relação contratual e, findo esse período, só enquanto persistir obrigação legal ou litígio.",
              "Correio eletrónico de marketing, se algum dia existir: até retirar o consentimento ou opor-se.",
            ],
          },
        ],
      },
      {
        heading: "7. Os seus direitos",
        blocks: [
          {
            type: "p",
            text: "Ao abrigo do RGPD, tem direito de acesso, retificação, apagamento, limitação, portabilidade (quando aplicável) e oposição ao tratamento fundado em interesse legítimo, em condições legais. Para exercer direitos, contacte o email indicado na secção 1. Respondemos habitualmente no prazo de 30 dias.",
          },
        ],
      },
      {
        heading: "8. Transferências para fora do EEE",
        blocks: [
          {
            type: "p",
            text: "Alguns prestadores podem processar dados nos Estados Unidos ou noutros terceiros países. Quando aplicável, aplicam-se Cláusulas Contratuais-Tipo da Comissão Europeia ou outras salvaguardas do art.º 46.º RGPD, conforme documentação do prestador.",
          },
        ],
      },
      {
        heading: "9. Reclamações",
        blocks: [
          {
            type: "p",
            text: "Tem o direito de apresentar reclamação à Comissão Nacional de Proteção de Dados (CNPD), autoridade de controlo em Portugal, https://www.cnpd.pt",
          },
        ],
      },
    ],
  };
}

function privacyEn(e: LegalEntity): LegalDocument {
  return {
    meta: {
      lastUpdated: UPDATED.en,
      documentTitle: "Privacy policy",
      description: "How we process personal data under GDPR.",
    },
    sections: [
      {
        heading: "1. Data controller",
        blocks: [
          {
            type: "p",
            text: `The controller is ${formatEntityIntroEn(e).slice(0, -1)}.`,
          },
        ],
      },
      {
        heading: "2. Data we process",
        blocks: [
          {
            type: "ul",
            items: [
              "Identity and contact: name, email, phone.",
              "Booking data: preferences, tattoo notes, messages needed to schedule.",
              "Payment: we do not store full card numbers on this site; payments run through payment providers / booking flows (e.g. Stripe via Cal.com) as applicable.",
              "Technical data required for secure hosting (e.g. IP, browser type) via our infrastructure provider.",
            ],
          },
        ],
      },
      {
        heading: "3. Purposes",
        blocks: [
          {
            type: "ul",
            items: [
              "Provide consultations and tattoo sessions.",
              "Service-related communication.",
              "Legal and tax compliance.",
              "Optional analytics only if you accept analytics cookies.",
            ],
          },
        ],
      },
      {
        heading: "4. Legal bases",
        blocks: [
          {
            type: "ul",
            items: [
              "Contract / pre-contract steps for bookings.",
              "Legitimate interests for proportionate site security and administration.",
              "Legal obligation for accounting and tax records.",
              "Consent for non-essential cookies such as Google Analytics when enabled.",
            ],
          },
        ],
      },
      {
        heading: "5. Processors",
        blocks: [
          {
            type: "ul",
            items: [
              "Vercel Inc. (hosting), https://vercel.com/legal/privacy-policy",
              "Cal.com, Inc. (scheduling when you use the widget), https://cal.com/privacy",
              "Google LLC (GA4, only after analytics consent), https://policies.google.com/privacy",
            ],
          },
        ],
      },
      {
        heading: "6. Retention",
        blocks: [
          {
            type: "p",
            text: "Invoices and accounting records are retained for the period required by Portuguese tax law (typically up to 10 years for supporting documents, confirm with your accountant). Booking messages are kept for the relationship and any legal claims, then deleted or anonymised where possible.",
          },
        ],
      },
      {
        heading: "7. Your rights",
        blocks: [
          {
            type: "p",
            text: "You may request access, rectification, erasure, restriction, portability (where applicable) and object to processing based on legitimate interests. Email the address in section 1; we aim to respond within 30 days.",
          },
        ],
      },
      {
        heading: "8. International transfers",
        blocks: [
          {
            type: "p",
            text: "Some processors may be in the US or other third countries. Where required, EU Standard Contractual Clauses or other GDPR Article 46 safeguards apply as described in their documentation.",
          },
        ],
      },
      {
        heading: "9. Complaints",
        blocks: [
          {
            type: "p",
            text: "You may lodge a complaint with the CNPD (Portuguese DPA): https://www.cnpd.pt",
          },
        ],
      },
    ],
  };
}

function privacyDe(e: LegalEntity): LegalDocument {
  return {
    meta: {
      lastUpdated: UPDATED.de,
      documentTitle: "Datenschutzerklärung",
      description: "Datenverarbeitung nach DSGVO.",
    },
    sections: [
      {
        heading: "1. Verantwortlicher",
        blocks: [
          {
            type: "p",
            text: `Verantwortlich: ${formatEntityIntroDe(e).slice(0, -1)}.`,
          },
        ],
      },
      {
        heading: "2. Verarbeitete Daten",
        blocks: [
          {
            type: "ul",
            items: [
              "Identität/Kontakt: Name, E‑Mail, Telefon.",
              "Buchungsdaten: Terminwünsche, Motivnotizen, Nachrichten.",
              "Zahlung: keine vollständige Kartennummer auf dieser Website; Abwicklung über PSP/Cal.com‑Stripe nach Maßgabe des Buchungswegs.",
              "Technische Daten (IP, Browser) beim Hoster.",
            ],
          },
        ],
      },
      {
        heading: "3. Zwecke",
        blocks: [
          {
            type: "ul",
            items: [
              "Erbringung der Studioleistungen.",
              "Vertragsbezogene Kommunikation.",
              "Rechts‑ und steuerliche Pflichten.",
              "Optionale Analyse‑Cookies nur nach Einwilligung.",
            ],
          },
        ],
      },
      {
        heading: "4. Rechtsgrundlagen",
        blocks: [
          {
            type: "ul",
            items: [
              "Art. 6 Abs. 1 b DSGVO, Vertrag/Anbahnung.",
              "Art. 6 Abs. 1 f, berechtigtes Interesse (Sicherheit, Verwaltung).",
              "Art. 6 Abs. 1 c, gesetzliche Pflicht.",
              "Art. 6 Abs. 1 a, Einwilligung für nicht notwendige Cookies.",
            ],
          },
        ],
      },
      {
        heading: "5. Auftragsverarbeiter",
        blocks: [
          {
            type: "ul",
            items: [
              "Vercel Inc., https://vercel.com/legal/privacy-policy",
              "Cal.com, Inc., https://cal.com/privacy",
              "Google LLC (GA4 nach Opt‑in), https://policies.google.com/privacy",
            ],
          },
        ],
      },
      {
        heading: "6. Speicherdauer",
        blocks: [
          {
            type: "p",
            text: "Steuer‑ und Buchungsbelege gemäß portugiesischer Aufbewahrungspflichten (in der Praxis oft bis zu 10 Jahre für relevante Belege, mit Ihrem Steuerberater abstimmen). Kommunikation zur Buchung für die Vertragsbeziehung und gesetzliche Ansprüche.",
          },
        ],
      },
      {
        heading: "7. Betroffenenrechte",
        blocks: [
          {
            type: "p",
            text: "Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und Datenübertragbarkeit nach Maßgabe der DSGVO. Bitte E‑Mail an Abschnitt 1, Ziel: Antwort binnen 30 Tagen.",
          },
        ],
      },
      {
        heading: "8. Drittlandtransfers",
        blocks: [
          {
            type: "p",
            text: "Einige Anbieter können in den USA verarbeiten. Soweit erforderlich: EU‑Standardvertragsklauseln und ergänzende Maßnahmen gem. Art. 46 DSGVO.",
          },
        ],
      },
      {
        heading: "9. Beschwerde",
        blocks: [
          {
            type: "p",
            text: "Sie können sich bei der portugiesischen Aufsichtsbehörde CNPD beschweren: https://www.cnpd.pt",
          },
        ],
      },
    ],
  };
}

export function privacyDocument(locale: Locale, e: LegalEntity): LegalDocument {
  switch (locale) {
    case "pt":
      return privacyPt(e);
    case "de":
      return privacyDe(e);
    default:
      return privacyEn(e);
  }
}
