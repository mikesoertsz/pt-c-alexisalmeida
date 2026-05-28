import { verifyCalWebhookSignature } from "@/lib/cal-webhook";
import { sendTemplatedEmail } from "@/lib/email";
import { baselineEmailVars } from "@/lib/email-variables";
import {
  extractWebhookFields,
  formatSlotForEmail,
  subjectForTemplate,
  triggerToTemplate,
} from "@/lib/email-cal-webhook";

export const runtime = "nodejs";

export async function POST(req: Request): Promise<Response> {
  const rawBody = await req.text();
  const sig =
    req.headers.get("x-cal-signature-256") ??
    req.headers.get("X-Cal-Signature-256");

  if (!verifyCalWebhookSignature(rawBody, sig)) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const trigger = parsed.triggerEvent ?? parsed.type ?? parsed.event ?? "";
  const mailTemplate = triggerToTemplate(trigger);

  if (!mailTemplate) {
    return Response.json({ ok: true, skipped: String(trigger) });
  }

  const tz = process.env.DEFAULT_TIMEZONE?.trim() || "Europe/Lisbon";
  const extracted = extractWebhookFields(parsed);
  const { date, time } = formatSlotForEmail(extracted.startIso, tz);

  if (!extracted.email) {
    return Response.json({ ok: true, mailed: false, reason: "no attendee email" });
  }

  const baseline = baselineEmailVars();
  const variables: Record<string, string> = {
    ...baseline,
    client_first_name: extracted.firstName,
    service_type: extracted.serviceType,
    date: date || "-",
    time: time || "-",
    booking_reference: extracted.bookingRef,
    cancel_link: extracted.cancelLink,
    reschedule_link: extracted.rescheduleLink,
  };

  try {
    await sendTemplatedEmail({
      to: extracted.email,
      subject: subjectForTemplate(mailTemplate),
      template: mailTemplate,
      variables,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Email send failed";
    return Response.json({ error: message }, { status: 502 });
  }

  return Response.json({ ok: true, mailed: mailTemplate });
}
