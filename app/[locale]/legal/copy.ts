import type { Locale } from "@/app/lib/locale";

export const thankYouCopy: Record<
  Locale,
  { title: string; body: string; cta: string }
> = {
  en: {
    title: "Thank you",
    body: "Your booking request was received. We will contact you shortly to confirm the details.",
    cta: "Back to home",
  },
  pt: {
    title: "Obrigado",
    body: "Recebemos o seu pedido de marcação. Entraremos em contacto em breve para confirmar os detalhes.",
    cta: "Voltar ao início",
  },
  de: {
    title: "Vielen Dank",
    body: "Wir haben Ihre Buchungsanfrage erhalten und melden uns zeitnah mit den Details.",
    cta: "Zur Startseite",
  },
};
