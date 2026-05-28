import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Title } from "@/components/atoms/Title/Title";
import { Heading } from "@/components/atoms/Heading/Heading";
import { SubHeading } from "@/components/atoms/SubHeading/SubHeading";
import { SmallHeading } from "@/components/atoms/SmallHeading/SmallHeading";
import { PreTitle } from "@/components/atoms/PreTitle/PreTitle";
import { SubTitle } from "@/components/atoms/SubTitle/SubTitle";
import { Body } from "@/components/atoms/Body/Body";

export type TitleBlockHeadingLevel = "h1" | "h2" | "h3" | "h4";

interface TitleBlockProps {
  icon?: ReactNode;
  preheading?: string;
  heading?: string | ReactNode;
  subheading?: string | ReactNode;
  body?: string | ReactNode;
  /** Default is "light", Swiss Industrial Print substrate. */
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
    className,
  );

  return (
    <div className={containerClass}>
      {preheading && (
        <PreTitle className={theme === "light" ? "text-brand-muted" : undefined}>
          {preheading}
        </PreTitle>
      )}

      {heading != null && heading !== "" && (
        <HeadingComponent>
          {heading}
        </HeadingComponent>
      )}

      {subheading && (
        <SubTitle className="mt-1">
          {subheading}
        </SubTitle>
      )}

      {body &&
        (typeof body === "string" ? (
          <Body className="mt-1">
            {body}
          </Body>
        ) : (
          <div className="max-w-xl text-sm leading-relaxed mt-1 font-body text-brand-muted">
            {body}
          </div>
        ))}
    </div>
  );
}
