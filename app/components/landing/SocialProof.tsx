import type { ContentSchema } from "@/app/content";

interface Props {
  stats: ContentSchema["socialProof"]["stats"];
}

export function SocialProof({ stats }: Props) {
  return (
    <div className="w-full border-y border-border/30 bg-surface-muted/40 py-9 px-4">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-wrap justify-center items-stretch gap-0 divide-x divide-border/25">
          {stats.map((stat) => (
            <div key={stat.value} className="text-center px-10 md:px-14 lg:px-16 py-2 first:pl-0 last:pr-0">
              <p className="font-mono text-3xl md:text-4xl font-light text-ink tabular-nums tracking-[-0.02em]">
                {stat.value}
              </p>
              <p className="text-[0.6rem] md:text-[0.65rem] text-fg-muted mt-2 uppercase tracking-[0.22em] leading-snug max-w-40 mx-auto font-sans">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
