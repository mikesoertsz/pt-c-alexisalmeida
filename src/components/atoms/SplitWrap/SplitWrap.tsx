import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type DivProps = HTMLAttributes<HTMLDivElement> & { className?: string };

export function SplitWrap({ className, children, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start px-4 md:px-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
