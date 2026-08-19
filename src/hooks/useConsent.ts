"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CONSENT_CHANGE_EVENT,
  CONSENT_OPEN_EVENT,
  CONSENT_VERSION,
  DENY_ALL,
  GRANT_ALL,
  readConsentCookie,
  updateGoogleConsent,
  updateMetaConsent,
  writeConsentCookie,
  type ConsentPreferences,
  type ConsentRecord,
} from "@/lib/consent";

export function useConsent() {
  const [record, setRecord] = useState<ConsentRecord | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const stored = readConsentCookie();
      setRecord(stored && stored.version === CONSENT_VERSION ? stored : null);
      setHydrated(true);
    });

    const onChange = () => setRecord(readConsentCookie());
    const onOpen = () => setReopened(true);
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
      window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
    };
  }, []);

  const save = useCallback((preferences: ConsentPreferences) => {
    const next: ConsentRecord = {
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      preferences: { ...preferences, necessary: true },
    };
    writeConsentCookie(next);
    setRecord(next);
    setReopened(false);
    updateGoogleConsent(next.preferences);
    updateMetaConsent(next.preferences);
    window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
  }, []);

  const acceptAll = useCallback(() => save(GRANT_ALL), [save]);
  const rejectAll = useCallback(() => save(DENY_ALL), [save]);

  return {
    preferences: record?.preferences ?? DENY_ALL,
    hasResponded: record !== null,
    hydrated,
    reopened,
    dismissReopened: useCallback(() => setReopened(false), []),
    analyticsConsented: record?.preferences.analytics ?? false,
    marketingConsented: record?.preferences.marketing ?? false,
    save,
    acceptAll,
    rejectAll,
  };
}
