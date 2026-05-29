import type { ContentSchema } from "@/content/schema";
import { AnimateIn, StaggerIn, StaggerItem } from "@/components/atoms/AnimateIn/AnimateIn";

interface ProcessProps {
  slice: ContentSchema["process"];
}

export function Process({ slice }: ProcessProps) {
  return (
    <section data-nav-tone="light" className="w-full bg-brand-cotton border-t-2 border-brand-black py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        <AnimateIn>
          <h2 className="font-display font-black uppercase text-brand-black text-4xl md:text-5xl lg:text-6xl leading-[0.9] tracking-tighter mb-16 md:mb-20">
            {slice.heading}
          </h2>
        </AnimateIn>

        <StaggerIn className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {slice.steps.map((step) => (
            <StaggerItem key={step.number}>
              <div className="flex flex-col gap-4 border-t-2 border-brand-black pt-6">
                <span
                  className="font-mono text-brand-tangerine text-5xl leading-none select-none"
                  aria-hidden="true"
                >
                  {step.number}
                </span>
                <h3 className="font-body text-xs uppercase tracking-[0.12em] text-brand-black font-semibold">
                  {step.title}
                </h3>
                <p className="font-body text-base text-brand-black/70 leading-relaxed">
                  {step.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerIn>
      </div>
    </section>
  );
}
