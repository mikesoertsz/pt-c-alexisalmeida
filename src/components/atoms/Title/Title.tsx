import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & { className?: string };

export function Title({ className, children, ...props }: HeadingProps) {
  return (
    <h1
      className={cn(
        "font-display text-7xl md:text-9xl font-black uppercase text-brand-black leading-[0.9] tracking-tighter",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}
