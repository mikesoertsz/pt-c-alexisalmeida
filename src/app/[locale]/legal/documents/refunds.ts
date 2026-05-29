import type { LegalEntity } from "@/lib/legal-entity";
import type { Locale } from "@/lib/locale";
import type { LegalDocument } from "@/features/legal";

const UPDATED = {
  en: "Last updated: 29 May 2026",
  pt: "Última atualização: 29 de maio de 2026",
  de: "Stand: 29. Mai 2026",
} as const;

function refundsPt(e: LegalEntity): LegalDocument {
  return {
    meta: {
      lastUpdated: UPDATED.pt,
      documentTitle: "Política de reembolsos e sinais",
      description: "Sinais, reembolsos e direitos do consumidor.",
    },
    sections: [
      {
        heading: "1. Sinais (pré-pagamentos)",
        blocks: [
          {
            type: "p",
            text: "O sinal (tipicamente 30% do valor acordado) confirma a reserva de tempo do artista. Salvo disposição legal imperativa em contrário ou acordo expresso diferente, o sinal não é reembolsável em dinheiro. Pode ser transferido para uma nova data até uma vez, mediante aviso prévio mínimo de 48 horas e desde que haja disponibilidade.",
          },
        ],
      },
      {
        heading: "2. Pagamento da sessão",
        blocks: [
          {
            type: "p",
            text: "O saldo é pago conforme acordado antes ou no dia da sessão. Após a prestação do serviço acordada, não há lugar a reembolso total por arrependimento, salvo vício ou incumprimento grave imputável ao estúdio acreditável nos termos legais gerais.",
          },
        ],
      },
      {
        heading: "3. Retoques",
        blocks: [
          {
            type: "p",
            text: "Oferecemos normalmente um retoque gratuito no estúdio até 3 meses após a sessão quando necessário por cicatrização normal e desde que o cliente tenha cumprido as instruções de cuidados. Isto constitui garantia de serviço e não equivale a um reembolso monetário.",
          },
        ],
      },
      {
        heading: "4. Contratos à distância e direito de livre resolução",
        blocks: [
          {
            type: "p",
            text: "Se o contrato de prestação de serviços for celebrado à distância com consumidor, pode aplicar-se o regime da Diretiva 2011/83/UE, transpõe em Portugal o regime geral do direito de livre resolução no prazo de 14 dias. Contudo, esse direito cessa quando o serviço foi integralmente executado com acordo expresso e reconhecimento de perda do direito após início da execução. O pedido de marcação e a confirmação por escrito constituem, em regra, consentimento para iniciar a prestação preparatória.",
          },
        ],
      },
      {
        heading: "5. Como solicitar esclarecimentos ou reclamação",
        blocks: [
          {
            type: "p",
            text: `Contacte ${e.email} com identificação da marcação. Respondemos no prazo habitual de 30 dias ou nos prazos legais aplicáveis.`,
          },
        ],
      },
    ],
  };
}

function refundsEn(e: LegalEntity): LegalDocument {
  return {
    meta: {
      lastUpdated: UPDATED.en,
      documentTitle: "Refund and deposit policy",
      description: "Deposits, refunds and consumer rules.",
    },
    sections: [
      {
        heading: "1. Deposits",
        blocks: [
          {
            type: "p",
            text: "A 30% deposit secures your slot and is generally non-refundable in cash. It may be moved once with at least 48 hours’ notice subject to availability.",
          },
        ],
      },
      {
        heading: "2. Session payment",
        blocks: [
          {
            type: "p",
            text: "Balance is due as agreed. After the agreed tattoo work is completed, there is no full refund for change of mind unless mandatory law requires otherwise or we materially fail to deliver what was agreed.",
          },
        ],
      },
      {
        heading: "3. Touch-ups",
        blocks: [
          {
            type: "p",
            text: "One complimentary touch-up within three months may be offered when healing issues fall within normal tolerance and you followed aftercare. This is a service warranty, not a cash refund.",
          },
        ],
      },
      {
        heading: "4. Distance contracts, cooling-off",
        blocks: [
          {
            type: "p",
            text: "EU consumer rules (Directive 2011/83/EU) can give a 14-day cooling-off right for distance contracts. That right ends if you requested immediate performance and acknowledged losing the right once performance has begun. Booking confirmations typically include that acknowledgement.",
          },
        ],
      },
      {
        heading: "5. How to contact us",
        blocks: [{ type: "p", text: `Email ${e.email} with your booking details. We aim to reply within 30 days where applicable.` }],
      },
    ],
  };
}

function refundsDe(e: LegalEntity): LegalDocument {
  return {
    meta: {
      lastUpdated: UPDATED.de,
      documentTitle: "Erstattungs- und Anzahlungsrichtlinie",
      description: "Anzahlung, Rückzahlung, Fernabsatzrecht.",
    },
    sections: [
      {
        heading: "1. Anzahlung",
        blocks: [
          {
            type: "p",
            text: "Die übliche 30‑%‑Anzahlung ist Regel nicht bar erstattungsfähig; einmalige Umbuchung mit ≥48 h Vorlauf je nach freien Slots.",
          },
        ],
      },
      {
        heading: "2. Sitzungszahlung",
        blocks: [
          {
            type: "p",
            text: "Restzahlung nach Vereinbarung. Nach Erbringung der vereinbarten Leistung besteht kein Voll‑Erstattungsanspruch wegen Meinungsänderung, außer bei gesetzlichen Mängelrechten oder wesentlichem Pflichtverstoß.",
          },
        ],
      },
      {
        heading: "3. Retouches",
        blocks: [
          {
            type: "p",
            text: "Eine kostenlose Retouche innerhalb von drei Monaten kann bei normaler Heilung und korrekter Nachsorge angeboten werden, Leistungsgarantie, keine Barerstattung.",
          },
        ],
      },
      {
        heading: "4. Fernabsatz / Widerruf",
        blocks: [
          {
            type: "p",
            text: "Nach EU‑Fernabsatzrecht (2011/83/EU) kann ein 14‑Tage‑Widerruf bestehen; er erlischt, wenn Sie ausdrücklich mit sofortiger Ausführung einverstanden waren und die Ausführung begann. Buchungsbestätigungen spiegeln dies wider.",
          },
        ],
      },
      {
        heading: "5. Kontakt",
        blocks: [{ type: "p", text: `E‑Mail ${e.email} mit Buchungsreferenz, Antwort üblicherweise binnen 30 Tagen.` }],
      },
    ],
  };
}

export function refundsDocument(locale: Locale, e: LegalEntity): LegalDocument {
  switch (locale) {
    case "pt":
      return refundsPt(e);
    case "de":
      return refundsDe(e);
    default:
      return refundsEn(e);
  }
}
