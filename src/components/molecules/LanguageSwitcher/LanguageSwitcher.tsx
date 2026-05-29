"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  LOCALES,
  LOCALE_SHORT,
  LOCALE_LABELS,
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
  variant?: "default" | "nav";
  inverse?: boolean;
}

export function LanguageSwitcher({
  currentLocale,
  className,
  variant = "default",
  inverse = false,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const fullWidth = Boolean(className?.match(/\bw-full\b/));
  const isNav = variant === "nav";

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
    [currentLocale, pathname, router],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(ev: KeyboardEvent) {
      if (ev.key === "Escape") {
        ev.preventDefault();
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      triggerRef.current?.focus();
      return;
    }
    const firstOption = dialogRef.current?.querySelector<HTMLButtonElement>(
      'button[data-locale-option]:not([disabled])',
    );
    firstOption?.focus();
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        aria-label={`Language: ${LOCALE_SHORT[currentLocale]}`}
        onClick={() => setOpen(true)}
        className={cn(
          "relative inline-flex h-9 min-w-[3.25rem] shrink-0 items-center justify-center gap-0.5 px-2",
          "font-mono text-[0.68rem] font-medium uppercase tracking-widest transition-colors",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-tangerine motion-reduce:transition-none",
          isNav
            ? cn(
                "rounded-md hover:bg-white/20",
                inverse ? "text-white hover:text-white" : "text-brand-black hover:text-brand-black",
              )
            : cn("border border-border bg-brand-cotton text-brand-black hover:text-brand-black"),
          fullWidth && "w-full min-w-0 justify-between px-3",
          className,
        )}
      >
        <span>{LOCALE_SHORT[currentLocale]}</span>
        <ChevronDown
          className={cn(
            "h-3 w-3 shrink-0 transition-transform",
            open && "rotate-180",
            isNav
              ? inverse
                ? "text-white/60"
                : "text-brand-black/60"
              : "text-brand-black/60",
          )}
          aria-hidden
        />
      </button>

      {mounted &&
        open &&
        createPortal(
          <div className="fixed inset-0 z-[100]">
            <button
              type="button"
              className="absolute inset-0 bg-brand-black/10 backdrop-blur-md motion-reduce:backdrop-blur-none"
              aria-label="Close language selection"
              onClick={() => setOpen(false)}
            />

            <div
              ref={dialogRef}
              id={dialogId}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="pointer-events-none absolute inset-0 flex items-center justify-center p-6"
            >
              <div
                className="pointer-events-auto w-full max-w-[16rem] border border-border bg-white px-2 py-3 shadow-sm"
                onClick={(ev) => ev.stopPropagation()}
              >
                <p
                  id={titleId}
                  className="px-3 pb-2 font-mono text-[0.62rem] font-medium uppercase tracking-[0.2em] text-brand-black/45"
                >
                  Language
                </p>
                <ul className="flex flex-col gap-0.5" role="list">
                  {LOCALES.map((locale) => {
                    const selected = currentLocale === locale;
                    return (
                      <li key={locale}>
                        <button
                          type="button"
                          data-locale-option
                          aria-current={selected ? "true" : undefined}
                          onClick={() => switchLocale(locale)}
                          className={cn(
                            "flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors",
                            "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-tangerine motion-reduce:transition-none",
                            selected
                              ? "bg-brand-tangerine text-brand-black"
                              : "text-brand-black hover:bg-brand-linen/80",
                          )}
                        >
                          <span className="font-mono text-[0.68rem] font-medium uppercase tracking-widest">
                            {LOCALE_SHORT[locale]}
                          </span>
                          <span className="font-body text-xs text-brand-black/55">{LOCALE_LABELS[locale]}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
