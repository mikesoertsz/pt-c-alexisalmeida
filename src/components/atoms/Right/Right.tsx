import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type DivProps = HTMLAttributes<HTMLDivElement> & { className?: string };

export function Right({ className, children, ...props }: DivProps) {
  return (
    <div className={cn("flex flex-col", className)} {...props}>
      {children}
    </div>
  );
}
