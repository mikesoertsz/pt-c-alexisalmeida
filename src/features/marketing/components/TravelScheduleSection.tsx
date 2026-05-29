import Link from "next/link";
import type { Locale } from "@/lib/locale";
import { localizedHomeAnchor } from "@/lib/locale";
import {
  getEffectiveSchedule,
  computeCurrentPeriod,
  computeUpcomingPeriods,
  computePastPeriods,
  formatDateRange,
  countryFlag,
  COUNTRY_NAMES,
  type LocationPeriod,
} from "@/lib/travel";

function periodStatus(
  period: LocationPeriod,
  current: LocationPeriod | null,
  today: Date
): "current" | "upcoming" | "past" {
  const from = new Date(`${period.from}T00:00:00`);
  const to = new Date(`${period.to}T00:00:00`);
  if (current?.from === period.from && current?.to === period.to) return "current";
  if (from > today) return "upcoming";
  if (to < today) return "past";
  return "current";
}

/**
 * Full travel schedule section — horizontal card grid.
 * Current period: tangerine. Upcoming: white. Past: gray.
 * Hidden entirely when no schedule is configured.
 */
interface TravelScheduleSectionProps {
  locale: Locale;
}

export async function TravelScheduleSection({ locale }: TravelScheduleSectionProps) {
  const schedule = await getEffectiveSchedule();
  if (schedule.length === 0) return null;

  const current = computeCurrentPeriod(schedule);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return (
    <section data-nav-tone="light" className="w-full bg-brand-linen border-t-2 border-brand-black py-20 md:py-28 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1440px] mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 border-b-2 border-brand-black pb-8">
          <div>
            <p className="font-mono text-xs text-brand-muted uppercase tracking-[0.12em] mb-4">
              [ Availability by location ]
            </p>
            <h2 className="font-display font-black uppercase text-brand-black text-3xl md:text-4xl leading-[0.9] tracking-tighter">
              Where to Book
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <p className="font-body text-sm text-brand-black/60 max-w-xs leading-relaxed">
              Lex works between Porto and Germany. Check the schedule before booking.
            </p>
            <Link
              href={localizedHomeAnchor(locale, "booking")}
              className="font-mono text-xs text-brand-tangerine uppercase tracking-[0.12em] hover:underline"
            >
              Go to booking &rarr;
            </Link>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 border-l-2 border-t-2 border-brand-black">
          {schedule.map((period, i) => {
            const status = periodStatus(period, current, today);
            const isCurrent = status === "current";
            const isPast = status === "past";

            return (
              <div
                key={`${period.from}-${i}`}
                className={[
                  "border-r-2 border-b-2 border-brand-black p-6 flex flex-col gap-4",
                  isCurrent ? "bg-brand-tangerine" : "",
                  isPast ? "bg-brand-black/5" : "",
                  !isCurrent && !isPast ? "bg-white" : "",
                ].join(" ")}
              >
                <span className={[
                  "font-mono text-xs uppercase tracking-[0.12em]",
                  isCurrent ? "text-white/80" : isPast ? "text-brand-black/30" : "text-brand-black/50",
                ].join(" ")}>
                  {isCurrent ? "[ Now ]" : isPast ? "[ Past ]" : "[ Upcoming ]"}
                </span>

                <div className="flex items-start gap-2">
                  <span className={[
                    "font-display font-black uppercase leading-[0.9] tracking-tighter text-2xl md:text-3xl",
                    isCurrent ? "text-white" : isPast ? "text-brand-black/30" : "text-brand-black",
                  ].join(" ")}>
                    {period.city}
                  </span>
                  <span className="text-lg leading-none mt-0.5" aria-hidden>
                    {countryFlag(period.country)}
                  </span>
                </div>

                <p className={[
                  "font-mono text-xs uppercase tracking-[0.10em]",
                  isCurrent ? "text-white/70" : isPast ? "text-brand-black/25" : "text-brand-black/50",
                ].join(" ")}>
                  {COUNTRY_NAMES[period.country] ?? period.country}
                </p>

                <div className={[
                  "border-t pt-4 mt-auto",
                  isCurrent ? "border-white/30" : "border-brand-black/20",
                ].join(" ")}>
                  <p className={[
                    "font-mono text-xs uppercase tracking-[0.10em]",
                    isCurrent ? "text-white/80" : isPast ? "text-brand-black/30" : "text-brand-black/60",
                  ].join(" ")}>
                    {formatDateRange(period.from, period.to)}
                  </p>
                  {period.note && (
                    <p className={[
                      "font-body text-xs mt-2 leading-relaxed",
                      isCurrent ? "text-white/70" : isPast ? "text-brand-black/25" : "text-brand-black/50",
                    ].join(" ")}>
                      {period.note}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="font-mono text-xs text-brand-muted uppercase tracking-[0.12em] mt-6">
          [ Contact via WhatsApp for real-time availability ]
        </p>
      </div>
    </section>
  );
}
