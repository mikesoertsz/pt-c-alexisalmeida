import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & { className?: string };

export function SubTitle({ className, children, ...props }: HeadingProps) {
  return (
    <p
      className={cn(
        "text-lg text-brand-black/70 font-body leading-relaxed",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
