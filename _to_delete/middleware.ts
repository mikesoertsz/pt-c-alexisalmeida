import { NextResponse, type NextRequest } from "next/server";

/**
 * Server-side arrival counter.
 *
 * Why this exists: in July 2026 the ad platforms reported ~1,700 paid clicks
 * in 28 days while GA4 recorded 68 sessions. Client-side analytics cannot
 * settle that gap — it is gated on consent, JavaScript and the visitor not
 * bouncing before the tag loads. This middleware runs on the edge for every
 * HTML document request and records the hit BEFORE any of that applies, so
 * `page_hits` is the ground truth for "did the click actually arrive".
 *
 * Fire-and-forget: never blocks or fails the response.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function logHit(req: NextRequest) {
  if (!SUPABASE_URL || !SERVICE_KEY) return;

  const url = req.nextUrl;
  const q = url.searchParams;

  const row = {
    path: url.pathname,
    gclid: q.get("gclid"),
    fbclid: q.get("fbclid"),
    utm_source: q.get("utm_source"),
    utm_medium: q.get("utm_medium"),
    utm_campaign: q.get("utm_campaign"),
    utm_content: q.get("utm_content"),
    utm_term: q.get("utm_term"),
    referrer: req.headers.get("referer"),
    user_agent: req.headers.get("user-agent")?.slice(0, 500) ?? null,
    country: req.headers.get("x-vercel-ip-country"),
    is_paid: Boolean(q.get("gclid") || q.get("fbclid") || q.get("utm_source")),
  };

  // Fire-and-forget. Errors are swallowed on purpose.
  void fetch(`${SUPABASE_URL}/rest/v1/page_hits`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  }).catch(() => {});
}

export function middleware(req: NextRequest) {
  try {
    logHit(req);
  } catch {
    // never break a page render for analytics
  }
  return NextResponse.next();
}

export const config = {
  // HTML documents only — skip static assets, images and API routes.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|img|videos|.*\\.[\\w]+$).*)"],
};
