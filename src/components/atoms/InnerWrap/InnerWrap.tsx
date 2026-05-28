import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type DivProps = HTMLAttributes<HTMLDivElement> & { className?: string };

export function InnerWrap({ className, children, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "max-w-[1440px] mx-auto w-full flex flex-col px-4 md:px-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
