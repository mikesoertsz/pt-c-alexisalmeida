import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "ghost";

type ButtonStyledProps = ComponentPropsWithoutRef<"a"> & {
  className?: string;
  variant?: ButtonVariant;
  href: string;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "inline-flex items-center justify-center border-2 border-brand-black text-brand-black font-body text-xs uppercase tracking-[0.12em] px-8 py-4 transition-colors hover:bg-brand-tangerine hover:border-brand-tangerine hover:text-brand-linen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-tangerine focus-visible:ring-offset-2 focus-visible:ring-offset-brand-linen",
  ghost:
    "inline-flex items-center justify-center font-body text-xs uppercase tracking-[0.12em] text-brand-black underline underline-offset-4 decoration-brand-black/40 hover:decoration-brand-tangerine hover:text-brand-tangerine focus-visible:outline-none",
};

export default function ButtonStyled({
  className,
  children,
  variant = "primary",
  href,
  ...props
}: ButtonStyledProps) {
  return (
    <Link href={href} className={cn(variantClasses[variant], className)} {...props}>
      {children}
    </Link>
  );
}
