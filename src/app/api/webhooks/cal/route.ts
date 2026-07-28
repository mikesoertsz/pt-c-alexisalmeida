import { verifyCalWebhookSignature } from "@/lib/cal-webhook";
import { sendEmail, sendTemplatedEmail } from "@/lib/email";
import { baselineEmailVars } from "@/lib/email-variables";
import {
  buildOwnerNotification,
  extractWebhookFields,
  formatSlotForEmail,
  ownerNotifyRecipients,
  subjectForTemplate,
  triggerLabel,
  triggerToTemplate,
} from "@/lib/email-cal-webhook";
import { sendMetaCapiEvent } from "@/lib/meta-capi";

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

  // ---------------------------------------------------------------------------
  // Meta Conversions API — server-side Lead on a real booking.
  //
  // This is the only fully reliable conversion signal we have. The browser pixel
  // is consent-gated and was delivering almost nothing to Meta, so the Leads
  // campaign had no event to optimise against. Firing here means every genuine
  // booking reaches Meta with a hashed email for matching, regardless of cookie
  // consent, ad blockers or whether the visitor ever reached /thank-you.
  //
  // event_id is derived from the booking reference so a repeated webhook
  // delivery for the same booking is deduplicated by Meta rather than counted twice.
  // ---------------------------------------------------------------------------
  const isNewBooking =
    typeof trigger === "string" &&
    ["BOOKING_CREATED", "BOOKING_REQUESTED", "BOOKING_CONFIRMED"].includes(
      trigger.trim().toUpperCase(),
    );

  if (isNewBooking) {
    void sendMetaCapiEvent({
      eventName: "Lead",
      eventId: `cal-${extracted.bookingRef}`,
      actionSource: "system_generated",
      eventSourceUrl: `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.lextattoo.com"}/booking`,
      userData: {
        email: extracted.email,
        firstName: extracted.firstName,
      },
      customData: {
        content_name: "consultation_booking",
        content_category: extracted.serviceType,
      },
    }).catch(() => {
      /* never let measurement break the webhook response */
    });
  }

  // Internal notification to the agency/artist, fired for every booking event.
  // Best-effort: never let a failed notification block the client email.
  let notified = false;
  const recipients = ownerNotifyRecipients();
  if (recipients.length > 0) {
    const { subject, html } = buildOwnerNotification({
      label: triggerLabel(trigger),
      clientName: extracted.firstName,
      clientEmail: extracted.email,
      serviceType: extracted.serviceType,
      date,
      time,
      bookingRef: extracted.bookingRef,
      manageLink: extracted.rescheduleLink,
    });
    try {
      await sendEmail({
        to: recipients,
        subject,
        html,
        replyTo: extracted.email ?? undefined,
      });
      notified = true;
    } catch (err) {
      console.error("Owner booking notification failed:", err);
    }
  }

  if (!extracted.email) {
    return Response.json({ ok: true, mailed: false, notified, reason: "no attendee email" });
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
    return Response.json({ error: message, notified }, { status: 502 });
  }

  return Response.json({ ok: true, mailed: mailTemplate, notified });
}
