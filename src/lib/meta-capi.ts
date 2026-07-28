import crypto from "node:crypto";

/**
 * Meta Conversions API (server-side events).
 *
 * Why this exists: the browser pixel is initialised with consent revoked and
 * only releases events once a visitor accepts the cookie banner. Events Manager
 * showed 4 PageViews and 3 Leads received in the pixel's entire lifetime while
 * the ad account reported hundreds of landing page views, so Meta was receiving
 * effectively nothing and had no signal to optimise against.
 *
 * CAPI sends the same events server-to-server. Each event carries an event_id
 * that matches the browser pixel's eventID so Meta deduplicates the pair and
 * counts it once.
 *
 * Docs: https://developers.facebook.com/docs/marketing-api/conversions-api
 */

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() ?? "";
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN?.trim() ?? "";
const TEST_EVENT_CODE = process.env.META_CAPI_TEST_EVENT_CODE?.trim() ?? "";
const API_VERSION = "v21.0";

export type MetaUserData = {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  city?: string | null;
  country?: string | null;
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
  /** _fbp cookie, passed straight through un-hashed. */
  fbp?: string | null;
  /** _fbc cookie or fbclid-derived value, passed straight through un-hashed. */
  fbc?: string | null;
};

export type MetaCapiEvent = {
  eventName: string;
  /** MUST match the browser pixel's eventID for the same action, so Meta dedupes. */
  eventId: string;
  eventSourceUrl?: string | null;
  eventTime?: number;
  actionSource?: "website" | "system_generated";
  userData?: MetaUserData;
  customData?: Record<string, string | number>;
};

/** Meta requires SHA-256 of the normalised (trimmed, lower-cased) value. */
function hash(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const normalised = value.trim().toLowerCase();
  if (!normalised) return undefined;
  return crypto.createHash("sha256").update(normalised).digest("hex");
}

/** Phones must be digits only, including country code, before hashing. */
function hashPhone(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const digits = value.replace(/\D/g, "");
  if (!digits) return undefined;
  return crypto.createHash("sha256").update(digits).digest("hex");
}

function buildUserData(u: MetaUserData | undefined) {
  if (!u) return {};
  const out: Record<string, unknown> = {};
  const em = hash(u.email);
  const ph = hashPhone(u.phone);
  const fn = hash(u.firstName);
  const ln = hash(u.lastName);
  const ct = hash(u.city);
  const country = hash(u.country);

  // Meta expects these as arrays.
  if (em) out.em = [em];
  if (ph) out.ph = [ph];
  if (fn) out.fn = [fn];
  if (ln) out.ln = [ln];
  if (ct) out.ct = [ct];
  if (country) out.country = [country];

  // Never hashed.
  if (u.clientIpAddress) out.client_ip_address = u.clientIpAddress;
  if (u.clientUserAgent) out.client_user_agent = u.clientUserAgent;
  if (u.fbp) out.fbp = u.fbp;
  if (u.fbc) out.fbc = u.fbc;

  return out;
}

export function isMetaCapiConfigured(): boolean {
  return Boolean(PIXEL_ID && ACCESS_TOKEN);
}

/**
 * Sends one event to the Conversions API. Never throws — measurement must never
 * break a booking, a webhook response or a page render.
 */
export async function sendMetaCapiEvent(event: MetaCapiEvent): Promise<boolean> {
  if (!isMetaCapiConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Meta CAPI not configured — skipping", event.eventName);
    }
    return false;
  }

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: event.eventName,
        event_time: event.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        action_source: event.actionSource ?? "website",
        ...(event.eventSourceUrl ? { event_source_url: event.eventSourceUrl } : {}),
        user_data: buildUserData(event.userData),
        ...(event.customData ? { custom_data: event.customData } : {}),
      },
    ],
  };
  if (TEST_EVENT_CODE) body.test_event_code = TEST_EVENT_CODE;

  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(ACCESS_TOKEN)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    if (!res.ok) {
      console.error("Meta CAPI rejected event", event.eventName, res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Meta CAPI request failed", event.eventName, err);
    return false;
  }
}
