import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type SectionProps = HTMLAttributes<HTMLElement> & { id?: string; className?: string };

export function Wrapper({ className, children, ...props }: SectionProps) {
  return (
    <section
      className={cn("w-full py-20 px-4 bg-brand-linen border-t border-border", className)}
      {...props}
    >
      {children}
    </section>
  );
}
