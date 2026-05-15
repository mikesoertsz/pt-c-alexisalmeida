import type { HTMLAttributes, HTMLProps } from "react";

type DivProps = HTMLAttributes<HTMLDivElement> & { className?: string };
type SectionProps = HTMLAttributes<HTMLElement> & { id?: string; className?: string };
type HeadingProps = HTMLAttributes<HTMLHeadingElement> & { className?: string };
type ParaProps = HTMLAttributes<HTMLParagraphElement> & { className?: string };
type AnchorProps = HTMLProps<HTMLAnchorElement> & { className?: string };

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── Layout atoms ──────────────────────────────────────────────────────────────

export function Wrapper({ className, children, ...props }: SectionProps) {
  return (
    <section
      className={cn(
        "mx-auto w-full snap-always snap-center px-4 lg:px-0 relative z-20 py-24",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function InnerWrap({ className, children, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-[1440px] w-full flex items-center justify-center flex-col px-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function WrapperCentered({ className, children, ...props }: SectionProps) {
  return (
    <section
      className={cn(
        "mx-auto w-full py-12 md:py-16 lg:py-24 snap-always snap-center flex flex-col items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function InnerWrapCentered({ className, children, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-[1440px] w-full flex flex-col items-center justify-center px-4 md:px-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SplitWrap({ className, children, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-6xl px-6 md:px-0 w-full flex items-center justify-center gap-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Left({ className, children, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center w-full xl:w-1/2 min-h-full bg-brand-granite text-brand-dusty-white z-10 py-8 xl:p-12",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Right({ className, children, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center w-full xl:w-1/2 min-h-full z-10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function GreyBlock({ className, children, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full p-4 bg-surface-muted/60 border border-border/40",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function HeaderWrap({ className, children, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full bg-brand-granite text-brand-dusty-white z-10 text-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── Typography atoms ───────────────────────────────────────────────────────────

export function Title({ className, children, ...props }: HeadingProps) {
  return (
    <h1
      className={cn(
        "font-sans text-5xl tracking-tight font-light md:text-6xl lg:text-7xl text-ink leading-[1.05]",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function Heading({ className, children, ...props }: HeadingProps) {
  return (
    <h2
      className={cn(
        "font-sans text-4xl tracking-[-0.02em] font-light md:text-5xl text-ink leading-[1.1]",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function SubHeading({ className, children, ...props }: HeadingProps) {
  return (
    <h3
      className={cn(
        "font-sans text-2xl sm:text-3xl font-light tracking-[-0.01em] text-ink/80 max-w-lg leading-[1.2]",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function SmallHeading({ className, children, ...props }: HeadingProps) {
  return (
    <h4
      className={cn("text-sm font-medium mb-4 text-ink tracking-wide", className)}
      {...props}
    >
      {children}
    </h4>
  );
}

export function PreTitle({ className, children, ...props }: HeadingProps) {
  return (
    <span
      className={cn(
        "text-[0.68rem] font-sans font-medium uppercase tracking-[0.26em] text-accent",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function SubTitle({ className, children, ...props }: HeadingProps) {
  return (
    <p
      className={cn(
        "text-base leading-[1.75] max-w-xl text-ink/80 font-sans font-light",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function Body({ className, children, ...props }: ParaProps) {
  return (
    <p
      className={cn(
        "text-fg-muted max-w-xl text-sm leading-[1.75] font-sans",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function ButtonStyled({ className, children, ...props }: AnchorProps) {
  return (
    <a
      className={cn(
        "flex items-center justify-center bg-accent hover:bg-accent/90 text-on-accent font-sans font-medium text-xs uppercase tracking-[0.16em] py-3.5 px-8 mt-8 transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}
