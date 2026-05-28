import type { CalBookRequestBody } from "@/lib/types/booking";

const CAL_API_ORIGIN = "https://api.cal.com";

export function calApiVersion(): string {
  return process.env.CAL_API_VERSION?.trim() || "2024-09-04";
}

function calHeaders(options: { withAuth?: boolean } = {}): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "cal-api-version": calApiVersion(),
  };
  const key = process.env.CAL_API_KEY?.trim();
  if (options.withAuth) {
    if (!key) {
      throw new Error("CAL_API_KEY is not configured");
    }
    headers.Authorization = `Bearer ${key}`;
  }
  return headers;
}

export function calUsername(): string {
  const u = process.env.CAL_USERNAME?.trim();
  if (!u) {
    throw new Error("CAL_USERNAME is not configured");
  }
  return u;
}

/** GET `/v2/slots`, see Cal.com Slots API reference. */
export async function fetchCalAvailableSlots(query: {
  eventTypeSlug: string;
  start: string;
  end: string;
  timeZone: string;
}): Promise<unknown> {
  const username = calUsername();
  const url = new URL(`${CAL_API_ORIGIN}/v2/slots`);
  url.searchParams.set("username", username);
  url.searchParams.set("eventTypeSlug", query.eventTypeSlug);
  url.searchParams.set("start", query.start);
  url.searchParams.set("end", query.end);
  url.searchParams.set("timeZone", query.timeZone);
  url.searchParams.set("format", "range");

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: calHeaders({ withAuth: true }),
    cache: "no-store",
  });

  const body = await res.text();
  if (!res.ok) {
    throw new Error(`Cal slots error ${res.status}: ${body.slice(0, 500)}`);
  }
  try {
    return JSON.parse(body) as unknown;
  } catch {
    throw new Error("Cal slots returned non-JSON");
  }
}

/** POST `/v2/bookings`. */
export async function createCalBooking(body: CalBookRequestBody): Promise<unknown> {
  const username = calUsername();
  const payload: Record<string, unknown> = {
    eventTypeSlug: body.eventTypeSlug,
    username,
    start: body.start,
    attendee: {
      name: body.attendee.name,
      email: body.attendee.email,
      timeZone: body.attendee.timeZone,
      ...(body.attendee.language ? { language: body.attendee.language } : {}),
    },
  };
  if (body.metadata && Object.keys(body.metadata).length > 0) {
    payload.metadata = body.metadata;
  }

  const res = await fetch(`${CAL_API_ORIGIN}/v2/bookings`, {
    method: "POST",
    headers: calHeaders({ withAuth: Boolean(process.env.CAL_API_KEY?.trim()) }),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const raw = await res.text();
  if (!res.ok) {
    throw new Error(`Cal booking error ${res.status}: ${raw.slice(0, 800)}`);
  }
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new Error("Cal booking returned non-JSON");
  }
}
