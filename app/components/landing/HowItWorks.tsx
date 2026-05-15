import { Wrapper, InnerWrap } from "@/app/components/atoms";
import { TitleBlock } from "@/app/components/TitleBlock";
import type { ContentSchema } from "@/app/content";

interface Props {
  slice: ContentSchema["howItWorks"];
}

export function HowItWorks({ slice }: Props) {
  return (
    <Wrapper id="how-it-works" className="bg-surface-muted/30 scroll-mt-16 py-28 md:py-32">
      <InnerWrap className="items-start px-4 md:px-8">
        <TitleBlock
          orientation="left"
          preheading={slice.preheading}
          heading={slice.heading}
        />

        <ol className="relative mt-14 md:mt-16 w-full max-w-3xl list-none border-l border-border/40 pl-8 md:pl-12 ml-2">
          {slice.steps.map((step) => (
            <li key={step.number} className="relative pb-14 last:pb-0">
              <span
                className="absolute top-[0.4rem] left-[-5px] size-2.5 bg-accent"
                aria-hidden
              />
              <span className="sr-only">{`Step ${step.number}`}</span>
              <p className="font-mono text-[0.62rem] text-accent/75 mb-2 tabular-nums uppercase tracking-[0.2em]">{step.number}</p>
              <h3 className="font-sans text-xl font-light text-ink tracking-[-0.01em] leading-snug">
                {step.title}
              </h3>
              <p className="text-sm text-fg-muted mt-2.5 leading-[1.75] max-w-prose font-sans">{step.body}</p>
            </li>
          ))}
        </ol>
      </InnerWrap>
    </Wrapper>
  );
}
