import type { ContentSchema } from "@/content/schema";

interface AboutArtistProps {
  slice: ContentSchema["about"];
}

export function AboutArtist({ slice }: AboutArtistProps) {
  return (
    <section id="about" className="w-full bg-brand-linen border-t-2 border-brand-black py-20 md:py-28 px-6 md:px-12 scroll-mt-16">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-20">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <span className="font-mono text-xs text-brand-muted uppercase tracking-[0.12em]">
            [ {slice.preheading} ]
          </span>

          <div className="flex items-end gap-4">
            <span className="font-display font-black text-brand-black leading-[0.9] tracking-tighter text-8xl md:text-9xl">
              {slice.yearsNumber}
            </span>
            <span className="font-mono text-xs text-brand-muted uppercase tracking-[0.12em] mb-3">
              {slice.yearsLabel}
            </span>
          </div>

          <div className="flex flex-col gap-5">
            {slice.bio.map((paragraph, i) => (
              <p key={i} className="font-body text-base text-brand-black/70 leading-relaxed max-w-prose">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-0 border-t-2 border-brand-black lg:border-t-0 lg:border-l-2 lg:border-brand-black pt-8 lg:pt-0 lg:pl-10">
          <span className="font-mono text-xs text-brand-muted uppercase tracking-[0.12em] mb-6">
            [ Craft ]
          </span>
          <ul className="flex flex-col">
            {slice.facts.map((fact, i) => (
              <li
                key={i}
                className="font-body text-sm text-brand-black py-3 border-b border-border tracking-wide"
              >
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
