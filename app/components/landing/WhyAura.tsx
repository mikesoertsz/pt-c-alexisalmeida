import { Wrapper, InnerWrap, PreTitle } from "@/app/components/atoms";
import { TitleBlock } from "@/app/components/TitleBlock";
import type { ContentSchema } from "@/app/content";
import {
  Coffee,
  Heart,
  Music,
  Sparkles,
  Wifi,
  type LucideIcon,
} from "lucide-react";

type ComfortIconKey = ContentSchema["whyUs"]["comforts"][number]["icon"];

const ICON_MAP: Record<ComfortIconKey, LucideIcon> = {
  tea: Sparkles,
  wifi: Wifi,
  spa: Sparkles,
  coffee: Coffee,
  music: Music,
  heart: Heart,
};

interface Props {
  slice: ContentSchema["whyUs"];
}

export function WhyAura({ slice }: Props) {
  return (
    <Wrapper id="why-aura" className="bg-surface scroll-mt-16 py-28 md:py-36">
      <InnerWrap className="items-stretch px-4 md:px-6 max-w-5xl">
        <TitleBlock
          orientation="left"
          preheading={slice.preheading}
          heading={slice.heading}
          subheading={slice.subheading}
        />

        <div className="mt-14 md:mt-20 w-full border-t border-border/30">
          {slice.items.map((point) => (
            <div
              key={point.number}
              className="relative grid gap-4 py-12 md:py-14 md:grid-cols-[auto_1fr] md:gap-12 md:items-start border-b border-border/25 overflow-hidden"
            >
              <span
                className="absolute right-0 top-1/2 -translate-y-1/2 font-sans text-[8rem] md:text-[10rem] leading-none text-fg/4 tabular-nums select-none pointer-events-none"
                aria-hidden
              >
                {point.number}
              </span>
              <span className="font-mono text-[0.65rem] tracking-[0.22em] text-accent/70 uppercase pt-1 w-6 shrink-0 tabular-nums">
                {point.number}
              </span>
              <div className="relative">
                <h3 className="font-sans text-xl md:text-2xl font-light text-ink tracking-[-0.01em] leading-snug">
                  {point.title}
                </h3>
                <p className="text-sm text-fg-muted mt-3 leading-[1.75] max-w-prose font-sans">{point.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 md:mt-24 w-full">
          <PreTitle className="text-fg-muted mb-6 tracking-[0.22em]">
            {slice.comfortsPreheading}
          </PreTitle>
          <div className="md:hidden -mx-4 px-4 flex gap-8 overflow-x-auto pb-2 snap-x snap-mandatory scroll-pl-4 [scrollbar-width:thin]">
            {slice.comforts.map((item, idx) => {
              const Icon = ICON_MAP[item.icon];
              return (
                <div
                  key={`${item.icon}-${idx}`}
                  className="flex shrink-0 w-[min(85vw,18rem)] snap-start gap-3"
                >
                  <Icon className="w-4 h-4 text-accent/55 mt-0.5 shrink-0" aria-hidden />
                  <div>
                    <p className="text-sm font-medium text-ink font-sans">{item.title}</p>
                    <p className="text-xs text-fg-muted leading-[1.7] mt-0.5 font-sans">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="hidden md:grid md:grid-cols-3 gap-x-10 gap-y-7">
            {slice.comforts.map((item, idx) => {
              const Icon = ICON_MAP[item.icon];
              return (
                <div key={`${item.icon}-${idx}`} className="flex gap-3">
                  <Icon className="w-4 h-4 text-accent/55 mt-0.5 shrink-0" aria-hidden />
                  <div>
                    <p className="text-sm font-medium text-ink font-sans">{item.title}</p>
                    <p className="text-xs text-fg-muted leading-[1.7] mt-0.5 font-sans">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </InnerWrap>
    </Wrapper>
  );
}
