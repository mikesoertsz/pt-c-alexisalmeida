import type { Locale } from "@/lib/locale";

export const thankYouCopy: Record<
  Locale,
  { title: string; body: string; emailNote: string; calendarLabel: string; cta: string }
> = {
  en: {
    title: "Consultation booked.",
    body: "Your consultation request has been received. Lex reviews every request personally and will follow up within 48 hours to confirm your slot and next steps.",
    emailNote: "Check your email — a booking confirmation has been sent to you.",
    calendarLabel: "Add to your calendar",
    cta: "Back to home",
  },
  pt: {
    title: "Consulta marcada.",
    body: "O seu pedido de consulta foi recebido. A Lex revê cada pedido pessoalmente e responde em 48 horas para confirmar a marcação e os próximos passos.",
    emailNote: "Verifique o seu e-mail — foi enviada uma confirmação de marcação.",
    calendarLabel: "Adicionar ao calendário",
    cta: "Voltar ao início",
  },
  de: {
    title: "Beratung gebucht.",
    body: "Ihre Beratungsanfrage ist eingegangen. Lex prüft jede Anfrage persönlich und meldet sich innerhalb von 48 Stunden, um Ihren Termin und die nächsten Schritte zu bestätigen.",
    emailNote: "Bitte prüfen Sie Ihre E-Mails — eine Buchungsbestätigung wurde an Sie gesendet.",
    calendarLabel: "Zum Kalender hinzufügen",
    cta: "Zur Startseite",
  },
};
