import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type SectionProps = HTMLAttributes<HTMLElement> & { id?: string; className?: string };

export function WrapperCentered({ className, children, ...props }: SectionProps) {
  return (
    <section
      className={cn(
        "w-full py-24 px-4 bg-brand-linen border-t border-border flex flex-col items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
