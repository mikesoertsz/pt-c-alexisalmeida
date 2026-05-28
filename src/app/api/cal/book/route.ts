import { NextResponse } from "next/server";
import { createCalBooking } from "@/lib/cal";
import { baselineEmailVars } from "@/lib/email-variables";
import { formatSlotForEmail, subjectForTemplate } from "@/lib/email-cal-webhook";
import { sendTemplatedEmail } from "@/lib/email";
import type { CalBookRequestBody } from "@/lib/types/booking";

export const runtime = "nodejs";

function coerceRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

function pickAttendeeEmailFromBookingResult(data: unknown): string | null {
  const root = coerceRecord(data);
  const inner = coerceRecord(root?.data) ?? root;
  const attendees = inner?.attendees;
  if (!Array.isArray(attendees) || attendees.length === 0) return null;
  const first = coerceRecord(attendees[0]);
  const email = first?.email;
  return typeof email === "string" && email.includes("@") ? email : null;
}

function pickBookingUid(data: unknown): string {
  const root = coerceRecord(data);
  const inner = coerceRecord(root?.data) ?? root;
  const uid = inner?.uid ?? root?.uid;
  return typeof uid === "string" && uid.length > 0 ? uid.slice(0, 36) : "-";
}

export async function POST(req: Request) {
  let body: CalBookRequestBody;
  try {
    body = (await req.json()) as CalBookRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    !body.eventTypeSlug?.trim() ||
    !body.start?.trim() ||
    !body.attendee?.email?.trim() ||
    !body.attendee?.name?.trim() ||
    !body.attendee?.timeZone?.trim()
  ) {
    return NextResponse.json(
      { error: "eventTypeSlug, start, and attendee { name, email, timeZone } are required" },
      { status: 400 },
    );
  }

  try {
    const result = await createCalBooking(body);
    const to = pickAttendeeEmailFromBookingResult(result) ?? body.attendee.email.trim();
    const tz = process.env.DEFAULT_TIMEZONE?.trim() || "Europe/Lisbon";
    const { date, time } = formatSlotForEmail(body.start, tz);
    const baseline = baselineEmailVars();
    const first = body.attendee.name.trim().split(/\s+/)[0] ?? "there";
    const ref = pickBookingUid(result);
    const reschedule =
      ref !== "-" ? `https://cal.com/booking/${encodeURIComponent(ref)}` : baseline.reschedule_link;

    try {
      await sendTemplatedEmail({
        to,
        subject: subjectForTemplate("booking-confirmation"),
        template: "booking-confirmation",
        variables: {
          ...baseline,
          client_first_name: first,
          service_type: body.eventTypeSlug.trim(),
          date: date || "-",
          time: time || "-",
          booking_reference: ref,
          cancel_link: baseline.cancel_link,
          reschedule_link: reschedule,
        },
      });
    } catch {
      /* Cal booking may still succeed without Resend configured */
    }

    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Booking failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
