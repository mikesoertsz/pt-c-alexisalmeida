import { sendMetaCapiEvent } from "@/lib/meta-capi";

export const runtime = "nodejs";

/**
 * Server-side mirror for browser-originated Meta events.
 *
 * The client calls this alongside fbq() with the SAME event_id, so Meta
 * deduplicates the browser and server copy and counts one event. The server leg
 * survives ad blockers, iOS ITP and JavaScript failures, which the pixel does not.
 *
 * Only a small allow-list of standard events is accepted so this cannot be used
 * as an open relay into the ad account.
 */

const ALLOWED_EVENTS = new Set(["PageView", "Lead", "Contact", "ViewContent", "Schedule"]);

function firstIp(header: string | null): string | null {
  if (!header) return null;
  return header.split(",")[0]?.trim() || null;
}

function readCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=") || null;
  }
  return null;
}

export async function POST(req: Request): Promise<Response> {
  let payload: { eventName?: string; eventId?: string; eventSourceUrl?: string; customData?: Record<string, string | number> };
  try {
    payload = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { eventName, eventId } = payload;
  if (!eventName || !eventId || !ALLOWED_EVENTS.has(eventName)) {
    return Response.json({ ok: false, error: "Unsupported event" }, { status: 400 });
  }

  const cookies = req.headers.get("cookie");

  const sent = await sendMetaCapiEvent({
    eventName,
    eventId,
    eventSourceUrl: payload.eventSourceUrl ?? req.headers.get("referer"),
    actionSource: "website",
    customData: payload.customData,
    userData: {
      clientIpAddress:
        firstIp(req.headers.get("x-forwarded-for")) ?? req.headers.get("x-real-ip"),
      clientUserAgent: req.headers.get("user-agent"),
      fbp: readCookie(cookies, "_fbp"),
      fbc: readCookie(cookies, "_fbc"),
    },
  });

  return Response.json({ ok: sent });
}
