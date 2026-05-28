export function trackEvent(eventName: string, params?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params ?? {});
}

/** Fire a Meta Pixel standard or custom event when fbq is loaded. */
export function trackMetaEvent(
  eventName: string,
  params?: Record<string, string | number>,
) {
  if (typeof window === "undefined") return;
  const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq !== "function") return;
  fbq("track", eventName, params ?? {});
}
