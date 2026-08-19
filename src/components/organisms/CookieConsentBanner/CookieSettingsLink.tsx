"use client";

import { openCookieSettings } from "@/lib/consent";

export function CookieSettingsLink({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      {label}
    </button>
  );
}
