/** Default studio WhatsApp number (E.164 without +). */
export const DEFAULT_WHATSAPP_PHONE = "351934613635";

interface GetWhatsAppUrlOptions {
  message?: string;
}

export function getWhatsAppUrl(options?: GetWhatsAppUrlOptions): string {
  const envUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim();
  if (envUrl && envUrl.length > 0) {
    return envUrl;
  }

  const base = `https://wa.me/${DEFAULT_WHATSAPP_PHONE}`;
  const message = options?.message?.trim();
  if (!message) {
    return base;
  }

  return `${base}?text=${encodeURIComponent(message)}`;
}
