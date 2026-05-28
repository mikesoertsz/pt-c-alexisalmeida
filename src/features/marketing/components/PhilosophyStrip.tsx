import type { ContentSchema } from "@/content/schema";
import { AnimateIn } from "@/components/atoms/AnimateIn/AnimateIn";

interface PhilosophyStripProps {
  slice: ContentSchema["philosophyStrip"];
}

export function PhilosophyStrip({ slice }: PhilosophyStripProps) {
  return (
    <section className="w-full bg-brand-cotton border-t-2 border-brand-black py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-[1440px] mx-auto flex items-center justify-center">
        <AnimateIn>
          <blockquote className="font-display font-black uppercase text-brand-black text-2xl md:text-4xl lg:text-5xl text-center leading-[0.95] tracking-tighter max-w-3xl">
            &ldquo;{slice.quote}&rdquo;
          </blockquote>
        </AnimateIn>
      </div>
    </section>
  );
}
