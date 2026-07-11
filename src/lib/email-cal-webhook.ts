import type { EmailTemplateName } from "@/lib/email";

export function triggerToTemplate(triggerRaw: unknown): EmailTemplateName | null {
  const trigger = typeof triggerRaw === "string" ? triggerRaw.trim().toUpperCase() : "";
  switch (trigger) {
    case "BOOKING_CREATED":
    case "BOOKING_REQUESTED":
      return "booking-confirmation";
    case "BOOKING_CONFIRMED":
      return "booking-confirmed-session";
    case "BOOKING_CANCELLED":
      return "cancellation";
    case "BOOKING_RESCHEDULED":
      return "reschedule-confirmation";
    case "BOOKING_PAID":
      return "deposit-received";
    default:
      return null;
  }
}

export function subjectForTemplate(template: EmailTemplateName): string {
  switch (template) {
    case "booking-confirmation":
      return "Booking received, Lex Almeida Tattoo";
    case "booking-confirmed-session":
      return "Your session is confirmed, Lex Almeida Tattoo";
    case "deposit-received":
      return "Deposit received, Lex Almeida Tattoo";
    case "reminder-24h":
      return "Reminder: appointment tomorrow, Lex Almeida Tattoo";
    case "reminder-2h":
      return "Reminder: starting soon, Lex Almeida Tattoo";
    case "aftercare-guide":
      return "Aftercare notes, Lex Almeida Tattoo";
    case "review-request":
      return "Feedback on your tattoo, Lex Almeida Tattoo";
    case "cancellation":
      return "Booking cancelled, Lex Almeida Tattoo";
    case "reschedule-confirmation":
      return "Your booking date changed, Lex Almeida Tattoo";
    case "consultation-followup":
      return "Ready to book your session? Lex Almeida Tattoo";
    default:
      return "Lex Almeida Tattoo";
  }
}

function coerceRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

/** Best-effort read of Cal webhook JSON, payloads vary slightly by trigger. */
export function extractWebhookFields(parsed: Record<string, unknown>): {
  email: string | null;
  firstName: string;
  serviceType: string;
  bookingRef: string;
  startIso: string;
  cancelLink: string;
  rescheduleLink: string;
} {
  const payload =
    coerceRecord(parsed.payload) ?? coerceRecord(parsed.data) ?? coerceRecord(parsed.booking);

  const base = payload ?? coerceRecord(parsed);
  const empty = (): ReturnType<typeof extractWebhookFields> => ({
    email: null,
    firstName: "there",
    serviceType: "Consultation",
    bookingRef: "-",
    startIso: "",
    cancelLink: "https://cal.com",
    rescheduleLink: "https://cal.com",
  });

  if (!base) {
    return empty();
  }

  const attendees = Array.isArray(base.attendees) ? base.attendees : [];
  const firstAttendee = attendees.length > 0 ? coerceRecord(attendees[0]) : null;
  let email: string | null =
    typeof firstAttendee?.email === "string" && firstAttendee.email.includes("@")
      ? firstAttendee.email
      : null;

  if (!email && typeof base.attendeeEmail === "string") {
    email = base.attendeeEmail;
  }

  const rawName = typeof firstAttendee?.name === "string" ? firstAttendee.name : "";
  const firstNameRaw = rawName.trim().split(/\s+/)[0] ?? "";
  const firstName = firstNameRaw.length > 0 ? firstNameRaw : "there";

  const uidRaw = base.uid ?? base.bookingUid;
  const bookingRef =
    typeof uidRaw === "string" && uidRaw.length > 0 ? uidRaw.slice(0, 32) : "-";

  const titleCandidate = base.title ?? base.eventTitle ?? parsed.title;
  const serviceType =
    typeof titleCandidate === "string" && titleCandidate.trim().length > 0 ? titleCandidate : "Consultation";

  const startCandidate = base.startTime ?? base.start ?? parsed.startTime;
  const startIso = typeof startCandidate === "string" ? startCandidate : "";

  const rescheduleLink =
    bookingRef !== "-" ? `https://cal.com/booking/${encodeURIComponent(bookingRef)}` : "https://cal.com";

  return {
    email,
    firstName,
    serviceType,
    bookingRef,
    startIso,
    cancelLink: "https://cal.com",
    rescheduleLink,
  };
}

