import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & { className?: string };

export function Heading({ className, children, ...props }: HeadingProps) {
  return (
    <h2
      className={cn(
        "font-display text-5xl md:text-7xl font-black uppercase text-brand-black leading-[0.9] tracking-tighter",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}
