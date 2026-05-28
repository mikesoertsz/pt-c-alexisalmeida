import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & { className?: string };

export function SubHeading({ className, children, ...props }: HeadingProps) {
  return (
    <h3
      className={cn(
        "font-display text-3xl md:text-4xl font-black uppercase text-brand-black leading-[0.9] tracking-tighter",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}
