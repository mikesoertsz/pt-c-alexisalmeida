import type { Locale } from "@/lib/locale";

const INTL_LOCALE: Record<Locale, string> = {
  en: "en-IE",
  pt: "pt-PT",
  de: "de-DE",
};

export function formatEurAmount(locale: Locale, amount: number): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale], {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatFromPriceTemplate(template: string, formattedAmount: string): string {
  return template.replace("{amount}", formattedAmount);
}
