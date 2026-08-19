"use client";

import { FileText, ImageDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface QrCardActionsProps {
  pngHref: string;
  pdfHref: string;
}

const actionClass = cn(
  "group relative inline-flex size-10 items-center justify-center",
  "border-2 border-brand-black text-brand-black",
  "transition-colors hover:bg-brand-tangerine hover:border-brand-tangerine hover:text-brand-linen",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-tangerine focus-visible:ring-offset-2 focus-visible:ring-offset-white",
);

const tooltipClass = cn(
  "pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2",
  "whitespace-nowrap border-2 border-brand-black bg-brand-black px-2 py-1",
  "font-mono text-[10px] uppercase tracking-[0.12em] text-brand-linen",
  "opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
);

export default function QrCardActions({ pngHref, pdfHref }: QrCardActionsProps) {
  return (
    <div className="flex items-center gap-2 pt-3 border-t-2 border-brand-black">
      <a href={pngHref} download aria-label="Download PNG" className={actionClass}>
        <ImageDown size={18} aria-hidden />
        <span className={tooltipClass} aria-hidden>
          Download PNG
        </span>
      </a>
      <a href={pdfHref} download aria-label="Download print PDF" className={actionClass}>
        <FileText size={18} aria-hidden />
        <span className={tooltipClass} aria-hidden>
          Print PDF
        </span>
      </a>
    </div>
  );
}
