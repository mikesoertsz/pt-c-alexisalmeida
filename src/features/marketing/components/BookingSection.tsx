import type { ContentSchema } from "@/content/schema";
import type { Locale } from "@/lib/locale";
import { localizedPath } from "@/lib/locale";
import ButtonStyled from "@/components/atoms/ButtonStyled/ButtonStyled";
import { AnimateIn } from "@/components/atoms/AnimateIn/AnimateIn";
import {
  getEffectiveSchedule,
  computeIsPortoAvailable,
  computeAwayPeriod,
  computeNextReturnToPorto,
  formatDate,
  formatDateRange,
  countryFlag,
  COUNTRY_NAMES,
  HOME_LOCATION,
} from "@/lib/travel";

interface BookingSectionProps {
  slice: ContentSchema["bookingSection"];
  locale: Locale;
}

export async function BookingSection({ slice, locale }: BookingSectionProps) {
  const schedule = await getEffectiveSchedule();
  const portoOpen = computeIsPortoAvailable(schedule);
  const awayPeriod = computeAwayPeriod(schedule);
  const returnDate = computeNextReturnToPorto(schedule);
  const bookingHref = localizedPath(locale, "/booking");

  const showTwoCards = awayPeriod !== null;

  return (
    <section id="booking" data-nav-tone="light" className="w-full bg-brand-linen border-t-2 border-brand-black py-28 md:py-36 px-6 md:px-12 scroll-mt-16">
      <AnimateIn>
        <div className="max-w-[1440px] mx-auto flex flex-col items-center gap-12">

          {/* Heading */}
          <div className="text-center flex flex-col items-center gap-6">
            <h2 className="font-display font-black uppercase text-brand-black text-4xl md:text-6xl lg:text-7xl leading-[0.9] tracking-tighter">
              {slice.headline}
            </h2>
            <div className="w-16 h-0.5 bg-brand-black" />
          </div>

          {showTwoCards ? (
            /* Two-card layout: Porto + away city */
            <div className="w-full grid grid-cols-1 md:grid-cols-2 border-2 border-brand-black">

              {/* Porto */}
              <div className={[
                "flex flex-col gap-6 p-8 md:p-10 border-b-2 md:border-b-0 md:border-r-2 border-brand-black",
                portoOpen ? "bg-white" : "bg-brand-black/5",
              ].join(" ")}>
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2 shrink-0">
                    {portoOpen ? (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                      </>
                    ) : (
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-black/20" />
                    )}
                  </span>
                  <span className={[
                    "font-mono text-xs uppercase tracking-[0.12em]",
                    portoOpen ? "text-brand-black/60" : "text-brand-black/30",
                  ].join(" ")}>
                    {portoOpen ? "Available now" : returnDate ? `Available from ${formatDate(returnDate)}` : "Bookings paused"}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={[
                      "font-display font-black uppercase leading-[0.9] tracking-tighter text-4xl md:text-5xl",
                      portoOpen ? "text-brand-black" : "text-brand-black/30",
                    ].join(" ")}>
                      {HOME_LOCATION.city}
                    </h3>
                    <span className="text-xl leading-none" aria-hidden>
                      {countryFlag(HOME_LOCATION.country)}
                    </span>
                  </div>
                  <p className={[
                    "font-mono text-xs uppercase tracking-[0.10em]",
                    portoOpen ? "text-brand-black/50" : "text-brand-black/25",
                  ].join(" ")}>
                    {COUNTRY_NAMES[HOME_LOCATION.country]}
                  </p>
                </div>

                <div className="mt-auto pt-2">
                  <ButtonStyled
                    href={bookingHref}
                    className={!portoOpen ? "border-brand-black/20 text-brand-black/30 pointer-events-none" : ""}
                  >
                    Book in {HOME_LOCATION.city}
                  </ButtonStyled>
                  {!portoOpen && returnDate && (
                    <p className="font-mono text-xs text-brand-black/30 uppercase tracking-[0.10em] mt-3">
                      [ Opens {formatDate(returnDate)} ]
                    </p>
                  )}
                </div>
              </div>

              {/* Away city */}
              <div className={[
                "flex flex-col gap-6 p-8 md:p-10",
                !portoOpen ? "bg-brand-tangerine" : "bg-white",
              ].join(" ")}>
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2 shrink-0">
                    {!portoOpen ? (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                      </>
                    ) : (
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-black/20" />
                    )}
                  </span>
                  <span className={[
                    "font-mono text-xs uppercase tracking-[0.12em]",
                    !portoOpen ? "text-white/80" : "text-brand-black/40",
                  ].join(" ")}>
                    {!portoOpen ? "Available now" : `Available ${formatDateRange(awayPeriod.from, awayPeriod.to)}`}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={[
                      "font-display font-black uppercase leading-[0.9] tracking-tighter text-4xl md:text-5xl",
                      !portoOpen ? "text-white" : "text-brand-black",
                    ].join(" ")}>
                      {awayPeriod.city}
                    </h3>
                    <span className="text-xl leading-none" aria-hidden>
                      {countryFlag(awayPeriod.country)}
                    </span>
                  </div>
                  <p className={[
                    "font-mono text-xs uppercase tracking-[0.10em]",
                    !portoOpen ? "text-white/70" : "text-brand-black/40",
                  ].join(" ")}>
                    {COUNTRY_NAMES[awayPeriod.country] ?? awayPeriod.country}
                  </p>
                  {awayPeriod.note && (
                    <p className={[
                      "font-body text-xs mt-3 leading-relaxed",
                      !portoOpen ? "text-white/70" : "text-brand-black/40",
                    ].join(" ")}>
                      {awayPeriod.note}
                    </p>
                  )}
                </div>

                <div className="mt-auto pt-2">
                  <ButtonStyled
                    href={bookingHref}
                    className={!portoOpen
                      ? "border-white text-white hover:bg-white hover:text-brand-black hover:border-white"
                      : ""}
                  >
                    Book in {awayPeriod.city}
                  </ButtonStyled>
                  {portoOpen && (
                    <p className="font-mono text-xs text-brand-black/30 uppercase tracking-[0.10em] mt-3">
                      [ {formatDateRange(awayPeriod.from, awayPeriod.to)} ]
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Single CTA — no travel schedule configured */
            <ButtonStyled href={bookingHref} className="px-10 py-5">
              {slice.cta}
            </ButtonStyled>
          )}

          <p className="font-mono text-xs text-brand-muted uppercase tracking-[0.12em] text-center">
            [ {slice.note} ]
          </p>
        </div>
      </AnimateIn>
    </section>
  );
}
