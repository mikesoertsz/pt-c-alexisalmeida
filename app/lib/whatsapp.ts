export function getWhatsAppUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim();
  return url && url.length > 0 ? url : null;
}
