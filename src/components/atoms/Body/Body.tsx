import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ParaProps = HTMLAttributes<HTMLParagraphElement> & { className?: string };

export function Body({ className, children, ...props }: ParaProps) {
  return (
    <p
      className={cn(
        "text-base text-brand-black/70 font-body leading-relaxed",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
