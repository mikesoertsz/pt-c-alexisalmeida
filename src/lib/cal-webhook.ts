import { createHmac, timingSafeEqual } from "node:crypto";

/** Cal.com webhook auth: compare HMAC SHA256(secret, rawBody) with `x-cal-signature-256` header (hex). */
export function verifyCalWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = process.env.CAL_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }
  if (!signatureHeader) {
    return false;
  }
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const received = signatureHeader.trim().toLowerCase().replace(/^sha256=/i, "");
  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(received, "hex"));
  } catch {
    return false;
  }
}
