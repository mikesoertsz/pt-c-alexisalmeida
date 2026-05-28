"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  LOCALES,
  LOCALE_SHORT,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  stripLocalePrefixFromPath,
  type Locale,
  localizedPath,
} from "@/lib/locale";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

interface LanguageSwitcherProps {
  currentLocale: Locale;
  className?: string;
}

export function LanguageSwitcher({ currentLocale, className }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const fullWidth = Boolean(className?.match(/\bw-full\b/));

  const switchLocale = useCallback(
    (next: Locale) => {
      if (next === currentLocale) {
        setOpen(false);
        return;
      }

      const strippedBase = stripLocalePrefixFromPath(pathname);
      const stripped = strippedBase === "" ? "/" : strippedBase;

      document.cookie = `${LOCALE_COOKIE}=${next};max-age=${LOCALE_COOKIE_MAX_AGE};path=/;samesite=lax`;

      const url = localizedPath(next, stripped);
      trackEvent("language_switch", { event_label: next });
      router.push(url);
      setOpen(false);
    },
    [currentLocale, pathname, router]
  );

  useEffect(() => {
    function onPointerDown(ev: MouseEvent | TouchEvent) {
      if (!rootRef.current?.contains(ev.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(ev: KeyboardEvent) {
      if (ev.key === "Escape") {
        ev.preventDefault();
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative shrink-0", className)}>
      <button
        type="button"
        id={`${listId}-trigger`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${listId}-listbox`}
        aria-label={`Language: ${LOCALE_SHORT[currentLocale]}`}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex h-9 min-w-[3.25rem] items-center justify-center gap-0.5 border border-border bg-brand-cotton px-2",
          "font-mono text-[0.68rem] font-medium uppercase tracking-widest text-brand-black",
          "transition-colors hover:text-brand-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-tangerine motion-reduce:transition-none",
          fullWidth && "w-full min-w-0 justify-between px-3"
        )}
      >
        <span>{LOCALE_SHORT[currentLocale]}</span>
        <ChevronDown
          className={cn("h-3 w-3 shrink-0 text-brand-black/60 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          id={`${listId}-listbox`}
          role="listbox"
          aria-labelledby={`${listId}-trigger`}
          className={cn(
            "absolute right-0 top-full z-50 mt-1 min-w-full overflow-hidden border border-border bg-brand-cotton py-0.5 shadow-sm",
            fullWidth && "left-0 right-0"
          )}
        >
          {LOCALES.map((locale) => (
            <li key={locale} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={currentLocale === locale}
                onClick={() => switchLocale(locale)}
                className={cn(
                  "flex w-full min-h-8 items-center justify-center px-2 py-1.5 font-mono text-[0.68rem] font-medium uppercase tracking-widest transition-colors",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-tangerine/50 motion-reduce:transition-none",
                  currentLocale === locale
                    ? "bg-brand-tangerine text-brand-black"
                    : "text-brand-muted hover:bg-brand-linen/60 hover:text-brand-black"
                )}
              >
                {LOCALE_SHORT[locale]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
