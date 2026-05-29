import Link from "next/link";
import {
  getEffectiveSchedule,
  computeCurrentLocation,
  computeIsPortoAvailable,
  computeNextReturnToPorto,
  formatDate,
  countryFlag,
  COUNTRY_NAMES,
} from "@/lib/travel";

/**
 * Compact status strip directly below the hero.
 * Left: where Lex is now. Right: availability status + scroll-to-booking link.
 */
export async function LocationBanner() {
  const schedule = await getEffectiveSchedule();
  const location = computeCurrentLocation(schedule);
  const portoOpen = computeIsPortoAvailable(schedule);
  const returnDate = computeNextReturnToPorto(schedule);

  return (
    <div data-nav-tone="dark" className="w-full bg-brand-black border-b-2 border-brand-black">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-white/20">

          {/* Left — where Lex is */}
          <div className="py-5 md:py-6 flex items-center gap-5 md:pr-10">
            <span className="font-mono text-xs text-white/40 uppercase tracking-[0.12em] shrink-0">
              [ Currently in ]
            </span>
            <div className="flex items-center gap-2">
              <span className="font-display font-black uppercase text-white text-sm tracking-tight leading-none">
                {location.city},&nbsp;{COUNTRY_NAMES[location.country] ?? location.country}
              </span>
              <span className="text-base leading-none" aria-hidden>
                {countryFlag(location.country)}
              </span>
            </div>
          </div>

          {/* Right — availability + booking link */}
          <div className="py-5 md:py-6 flex items-center justify-between gap-4 md:pl-10">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2 shrink-0">
                {portoOpen ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </>
                ) : (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-tangerine opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-tangerine" />
                  </>
                )}
              </span>
              <span className="font-mono text-xs text-white/70 uppercase tracking-[0.12em]">
                {portoOpen
                  ? "Accepting bookings in Porto"
                  : `Porto bookings paused${returnDate ? ` · Back ${formatDate(returnDate)}` : ""}`}
              </span>
            </div>

            {/* Scroll-to-booking CTA */}
            <Link
              href="#booking"
              className="font-mono text-xs text-brand-tangerine uppercase tracking-[0.12em] hover:text-white transition-colors shrink-0"
            >
              Book &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
