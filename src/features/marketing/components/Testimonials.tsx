import type { ContentSchema } from "@/content/schema";
import { AnimateIn, StaggerIn, StaggerItem } from "@/components/atoms/AnimateIn/AnimateIn";

interface TestimonialsProps {
  slice: ContentSchema["testimonials"];
}

export function Testimonials({ slice: testimonials }: TestimonialsProps) {
  const items = testimonials.items as readonly { quote: string; author: string; location: string }[];
  const [featured, ...rest] = items;

  return (
    <section data-nav-tone="light" className="w-full bg-brand-cotton border-t-2 border-brand-black py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-[1440px] mx-auto">

        <AnimateIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-20 pb-12 border-b-2 border-brand-black">
            <div>
              <span className="font-mono text-xs text-brand-muted uppercase tracking-[0.12em] block mb-4">
                [ {testimonials.preheading} ]
              </span>
              <h2 className="font-display font-black uppercase text-brand-black text-4xl md:text-5xl lg:text-6xl leading-[0.9] tracking-tighter">
                {testimonials.heading}
              </h2>
            </div>

            <div className="flex items-end gap-5 shrink-0">
              <span className="font-display font-black text-brand-black text-8xl md:text-9xl leading-[0.9] tabular-nums tracking-tighter">
                5.0
              </span>
              <div className="flex flex-col gap-1.5 pb-3">
                <span className="font-mono text-xs text-brand-tangerine uppercase tracking-[0.12em]">
                  Google
                </span>
                <span className="font-mono text-xs text-brand-muted">
                  12 reviews
                </span>
              </div>
            </div>
          </div>
        </AnimateIn>

        {featured && (
          <AnimateIn>
            <div className="mb-16 md:mb-20">
              <div
                className="font-display text-brand-tangerine text-[8rem] md:text-[11rem] leading-none select-none -mb-6 md:-mb-8"
                aria-hidden="true"
              >
                &ldquo;
              </div>
              <blockquote className="font-display font-black uppercase text-brand-black text-2xl md:text-3xl lg:text-4xl leading-[0.95] tracking-tighter max-w-4xl mb-8">
                {featured.quote}
              </blockquote>
              <div className="flex items-center gap-3">
                <span className="font-body text-sm text-brand-black font-medium">
                  {featured.author}
                </span>
                <span className="text-brand-tangerine text-xs" aria-hidden>
                  &middot;
                </span>
                <span className="font-mono text-xs text-brand-muted">
                  {featured.location}
                </span>
              </div>
            </div>
          </AnimateIn>
        )}

        {rest.length > 0 && (
          <StaggerIn className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 pt-12 border-t-2 border-brand-black">
            {rest.map((item) => (
              <StaggerItem key={item.author}>
                <div className="flex flex-col gap-4">
                  <div
                    className="font-display text-brand-tangerine/70 text-5xl leading-none select-none"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </div>
                  <blockquote className="font-body text-brand-black/80 text-lg md:text-xl leading-relaxed flex-1">
                    {item.quote}
                  </blockquote>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-body text-sm text-brand-black font-medium">
                      {item.author}
                    </span>
                    <span className="text-brand-tangerine/50 text-xs" aria-hidden>
                      &middot;
                    </span>
                    <span className="font-mono text-xs text-brand-muted">
                      {item.location}
                    </span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerIn>
        )}
      </div>
    </section>
  );
}
