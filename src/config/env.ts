/**
 * Vercel sets VERCEL_ENV to "production" | "preview" | "development"
 * on its platform. Locally it is unset.
 */

/**
 * Travel schedule JSON string.
 *
 * Set LEX_TRAVEL_SCHEDULE in the Vercel dashboard (not NEXT_PUBLIC — server only).
 *
 * Example value:
 *   [{"city":"Porto","country":"PT","from":"2026-01-01","to":"2026-05-31"},
 *    {"city":"Berlin","country":"DE","from":"2026-06-01","to":"2026-06-21","note":"Guest spot"},
 *    {"city":"Porto","country":"PT","from":"2026-06-22","to":"2026-12-31"}]
 *
 * See src/lib/travel.ts for the full LocationPeriod type.
 */
export function getTravelScheduleEnv(): string | undefined {
  return process.env.LEX_TRAVEL_SCHEDULE;
}
export function isVercelProduction(): boolean {
  return process.env.VERCEL_ENV === "production";
}

function isComingSoonDisabled(): boolean {
  const v = process.env.COMING_SOON_DISABLED?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

/** Homepage Coming Soon: Vercel production only, unless COMING_SOON_DISABLED is set. */
export function shouldShowHomepageComingSoon(): boolean {
  return isVercelProduction() && !isComingSoonDisabled();
}
