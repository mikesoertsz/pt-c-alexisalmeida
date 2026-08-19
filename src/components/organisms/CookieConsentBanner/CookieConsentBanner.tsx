"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useConsent } from "@/hooks/useConsent";
import {
  DENY_ALL,
  OPTIONAL_CATEGORIES,
  type ConsentCategory,
  type ConsentPreferences,
} from "@/lib/consent";
import type { ContentSchema } from "@/content/schema";

interface CookieConsentBannerProps {
  content: ContentSchema["cookieConsent"];
  cookiesPolicyHref: string;
}

export function CookieConsentBanner({ content, cookiesPolicyHref }: CookieConsentBannerProps) {
  const { hasResponded, hydrated, reopened, preferences, save, acceptAll, rejectAll } =
    useConsent();
  const [opened, setOpened] = useState(false);
  const [edits, setEdits] = useState<ConsentPreferences | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState(0);

  const visible = hydrated && (!hasResponded || reopened);
  const expanded = opened || reopened;
  const draft = edits ?? (reopened ? preferences : DENY_ALL);

  useEffect(() => {
    if (reopened) dialogRef.current?.focus();
  }, [reopened]);

  const reset = () => {
    setOpened(false);
    setEdits(null);
  };

  const handleSave = (next: ConsentPreferences) => {
    save(next);
    reset();
  };

  const handleAcceptAll = () => {
    acceptAll();
    reset();
  };

  const handleRejectAll = () => {
    rejectAll();
    reset();
  };

  const measurePanel = useCallback((el: HTMLDivElement | null) => {
    panelRef.current = el;
    if (!el) return;
    setPanelHeight(el.offsetHeight);
    const observer = new ResizeObserver(() => setPanelHeight(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  const openPanel = () => {
    if (panelRef.current) setPanelHeight(panelRef.current.offsetHeight);
    setOpened(true);
  };

  const toggle = (category: ConsentCategory) =>
    setEdits((current) => {
      const base = current ?? draft;
      return { ...base, [category]: !base[category] };
    });

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-4 pb-24 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:justify-start sm:p-0">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="false"
        aria-label={content.ariaLabel}
        tabIndex={-1}
        data-state={expanded ? "expanded" : "collapsed"}
        className="animate-cookie-in pointer-events-auto w-full max-w-[384px] rounded-[16px] border border-black/[0.04] bg-white p-6 font-[ui-sans-serif,system-ui,-apple-system,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] shadow-[0_10px_38px_-10px_rgba(0,0,0,0.22),0_10px_20px_-15px_rgba(0,0,0,0.15)] outline-none"
      >
        <p className="text-[14px] leading-5 font-semibold tracking-[-0.01em] text-zinc-900">
          {content.title}
        </p>

        <p className="mt-2 text-[15px] leading-[1.5] text-zinc-700">
          {content.body}{" "}
          <Link
            href={cookiesPolicyHref}
            className="text-zinc-400 transition-colors hover:text-zinc-600 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            {content.policyLinkLabel}
          </Link>
          .
        </p>

        <div
          className="overflow-hidden transition-[height] duration-300 ease-out motion-reduce:transition-none"
          style={{ height: expanded ? panelHeight : 0 }}
        >
          <div>
            <div
              ref={measurePanel}
              className={`space-y-7 pt-6 ${expanded ? "animate-cookie-panel-in" : ""}`}
              aria-hidden={!expanded}
            >
              {(["necessary", ...OPTIONAL_CATEGORIES] as ConsentCategory[]).map((category) => {
                const locked = category === "necessary";
                const copy = content.categories[category];
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between gap-4">
                      <span
                        id={`cookie-cat-${category}`}
                        className="text-sm font-medium text-zinc-900"
                      >
                        {copy.label}
                      </span>
                      <ConsentSwitch
                        checked={locked ? true : draft[category]}
                        disabled={locked || !expanded}
                        labelledBy={`cookie-cat-${category}`}
                        onChange={() => toggle(category)}
                      />
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">
                      {copy.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {expanded ? (
          <button
            type="button"
            onClick={() => handleSave(draft)}
            className="mt-6 h-9 w-full rounded-[8px] bg-zinc-950 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            {content.saveLabel}
          </button>
        ) : (
          <div className="mt-5 flex items-center gap-2">
            <button
              type="button"
              onClick={handleRejectAll}
              className="h-9 flex-1 rounded-[8px] bg-zinc-100 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            >
              {content.rejectAllLabel}
            </button>
            <button
              type="button"
              onClick={openPanel}
              aria-expanded={expanded}
              className="h-9 flex-1 rounded-[8px] bg-zinc-100 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            >
              {content.customizeLabel}
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="h-9 flex-1 rounded-[8px] bg-zinc-950 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            >
              {content.acceptAllLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ConsentSwitch({
  checked,
  disabled,
  labelledBy,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  labelledBy: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      disabled={disabled}
      onClick={onChange}
      className={`-m-2 inline-flex shrink-0 p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-zinc-900 ${
        disabled ? "cursor-default" : "cursor-pointer"
      }`}
    >
      <span
        className={`pointer-events-none relative flex h-[14px] w-[26px] items-center rounded-full transition-colors ${
          checked ? "bg-zinc-950" : "bg-zinc-200"
        }`}
      >
        <span
          className={`block h-[10px] w-[10px] rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-[14px]" : "translate-x-[2px]"
          }`}
        />
      </span>
    </button>
  );
}
