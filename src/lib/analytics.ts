export function trackEvent(eventName: string, params?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params ?? {});
}

/** Stable-ish unique id shared between the browser pixel and the CAPI copy. */
function newEventId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Fires a Meta standard event on BOTH the browser pixel and the Conversions API,
 * sharing one event_id so Meta deduplicates them into a single event.
 *
 * The pixel leg is consent-gated and blocked for a large share of visitors. The
 * server leg is not, which is the entire point — see src/lib/meta-capi.ts.
 */
export function trackMetaEvent(
  eventName: string,
  params?: Record<string, string | number>,
) {
  if (typeof window === "undefined") return;
  const eventId = newEventId();

  const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq === "function") {
    fbq("track", eventName, params ?? {}, { eventID: eventId });
  }

  // Server-side mirror. Best-effort and non-blocking.
  try {
    const body = JSON.stringify({
      eventName,
      eventId,
      eventSourceUrl: window.location.href,
      customData: params,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/meta/capi", new Blob([body], { type: "application/json" }));
    } else {
      void fetch("/api/meta/capi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    /* measurement must never break the page */
  }
}
