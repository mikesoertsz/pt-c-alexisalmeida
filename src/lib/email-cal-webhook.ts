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
