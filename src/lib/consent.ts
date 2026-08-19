export const CONSENT_COOKIE = "COOKIE_CONSENT";
export const CONSENT_VERSION = 1;
export const CONSENT_CHANGE_EVENT = "cookie-consent:change";
export const CONSENT_OPEN_EVENT = "cookie-consent:open";

export type ConsentCategory = "necessary" | "preferences" | "analytics" | "marketing";

export const OPTIONAL_CATEGORIES = [
  "preferences",
  "analytics",
  "marketing",
] as const satisfies readonly ConsentCategory[];

export const CONSENT_CATEGORIES = [
  "necessary",
  ...OPTIONAL_CATEGORIES,
] as const satisfies readonly ConsentCategory[];

export type ConsentPreferences = Record<ConsentCategory, boolean>;

export interface ConsentRecord {
  version: number;
  timestamp: string;
  preferences: ConsentPreferences;
}

export const DENY_ALL: ConsentPreferences = {
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
};

export const GRANT_ALL: ConsentPreferences = {
  necessary: true,
  preferences: true,
  analytics: true,
  marketing: true,
};

const ONE_YEAR_SEC = 60 * 60 * 24 * 365;

export function serializeConsent(record: ConsentRecord): string {
  return encodeURIComponent(
    JSON.stringify({
      v: record.version,
      t: record.timestamp,
      c: [
        record.preferences.preferences ? 1 : 0,
        record.preferences.analytics ? 1 : 0,
        record.preferences.marketing ? 1 : 0,
      ].join(""),
    }),
  );
}

export function parseConsent(raw: string | undefined): ConsentRecord | null {
  if (!raw) return null;

  // Legacy binary cookie from the old accept/decline banner. Treat "accepted"
  // as a full grant and "declined" as a full deny so returning visitors are
  // not re-prompted immediately after this upgrade.
  if (raw === "accepted" || raw === "declined") {
    return {
      version: 0,
      timestamp: new Date(0).toISOString(),
      preferences: raw === "accepted" ? GRANT_ALL : DENY_ALL,
    };
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as { v?: number; t?: string; c?: string };
    if (typeof parsed.v !== "number" || typeof parsed.c !== "string") return null;
    const [prefs, analytics, marketing] = parsed.c.split("");
    return {
      version: parsed.v,
      timestamp: parsed.t ?? new Date(0).toISOString(),
      preferences: {
        necessary: true,
        preferences: prefs === "1",
        analytics: analytics === "1",
        marketing: marketing === "1",
      },
    };
  } catch {
    return null;
  }
}

export function readConsentCookie(): ConsentRecord | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CONSENT_COOKIE}=`))
    ?.slice(CONSENT_COOKIE.length + 1);
  return parseConsent(raw);
}

export function writeConsentCookie(record: ConsentRecord): void {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${serializeConsent(record)}; max-age=${ONE_YEAR_SEC}; Path=/; SameSite=Lax${secure}`;
}

/**
 * Consent Mode v2 default-denial script. Runs beforeInteractive, ahead of
 * any Google tag. Defaults everything to denied, then — if a returning
 * visitor already has a consent cookie — immediately replays their saved
 * choice so there is no flash of denied state before React hydrates.
 *
 * Ref: https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced
 */
export const CONSENT_DEFAULT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);
try {
  var m = document.cookie.match(/(?:^|; )${CONSENT_COOKIE}=([^;]*)/);
  var p = false, a = false, k = false;
  if (m) {
    if (m[1] === 'accepted') { p = a = k = true; }
    else if (m[1] !== 'declined') {
      var r = JSON.parse(decodeURIComponent(m[1]));
      if (r && r.v === ${CONSENT_VERSION} && typeof r.c === 'string') {
        p = r.c[0] === '1'; a = r.c[1] === '1'; k = r.c[2] === '1';
      }
    }
  }
  if (p || a || k) {
    gtag('consent', 'update', {
      ad_storage: k ? 'granted' : 'denied',
      ad_user_data: k ? 'granted' : 'denied',
      ad_personalization: k ? 'granted' : 'denied',
      analytics_storage: a ? 'granted' : 'denied',
      personalization_storage: p ? 'granted' : 'denied'
    });
    if (k) gtag('set', 'ads_data_redaction', false);
  }
} catch (e) {}
`.trim();

function signal(granted: boolean) {
  return granted ? "granted" : "denied";
}

export function updateGoogleConsent(preferences: ConsentPreferences): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    ad_storage: signal(preferences.marketing),
    ad_user_data: signal(preferences.marketing),
    ad_personalization: signal(preferences.marketing),
    analytics_storage: signal(preferences.analytics),
    personalization_storage: signal(preferences.preferences),
  });
  window.gtag("set", "ads_data_redaction", !preferences.marketing);
}

export function updateMetaConsent(preferences: ConsentPreferences): void {
  if (typeof window === "undefined") return;
  const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq !== "function") return;
  fbq("consent", preferences.marketing ? "grant" : "revoke");
}

export function openCookieSettings(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}
