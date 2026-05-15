import type { ReactNode } from "react";
import { Title, Heading, SubHeading, SmallHeading, PreTitle, SubTitle, Body } from "@/app/components/atoms";

export type TitleBlockHeadingLevel = "h1" | "h2" | "h3" | "h4";

interface TitleBlockProps {
  icon?: ReactNode;
  preheading?: string;
  heading?: string | ReactNode;
  subheading?: string | ReactNode;
  body?: string | ReactNode;
  theme?: "light" | "dark";
  orientation?: "center" | "left";
  isHero?: boolean;
  headingLevel?: TitleBlockHeadingLevel;
  className?: string;
}

const HEADING_COMPONENTS = {
  h1: Title,
  h2: Heading,
  h3: SubHeading,
  h4: SmallHeading,
} as const;

function cn(...parts: (string | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function TitleBlock({
  preheading,
  heading,
  subheading,
  body,
  theme = "light",
  orientation = "center",
  isHero = false,
  headingLevel = "h2",
  className,
}: TitleBlockProps) {
  const resolvedLevel: TitleBlockHeadingLevel = isHero ? "h1" : headingLevel;
  const HeadingComponent = HEADING_COMPONENTS[resolvedLevel];

  const containerClass = cn(
    "flex w-full max-w-3xl gap-4 antialiased",
    orientation === "center"
      ? "mx-auto flex-col items-center justify-center text-center"
      : "flex-col items-start justify-start text-left",
    theme === "dark" ? "text-brand-dusty-white" : "text-ink",
    className,
  );

  return (
    <div className={containerClass}>
      {preheading && (
        isHero ? (
          <span className="inline-flex items-center gap-2 text-[0.68rem] font-sans font-medium uppercase tracking-[0.26em] text-brand-dusty-white/60 mb-1">
            <span className="inline-block w-6 h-px bg-brand-dusty-white/40" aria-hidden />
            {preheading}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 mb-1">
            <span
              className={cn(
                "inline-block w-6 h-px",
                theme === "dark" ? "bg-brand-dusty-white/35" : "bg-accent/60"
              )}
              aria-hidden
            />
            <PreTitle
              className={theme === "dark" ? "text-brand-dusty-white/55" : undefined}
            >
              {preheading}
            </PreTitle>
          </span>
        )
      )}

      {heading != null && heading !== "" && (
        <HeadingComponent
          className={theme === "dark" ? "text-brand-dusty-white" : undefined}
        >
          {heading}
        </HeadingComponent>
      )}

      {subheading && (
        <SubTitle
          className={cn(
            "mt-1",
            theme === "dark" ? "text-brand-dusty-white/65" : "text-ink/75",
          )}
        >
          {subheading}
        </SubTitle>
      )}

      {body &&
        (typeof body === "string" ? (
          <Body
            className={cn(
              "mt-1",
              theme === "dark" ? "text-brand-dusty-white/60" : undefined,
            )}
          >
            {body}
          </Body>
        ) : (
          <div
            className={cn(
              "max-w-xl text-sm leading-[1.75] mt-1 font-sans",
              theme === "dark" ? "text-brand-dusty-white/60" : "text-ink/80",
            )}
          >
            {body}
          </div>
        ))}
    </div>
  );
}
