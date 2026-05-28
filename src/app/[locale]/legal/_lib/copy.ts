import type { Locale } from "@/lib/locale";

export const thankYouCopy: Record<
  Locale,
  { title: string; body: string; cta: string }
> = {
  en: {
    title: "Consultation booked.",
    body: "Your consultation request has been received. Lex reviews every request personally and will follow up within 48 hours to confirm your slot and next steps.",
    cta: "Back to home",
  },
  pt: {
    title: "Consulta marcada.",
    body: "O seu pedido de consulta foi recebido. A Lex revê cada pedido pessoalmente e responde em 48 horas para confirmar a marcação e os próximos passos.",
    cta: "Voltar ao início",
  },
  de: {
    title: "Beratung gebucht.",
    body: "Ihre Beratungsanfrage ist eingegangen. Lex prüft jede Anfrage persönlich und meldet sich innerhalb von 48 Stunden, um Ihren Termin und die nächsten Schritte zu bestätigen.",
    cta: "Zur Startseite",
  },
};