export function formatSlotForEmail(startIso: string, timeZone: string): { date: string; time: string } {
  const d = new Date(startIso);
  if (Number.isNaN(d.getTime())) {
    return { date: startIso || "-", time: "" };
  }
  const date = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone,
  }).format(d);
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
    timeZone,
  }).format(d);
  return { date, time };
}

// ---------------------------------------------------------------------------
// Internal owner notification, sent to the agency/artist when a booking changes
// ---------------------------------------------------------------------------

/** Recipients for the internal booking notification. Comma-separated env override. */
export function ownerNotifyRecipients(): string[] {
  const raw = process.env.BOOKING_NOTIFY_EMAIL?.trim() || "mike@drifter.agency";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.includes("@"));
}

/** Human-readable label for a Cal trigger, used in the owner notification subject. */
export function triggerLabel(triggerRaw: unknown): string {
  const trigger = typeof triggerRaw === "string" ? triggerRaw.trim().toUpperCase() : "";
  switch (trigger) {
    case "BOOKING_CREATED":
    case "BOOKING_REQUESTED":
      return "New booking";
    case "BOOKING_CONFIRMED":
      return "Booking confirmed";
    case "BOOKING_CANCELLED":
      return "Booking cancelled";
    case "BOOKING_RESCHEDULED":
      return "Booking rescheduled";
    case "BOOKING_PAID":
      return "Deposit paid";
    default:
      return "Booking update";
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Build the internal "you got a booking" email sent to the agency/artist. */
export function buildOwnerNotification(input: {
  label: string;
  clientName: string;
  clientEmail: string | null;
  serviceType: string;
  date: string;
  time: string;
  bookingRef: string;
  manageLink: string;
}): { subject: string; html: string } {
  const subject = `${input.label}: ${input.clientName} — Lex Almeida Tattoo`;

  const rows: [string, string][] = [
    ["Client", input.clientName],
    ["Email", input.clientEmail ?? "—"],
    ["Service", input.serviceType],
    ["Date", input.date || "—"],
    ["Time", input.time || "—"],
    ["Reference", input.bookingRef],
  ];

  const rowsHtml = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#7a7a7a;font:12px/1.5 monospace;text-transform:uppercase;letter-spacing:.08em;vertical-align:top;white-space:nowrap">${escapeHtml(
          k,
        )}</td><td style="padding:6px 0;color:#222;font:14px/1.5 -apple-system,Segoe UI,Roboto,sans-serif">${escapeHtml(
          v,
        )}</td></tr>`,
    )
    .join("");

  const mailto = input.clientEmail
    ? `<a href="mailto:${encodeURIComponent(input.clientEmail)}" style="color:#FF6D1F">Reply to client</a> &nbsp;·&nbsp; `
    : "";

  const html = `<!doctype html><html><body style="margin:0;background:#FAF3E1;padding:24px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#fff;border:2px solid #222">
    <tr><td style="background:#222;padding:16px 24px">
      <span style="color:#fff;font:700 13px/1 -apple-system,Segoe UI,Roboto,sans-serif;text-transform:uppercase;letter-spacing:.1em">Lex Almeida Tattoo</span>
      <span style="color:#FF6D1F;font:12px/1 monospace;text-transform:uppercase;letter-spacing:.1em;float:right">${escapeHtml(
        input.label,
      )}</span>
    </td></tr>
    <tr><td style="padding:24px">
      <p style="margin:0 0 16px;font:600 16px/1.4 -apple-system,Segoe UI,Roboto,sans-serif;color:#222">${escapeHtml(
        input.label,
      )} from ${escapeHtml(input.clientName)}.</p>
      <table role="presentation" cellpadding="0" cellspacing="0">${rowsHtml}</table>
      <p style="margin:24px 0 0;font:13px/1.5 -apple-system,Segoe UI,Roboto,sans-serif">${mailto}<a href="${escapeHtml(
        input.manageLink,
      )}" style="color:#FF6D1F">Manage in Cal.com</a></p>
    </td></tr>
    <tr><td style="padding:12px 24px;border-top:1px solid #e9e4dc;font:11px/1.5 monospace;color:#7a7a7a;text-transform:uppercase;letter-spacing:.06em">Automated notification · PortugalTattoo / Drifter</td></tr>
  </table>
</body></html>`;

  return { subject, html };
}
