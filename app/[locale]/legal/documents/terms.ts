import type { LegalEntity } from "@/app/lib/legal-entity";
import { formatAddressInline } from "@/app/lib/legal-entity";
import type { Locale } from "@/app/lib/locale";
import type { LegalDocument } from "../legal-types";

const UPDATED = {
  en: "Last updated: 10 May 2026",
  pt: "Última atualização: 10 de maio de 2026",
  de: "Stand: 10. Mai 2026",
} as const;

function entityIntroPt(e: LegalEntity): string {
  return `${e.legalName} (${e.tradingName}), com sede em ${formatAddressInline(e)}, NIF ${e.nif}, email ${e.email}.`;
}

function entityIntroEn(e: LegalEntity): string {
  return `${e.legalName} (trading as ${e.tradingName}), with registered address at ${formatAddressInline(e)}, tax ID (NIF) ${e.nif}, email ${e.email}.`;
}

function entityIntroDe(e: LegalEntity): string {
  return `${e.legalName} (${e.tradingName}), Anschrift: ${formatAddressInline(e)}, Steuernummer (NIF) ${e.nif}, E‑Mail: ${e.email}.`;
}

function termsPt(e: LegalEntity): LegalDocument {
  return {
    meta: {
      lastUpdated: UPDATED.pt,
      documentTitle: "Termos e condições de utilização",
      description: "Termos de serviço do estúdio em Portugal.",
    },
    sections: [
      {
        heading: "1. Identificação",
        blocks: [
          { type: "p", text: entityIntroPt(e) },
          {
            type: "p",
            text: "Os presentes termos regulam a utilização do website e a contratação de serviços de tatuagem e consulta associados, no âmbito da legislação portuguesa e da união Europeia.",
          },
        ],
      },
      {
        heading: "2. Serviços",
        blocks: [
          {
            type: "p",
            text: "O estúdio oferece consultas, desenho e execução de tatuagens, orientações de cuidados posteriores e, quando acordado, sessões de retoque. O conteúdo exato de cada sessão é acordado caso a caso.",
          },
        ],
      },
      {
        heading: "3. Marcação e sinal",
        blocks: [
          {
            type: "p",
            text: "A marcação pode ser solicitada através dos meios indicados no website (por exemplo widget de reservas ou contacto direto). A reserva fica condicionada à confirmação do estúdio e, quando aplicável, ao pagamento de um sinal.",
          },
          {
            type: "p",
            text: "O sinal (tipicamente 30% do valor acordado para a sessão) confirma a intenção de ambas as partes. Os detalhes do valor, data e política de sinal são confirmados por escrito (email ou mensagem) antes da prestação.",
          },
        ],
      },
      {
        heading: "4. Cancelamento e remarcação",
        blocks: [
          {
            type: "p",
            text: "O cancelamento pelo cliente e o tratamento do sinal seguem a política de reembolsos publicada em /legal/refunds. Em geral, o sinal não é reembolsável em dinheiro, mas pode ser transferido para nova data com aviso prévio mínimo de 48 horas, sujeito a disponibilidade.",
          },
        ],
      },
      {
        heading: "5. Obrigações do cliente",
        blocks: [
          {
            type: "ul",
            items: [
              "Idade mínima 18 anos; poderá ser solicitada identificação.",
              "Divulgar informações de saúde relevantes (alergias, medicação, condições dermatológicas, gravidez, etc.) antes da sessão.",
              "Seguir as instruções de preparação e de cuidados posteriores fornecidas pelo estúdio.",
            ],
          },
        ],
      },
      {
        heading: "6. Direito de recusar o serviço",
        blocks: [
          {
            type: "p",
            text: "O estúdio pode recusar ou interromper o serviço por motivos de saúde ou segurança, por desenho que viole a lei ou padrões profissionais, por incumprimento do cliente ou por comportamento abusivo. Nestes casos pode aplicar-se a retenção ou perda do sinal, conforme a política de reembolsos.",
          },
        ],
      },
      {
        heading: "7. Propriedade intelectual",
        blocks: [
          {
            type: "p",
            text: "Os desenhos e materiais preparados pelo artista mantêm-se protegidos por direitos de autor. Salvo acordo escrito em contrário, concede-se ao cliente uma licença não exclusiva para exibir a tatuagem no corpo e partilhar imagens com menção de crédito ao artista quando publicamente divulgadas.",
          },
        ],
      },
      {
        heading: "8. Limitação de responsabilidade",
        blocks: [
          {
            type: "p",
            text: "Resultados de cicatrização variam entre pessoas. O estúdio não é responsável por alterações devidas a cuidados inadequados, exposição solar, infeções ou fatores individuais. Retoques gratuitos no período indicado na política de reembolsos constituem garantia de serviço, não substituto de indemnização, salvo dolo ou negligência grave comprovada.",
          },
        ],
      },
      {
        heading: "9. Lei aplicável e foro",
        blocks: [{ type: "p", text: `Lei aplicável e jurisdição: ${e.jurisdictionPt}` }],
      },
    ],
  };
}

