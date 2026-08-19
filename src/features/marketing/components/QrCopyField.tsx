"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/cn";

interface QrCopyFieldProps {
  url: string;
}

export default function QrCopyField({ url }: QrCopyFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function handleCopy() {
    inputRef.current?.select();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      return;
    } catch {
      /* fall through to execCommand */
    }
    try {
      if (document.execCommand("copy")) setCopied(true);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={inputId}
        className="font-mono text-xs text-brand-black/40 uppercase tracking-[0.12em]"
      >
        Links to
      </label>
      <div className="flex border-2 border-brand-black bg-brand-linen">
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          readOnly
          value={url}
          onFocus={(event) => event.currentTarget.select()}
          spellCheck={false}
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-3 py-2 font-body text-xs text-brand-black outline-none"
        />
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy link"}
          className={cn(
            "group relative inline-flex w-10 shrink-0 items-center justify-center",
            "border-l-2 border-brand-black text-brand-black",
            "transition-colors hover:bg-brand-tangerine hover:text-brand-linen",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-tangerine",
          )}
        >
          {copied ? <Check size={18} aria-hidden /> : <Copy size={18} aria-hidden />}
          <span
            className={cn(
              "pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2",
              "whitespace-nowrap border-2 border-brand-black bg-brand-black px-2 py-1",
              "font-mono text-[10px] uppercase tracking-[0.12em] text-brand-linen",
              "opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
              copied && "opacity-100",
            )}
            aria-hidden
          >
            {copied ? "Copied" : "Copy"}
          </span>
        </button>
      </div>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </div>
  );
}
