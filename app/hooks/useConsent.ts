"use client";

import { useEffect, useState } from "react";

const CONSENT_COOKIE = "COOKIE_CONSENT";
const ONE_YEAR_SEC = 60 * 60 * 24 * 365;

function consentCookieValue(choice: "accepted" | "declined") {
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  return `${CONSENT_COOKIE}=${choice}; max-age=${ONE_YEAR_SEC}; Path=/; SameSite=Lax${secure}`;
}

export type ConsentState = "accepted" | "declined" | null;

export function useConsent() {
  const [state, setState] = useState<ConsentState>(null);

  useEffect(() => {
    const raw = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${CONSENT_COOKIE}=`))
      ?.split("=")[1];
    if (raw === "accepted" || raw === "declined") setState(raw);
  }, []);

  function accept() {
    document.cookie = consentCookieValue("accepted");
    setState("accepted");
  }

  function decline() {
    document.cookie = consentCookieValue("declined");
    setState("declined");
  }

  return {
    consentState: state,
    analyticsConsented: state === "accepted",
    accept,
    decline,
  };
}