function termsEn(e: LegalEntity): LegalDocument {
  return {
    meta: {
      lastUpdated: UPDATED.en,
      documentTitle: "Terms and conditions",
      description: "Terms of service for the tattoo studio in Portugal.",
    },
    sections: [
      {
        heading: "1. Business identification",
        blocks: [{ type: "p", text: entityIntroEn(e) }],
      },
      {
        heading: "2. Services",
        blocks: [
          {
            type: "p",
            text: `We offer consultations, custom tattoo work, aftercare guidance and, when agreed, touch-ups for clients visiting ${e.studioLocation}. The scope of each visit is agreed individually.`,
          },
        ],
      },
      {
        heading: "3. Booking and deposit",
        blocks: [
          {
            type: "p",
            text: "Bookings are made through the channels shown on this site. A booking is confirmed once we confirm in writing and, where required, a deposit is paid. Deposit percentage and balance terms are stated in our confirmation message.",
          },
        ],
      },
      {
        heading: "4. Cancellation and rescheduling",
        blocks: [
          {
            type: "p",
            text: "Cancellation rules and deposit handling are set out in our refund policy at /legal/refunds. Generally the deposit is not refundable in cash but may be moved once with at least 48 hours’ notice subject to availability.",
          },
        ],
      },
      {
        heading: "5. Client obligations",
        blocks: [
          {
            type: "ul",
            items: [
              "Clients must be 18+; ID may be requested.",
              "Share relevant health information before the session.",
              "Follow preparation and aftercare instructions.",
            ],
          },
        ],
      },
      {
        heading: "6. Right to refuse service",
        blocks: [
          {
            type: "p",
            text: "We may refuse or stop work for health/safety reasons, unlawful or unethical designs, breach of these terms, or abusive behaviour. Deposit treatment follows the refund policy.",
          },
        ],
      },
      {
        heading: "7. Intellectual property",
        blocks: [
          {
            type: "p",
            text: "Artists retain copyright in preparatory artwork. Unless otherwise agreed in writing, you receive a non-exclusive licence to wear the tattoo and to share photos with reasonable artist credit for public use.",
          },
        ],
      },
      {
        heading: "8. Limitation of liability",
        blocks: [
          {
            type: "p",
            text: "Healing varies by individual. We are not liable for outcomes caused by poor aftercare, sun exposure, infection or personal factors. Complimentary touch-ups within the stated window are a service commitment—not a substitute for damages except where mandatory law requires.",
          },
        ],
      },
      {
        heading: "9. Governing law and jurisdiction",
        blocks: [{ type: "p", text: e.jurisdictionEn }],
      },
    ],
  };
}

function termsDe(e: LegalEntity): LegalDocument {
  return {
    meta: {
      lastUpdated: UPDATED.de,
      documentTitle: "Allgemeine Geschäftsbedingungen",
      description: "AGB des Tattoo‑Studios in Portugal.",
    },
    sections: [
      {
        heading: "1. Unternehmensangaben",
        blocks: [{ type: "p", text: entityIntroDe(e) }],
      },
      {
        heading: "2. Leistungen",
        blocks: [
          {
            type: "p",
            text: `Beratung, individuelles Tattoo‑Design, Nachsorgehinweise und ggf. Retouches am Standort ${e.studioLocation}. Umfang und Preis werden einzeln vereinbart.`,
          },
        ],
      },
      {
        heading: "3. Buchung und Anzahlung",
        blocks: [
          {
            type: "p",
            text: "Buchungen erfolgen über die auf der Website genannten Kanäle. Mit schriftlicher Bestätigung und ggf. Anzahlung wird der Termin verbindlich. Details stehen in der Bestätigung.",
          },
        ],
      },
      {
        heading: "4. Stornierung und Umbuchung",
        blocks: [
          {
            type: "p",
            text: "Siehe Erstattungsrichtlinie unter /legal/refunds. In der Regel ist die Anzahlung nicht in bar erstattungsfähig, kann aber einmalig mit mindestens 48 h Vorlauf verschoben werden — je nach Kapazität.",
          },
        ],
      },
      {
        heading: "5. Pflichten der Kundin / des Kunden",
        blocks: [
          {
            type: "ul",
            items: [
              "Mindestalter 18 Jahre; Ausweis möglich.",
              "Gesundheitsrelevante Angaben vor dem Termin mitteilen.",
              "Vorbereitung und Nachsorge befolgen.",
            ],
          },
        ],
      },
      {
        heading: "6. Leistungsverweigerung",
        blocks: [
          {
            type: "p",
            text: "Wir können aus Gesundheits‑, Sicherheits‑ oder rechtlichen Gründen sowie bei Verstößen gegen diese Bedingungen ablehnen oder abbrechen. Folgen für die Anzahlung siehe Erstattungsrichtlinie.",
          },
        ],
      },
      {
        heading: "7. Urheberrecht",
        blocks: [
          {
            type: "p",
            text: "Der Künstler behält Urheberrechte an Vorlagen. Sofern nichts anderes schriftlich vereinbart ist, erhalten Sie eine einfache, nicht exklusive Lizenz zur Durchführung am Körper und zur redlichen Namensnennung bei öffentlicher Verbreitung von Fotos.",
          },
        ],
      },
      {
        heading: "8. Haftungsbeschränkung",
        blocks: [
          {
            type: "p",
            text: "Heilungsverläufe sind individuell. Für Ergebnisse durch mangelnde Nachsorge, UV‑Einwirkung oder Infektion haften wir nicht. Kostenlose Retouches im angegebenen Zeitfenster sind Servicegarantie — keine Schadensersatzpflicht außerhalb zwingender gesetzlicher Fälle.",
          },
        ],
      },
      {
        heading: "9. Anwendbares Recht und Gerichtsstand",
        blocks: [{ type: "p", text: e.jurisdictionDe }],
      },
    ],
  };
}

export function termsDocument(locale: Locale, e: LegalEntity): LegalDocument {
  switch (locale) {
    case "pt":
      return termsPt(e);
    case "de":
      return termsDe(e);
    default:
      return termsEn(e);
  }
}
