import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & { className?: string };

export function PreTitle({ className, children, ...props }: HeadingProps) {
  return (
    <span
      className={cn(
        "font-mono text-xs text-brand-muted uppercase tracking-[0.12em]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
