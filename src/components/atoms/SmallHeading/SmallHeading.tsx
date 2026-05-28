import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & { className?: string };

export function SmallHeading({ className, children, ...props }: HeadingProps) {
  return (
    <h4
      className={cn(
        "font-mono text-xs font-medium text-brand-black uppercase tracking-[0.12em]",
        className
      )}
      {...props}
    >
      {children}
    </h4>
  );
}
