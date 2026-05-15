import type { LegalEntity } from "@/app/lib/legal-entity";
import { formatAddressInline } from "@/app/lib/legal-entity";
import type { Locale } from "@/app/lib/locale";
import type { LegalDocument } from "../legal-types";

const UPDATED = {
  en: "Last updated: 10 May 2026",
  pt: "Última atualização: 10 de maio de 2026",
  de: "Stand: 10. Mai 2026",
} as const;

function gdprPt(e: LegalEntity): LegalDocument {
  return {
    meta: {
      lastUpdated: UPDATED.pt,
      documentTitle: "Informação sobre o RGPD",
      description: "Resumo dos direitos e contactos.",
    },
    sections: [
      {
        heading: "Resumo",
        blocks: [
          {
            type: "p",
            text: `Este resumo complementa a política de privacidade completa. O responsável é ${e.legalName}, ${formatAddressInline(e)}, ${e.email}.`,
          },
        ],
      },
      {
        heading: "Que dados tratamos e porquê",
        blocks: [
          {
            type: "p",
            text: "Tratamos dados de contacto e de marcação para agendar sessões, faturar quando aplicável e cumprir obrigações legais. Cookies analíticos só após consentimento.",
          },
        ],
      },
      {
        heading: "Quanto tempo guardamos",
        blocks: [
          {
            type: "p",
            text: "Documentos fiscais e dados contabilísticos pelo prazo legal; restantes dados apenas o necessário à relação contratual e a eventuais reclamações.",
          },
        ],
      },
      {
        heading: "Os seus direitos",
        blocks: [
          {
            type: "ul",
            items: [
              "Acesso, retificação e, em condições legais, apagamento ou limitação.",
              "Oposição a tratamentos baseados em interesse legítimo.",
              "Portabilidade dos dados que nos forneceu por meios electrónicos, quando aplicável.",
            ],
          },
        ],
      },
      {
        heading: "Como pedir",
        blocks: [
          {
            type: "p",
            text: `Envie pedido para ${e.email} identificando o assunto (por exemplo «Pedido RGPD – acesso»). Respondemos, em regra, no prazo de 30 dias. Se necessário, pode solicitar extensão nos termos do art.º 12.º do RGPD.`,
          },
        ],
      },
      {
        heading: "Autoridade de controlo",
        blocks: [
          {
            type: "p",
            text: "Comissão Nacional de Proteção de Dados (CNPD) — Av. D. Carlos I, 134, 1.º, 1200-651 Lisboa — https://www.cnpd.pt",
          },
        ],
      },
    ],
  };
}

function gdprEn(e: LegalEntity): LegalDocument {
  return {
    meta: {
      lastUpdated: UPDATED.en,
      documentTitle: "GDPR information",
      description: "Short summary of your rights.",
    },
    sections: [
      {
        heading: "Controller",
        blocks: [
          {
            type: "p",
            text: `${e.legalName}, ${formatAddressInline(e)}, ${e.email}. Full details are in the privacy policy.`,
          },
        ],
      },
      {
        heading: "Data and why",
        blocks: [
          {
            type: "p",
            text: "Contact and booking data to schedule sessions, invoice where needed, and meet legal duties. Analytics cookies load only if you accept.",
          },
        ],
      },
      {
        heading: "How long we keep data",
        blocks: [
          {
            type: "p",
            text: "Accounting/tax records for statutory periods; other data only as long as the relationship and any claims require.",
          },
        ],
      },
      {
        heading: "Your rights",
        blocks: [
          {
            type: "ul",
            items: [
              "Access, rectification, erasure or restriction where the law allows.",
              "Object to certain processing based on legitimate interests.",
              "Data portability for data you gave us electronically, when applicable.",
            ],
          },
        ],
      },
      {
        heading: "How to submit a request",
        blocks: [
          {
            type: "p",
            text: `Email ${e.email} with the subject line clearly stating the request (for example “GDPR access request”). We normally respond within 30 days.`,
          },
        ],
      },
      {
        heading: "Supervisory authority",
        blocks: [
          {
            type: "p",
            text: "Portuguese DPA (CNPD): https://www.cnpd.pt",
          },
        ],
      },
    ],
  };
}

function gdprDe(e: LegalEntity): LegalDocument {
  return {
    meta: {
      lastUpdated: UPDATED.de,
      documentTitle: "Hinweis zur DSGVO",
      description: "Kurzüberblick über Betroffenenrechte.",
    },
    sections: [
      {
        heading: "Verantwortlicher",
        blocks: [{ type: "p", text: `${e.legalName}, ${formatAddressInline(e)}, ${e.email}.` }],
      },
      {
        heading: "Daten und Zwecke",
        blocks: [
          {
            type: "p",
            text: "Kontakt‑ und Buchungsdaten zur Terminierung, Rechnungsstellung und gesetzlichen Pflichten. Analyse‑Cookies nur nach Einwilligung.",
          },
        ],
      },
      {
        heading: "Dauer",
        blocks: [
          {
            type: "p",
            text: "Steuer‑ und Buchungsnachweise nach gesetzlichen Fristen; sonstige Daten für die Vertragsbeziehung und Ansprüche.",
          },
        ],
      },
      {
        heading: "Rechte",
        blocks: [
          {
            type: "ul",
            items: [
              "Auskunft, Berichtigung, Löschung, Einschränkung nach gesetzlichen Voraussetzungen.",
              "Widerspruch gegen bestimmte Verarbeitungen auf Basis berechtigter Interessen.",
              "Datenübertragbarkeit soweit anwendbar.",
            ],
          },
        ],
      },
      {
        heading: "Anfragen",
        blocks: [
          {
            type: "p",
            text: `Bitte E‑Mail an ${e.email} mit klarer Betreffzeile — Antwort üblicherweise innerhalb von 30 Tagen.`,
          },
        ],
      },
      {
        heading: "Aufsichtsbehörde",
        blocks: [{ type: "p", text: "CNPD (Portugal): https://www.cnpd.pt" }],
      },
    ],
  };
}

export function gdprDocument(locale: Locale, e: LegalEntity): LegalDocument {
  switch (locale) {
    case "pt":
      return gdprPt(e);
    case "de":
      return gdprDe(e);
    default:
      return gdprEn(e);
  }
}
