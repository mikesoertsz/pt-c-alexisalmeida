/**
 * Vercel sets VERCEL_ENV to "production" | "preview" | "development"
 * on its platform. Locally it is unset.
 */
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
