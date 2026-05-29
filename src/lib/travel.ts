/**
 * Travel schedule library.
 *
 * Primary source: travel_periods table in Supabase (managed via /admin).
 * Fallback:       LEX_TRAVEL_SCHEDULE env var (JSON array, set in Vercel).
 *
 * Fallback env var example (set as a single-line string):
 *   [{"city":"Porto","country":"PT","from":"2026-01-01","to":"2026-05-31"},
 *    {"city":"Berlin","country":"DE","from":"2026-06-01","to":"2026-06-21","note":"Guest spot"},
 *    {"city":"Porto","country":"PT","from":"2026-06-22","to":"2026-12-31"}]
 *
 * If neither is configured, Porto is assumed permanently.
 */

import { cache } from "react";
import { createServiceClient } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CountryCode = "PT" | "DE" | string;

export type LocationPeriod = {
  id?: string;
  city: string;
  country: CountryCode;
  from: string;  // "YYYY-MM-DD"
  to: string;    // "YYYY-MM-DD"
  calSlug?: string;
  note?: string;
};

export type HomeLocation = {
  city: string;
  country: CountryCode;
};

export const HOME_LOCATION: HomeLocation = { city: "Porto", country: "PT" };

export const COUNTRY_NAMES: Record<string, string> = {
  PT: "Portugal",
  DE: "Germany",
};

export function countryFlag(code: string): string {
  const flags: Record<string, string> = { PT: "🇵🇹", DE: "🇩🇪" };
  return flags[code] ?? "";
}

// ---------------------------------------------------------------------------
// Internal date helpers
// ---------------------------------------------------------------------------

function toDate(s: string): Date {
  return new Date(`${s}T00:00:00`);
}

function todayDate(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// ---------------------------------------------------------------------------
// Env-var fallback (sync)
// ---------------------------------------------------------------------------

function parseEnvSchedule(): LocationPeriod[] {
  const raw = process.env.LEX_TRAVEL_SCHEDULE?.trim();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p): p is LocationPeriod =>
        typeof p === "object" &&
        p !== null &&
        typeof p.city === "string" &&
        typeof p.country === "string" &&
        typeof p.from === "string" &&
        typeof p.to === "string"
    );
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// DB fetch — React cache deduplicates across a single render pass
// ---------------------------------------------------------------------------

/**
 * Fetches the schedule from Supabase, falls back to env var, falls back to [].
 * Cached per request via React cache().
 */
export const getEffectiveSchedule = cache(async (): Promise<LocationPeriod[]> => {
  try {
    const db = createServiceClient();
    if (db) {
      const { data, error } = await db
        .from("travel_periods")
        .select("id, city, country, from_date, to_date, note, cal_slug")
        .order("from_date", { ascending: true });

      if (!error && data && data.length > 0) {
        // Map DB column names to LocationPeriod shape
        return data.map((r) => ({
          id: r.id as string,
          city: r.city as string,
          country: r.country as string,
          from: r.from_date as string,
          to: r.to_date as string,
          note: r.note as string | undefined,
          calSlug: r.cal_slug as string | undefined,
        }));
      }
    }
  } catch {
    // Supabase unavailable — fall through to env var
  }

  return parseEnvSchedule();
});

// ---------------------------------------------------------------------------
// Pure computation helpers (all accept schedule as parameter)
// ---------------------------------------------------------------------------

export function computeCurrentPeriod(
  schedule: LocationPeriod[]
): LocationPeriod | null {
  const now = todayDate();
  return (
    schedule.find((p) => {
      const from = toDate(p.from);
      const to = toDate(p.to);
      return now >= from && now <= to;
    }) ?? null
  );
}

export function computeCurrentLocation(
  schedule: LocationPeriod[]
): { city: string; country: CountryCode } {
  const period = computeCurrentPeriod(schedule);
  return period ? { city: period.city, country: period.country } : HOME_LOCATION;
}

export function computeIsPortoAvailable(schedule: LocationPeriod[]): boolean {
  return computeCurrentLocation(schedule).country === "PT";
}

export function computeUpcomingPeriods(schedule: LocationPeriod[]): LocationPeriod[] {
  const now = todayDate();
  return schedule.filter((p) => toDate(p.from) > now);
}

export function computePastPeriods(schedule: LocationPeriod[]): LocationPeriod[] {
  const now = todayDate();
  return schedule.filter((p) => toDate(p.to) < now);
}

export function computeNextReturnToPorto(
  schedule: LocationPeriod[]
): Date | null {
  if (computeIsPortoAvailable(schedule)) return null;
  const nextPorto = computeUpcomingPeriods(schedule).find((p) => p.country === "PT");
  return nextPorto ? toDate(nextPorto.from) : null;
}

export function computeAwayPeriod(
  schedule: LocationPeriod[]
): LocationPeriod | null {
  const current = computeCurrentPeriod(schedule);
  if (current && current.country !== "PT") return current;
  return computeUpcomingPeriods(schedule).find((p) => p.country !== "PT") ?? null;
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateRange(from: string, to: string): string {
  const f = toDate(from);
  const t = toDate(to);
  const fromStr = f.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  const toStr = t.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${fromStr} – ${toStr}`;
}

// ---------------------------------------------------------------------------
// Legacy sync exports — kept for backward compat, use env var only
// ---------------------------------------------------------------------------

/** @deprecated Use getEffectiveSchedule() + compute* helpers */
export function getTravelSchedule(): LocationPeriod[] {
  return parseEnvSchedule().sort(
    (a, b) => toDate(a.from).getTime() - toDate(b.from).getTime()
  );
}

/** @deprecated */
export function getCurrentLocation() { return computeCurrentLocation(getTravelSchedule()); }
/** @deprecated */
export function isPortoAvailable() { return computeIsPortoAvailable(getTravelSchedule()); }
/** @deprecated */
export function nextReturnToPorto() { return computeNextReturnToPorto(getTravelSchedule()); }
/** @deprecated */
export function getAwayPeriod() { return computeAwayPeriod(getTravelSchedule()); }
/** @deprecated */
export function getCurrentPeriod() { return computeCurrentPeriod(getTravelSchedule()); }
/** @deprecated */
export function getUpcomingPeriods() { return computeUpcomingPeriods(getTravelSchedule()); }
/** @deprecated */
export function getPastPeriods() { return computePastPeriods(getTravelSchedule()); }
