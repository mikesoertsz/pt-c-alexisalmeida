const FALLBACK_DIGITS = "351934613635";

/** Default studio WhatsApp number (E.164 without +). */
export const DEFAULT_WHATSAPP_PHONE = FALLBACK_DIGITS;

interface GetWhatsAppUrlOptions {
  message?: string;
}

export function getWhatsAppUrl(options?: GetWhatsAppUrlOptions): string {
  const override = process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim();
  if (override) return override;

  const base = `https://wa.me/${FALLBACK_DIGITS}`;
  const message = options?.message?.trim();
  if (!message) {
    return base;
  }

  return `${base}?text=${encodeURIComponent(message)}`;
}
