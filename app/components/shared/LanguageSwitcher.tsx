"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  LOCALES,
  LOCALE_LABELS,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  stripLocalePrefixFromPath,
  type Locale,
  localizedPath,
} from "@/app/lib/locale";
import { trackEvent } from "@/app/lib/analytics";

function subscribePrefersReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getPrefersReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getPrefersReducedMotionServerSnapshot() {
  return false;
}

interface Props {
  currentLocale: Locale;
  /** Merged onto the root (spacing, breakpoints). */
  className?: string;
}

export default function LanguageSwitcher({ currentLocale, className }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  const prefersReducedMotion = useSyncExternalStore(
    subscribePrefersReducedMotion,
    getPrefersReducedMotionSnapshot,
    getPrefersReducedMotionServerSnapshot
  );

  const motionPanelClass = prefersReducedMotion
    ? "transition-opacity duration-300 ease-out"
    : "transition-all duration-300 ease-out";

  const switchLocale = useCallback(
    (next: Locale) => {
      const strippedBase = stripLocalePrefixFromPath(pathname);
      const stripped = strippedBase === "" ? "/" : strippedBase;

      document.cookie = `${LOCALE_COOKIE}=${next};max-age=${LOCALE_COOKIE_MAX_AGE};path=/;samesite=lax`;

      const url = localizedPath(next, stripped);
      trackEvent("language_switch", { event_label: next });
      router.push(url);
      setOpen(false);
    },
    [pathname, router]
  );

  useEffect(() => {
    function onPointerDown(ev: MouseEvent | TouchEvent) {
      const el = rootRef.current;
      if (!el?.contains(ev.target as Node)) {
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
        triggerRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function onTriggerKeyDown(ev: ReactKeyboardEvent<HTMLButtonElement>) {
    if (ev.key === "ArrowDown" || ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      setOpen(true);
    }
  }

  return (
    <div ref={rootRef} className={`relative shrink-0 ${className ?? ""}`}>
      <button
        ref={triggerRef}
        type="button"
        id={`${listId}-trigger`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${listId}-listbox`}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onTriggerKeyDown}
        className="inline-flex h-9 min-w-28 items-center justify-between gap-2 border border-border/30 bg-surface px-2.5 text-left text-[0.68rem] font-sans font-medium uppercase tracking-widest text-fg-muted hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50 motion-reduce:transition-none"
      >
        <span>{LOCALE_LABELS[currentLocale]}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-ink/70 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      <div
        id={`${listId}-listbox`}
        role="listbox"
        aria-labelledby={`${listId}-trigger`}
        aria-activedescendant={open ? `${listId}-opt-${currentLocale}` : undefined}
        className={[
          "absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden border border-border/30 bg-surface py-1 shadow-sm",
          motionPanelClass,
          open
            ? "pointer-events-auto visible opacity-100 translate-y-0"
            : [
                "pointer-events-none invisible opacity-0",
                prefersReducedMotion ? "" : "translate-y-1",
              ]
                .filter(Boolean)
                .join(" "),
        ].join(" ")}
      >
        {LOCALES.map((locale) => (
          <button
            key={locale}
            type="button"
            id={`${listId}-opt-${locale}`}
            role="option"
            aria-selected={currentLocale === locale}
            onClick={() => switchLocale(locale)}
            className={[
              "flex w-full min-h-9 items-center px-2.5 py-2 text-left text-[0.68rem] font-sans font-medium uppercase tracking-widest transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent/50 motion-reduce:transition-none",
              currentLocale === locale
                ? "bg-accent text-on-accent"
                : "text-fg-muted hover:text-ink hover:bg-surface-muted/40",
            ].join(" ")}
          >
            {LOCALE_LABELS[locale]}
          </button>
        ))}
      </div>
    </div>
  );
}
