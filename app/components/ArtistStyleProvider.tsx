"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { trackEvent } from "@/app/lib/analytics";
import {
  type ArtistStyle,
  type StyleMediaMap,
  ARTIST_STYLE_COOKIE,
  ARTIST_STYLE_STORAGE_KEY,
  DEFAULT_ARTIST_STYLE,
  isArtistStyle,
  pickStyleMedia,
  artistStyleCookieAttributes,
} from "@/app/lib/artist-style";

interface ArtistStyleContextValue {
  style: ArtistStyle;
  setStyle: (next: ArtistStyle) => void;
  toggleStyle: () => void;
}

const ArtistStyleContext = createContext<ArtistStyleContextValue | null>(null);

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function reducedMotionServerSnapshot() {
  return false;
}

function setDomAndPersist(style: ArtistStyle) {
  document.documentElement.dataset.artistStyle = style;
  try {
    localStorage.setItem(ARTIST_STYLE_STORAGE_KEY, style);
  } catch {
    /* ignore */
  }
  document.cookie = `${ARTIST_STYLE_COOKIE}=${encodeURIComponent(style)};${artistStyleCookieAttributes()}`;
}

interface ArtistStyleProviderProps {
  children: ReactNode;
  initialStyle: ArtistStyle;
}

export default function ArtistStyleProvider({
  children,
  initialStyle,
}: ArtistStyleProviderProps) {
  const [style, setStyleState] = useState<ArtistStyle>(initialStyle);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    reducedMotionServerSnapshot,
  );

  useLayoutEffect(() => {
    setStyleState(initialStyle);
  }, [initialStyle]);

  useLayoutEffect(() => {
    setDomAndPersist(style);
  }, [style]);

  const setStyle = useCallback((next: ArtistStyle) => {
    setStyleState(next);
    trackEvent("artist_style_switch", { event_label: next });
  }, []);

  const toggleStyle = useCallback(() => {
    setStyleState((s) => {
      const next: ArtistStyle = s === "blackwork" ? "fine-line" : "blackwork";
      trackEvent("artist_style_switch", { event_label: next });
      return next;
    });
  }, []);

  useLayoutEffect(() => {
    if (!prefersReducedMotion) {
      document.documentElement.classList.add("artist-style-transition");
      return () => document.documentElement.classList.remove("artist-style-transition");
    }
    return;
  }, [prefersReducedMotion]);

  const value = useMemo(
    () => ({ style, setStyle, toggleStyle }),
    [style, setStyle, toggleStyle],
  );

  return (
    <ArtistStyleContext.Provider value={value}>
      {children}
    </ArtistStyleContext.Provider>
  );
}

export function useArtistStyle(): ArtistStyleContextValue {
  const ctx = useContext(ArtistStyleContext);
  if (!ctx) {
    throw new Error("useArtistStyle must be used within ArtistStyleProvider");
  }
  return ctx;
}

/** Safe for optional use (e.g. future shared components outside provider). */
export function tryUseArtistStyle(): ArtistStyleContextValue | null {
  return useContext(ArtistStyleContext);
}

export function useStyleMedia<TFine, TBw>(map: StyleMediaMap<TFine, TBw>): TFine | TBw {
  const { style } = useArtistStyle();
  return pickStyleMedia(style, map);
}

export function readDatasetArtistStyle(): ArtistStyle {
  if (typeof document === "undefined") return DEFAULT_ARTIST_STYLE;
  const v = document.documentElement.dataset.artistStyle;
  return isArtistStyle(v) ? v : DEFAULT_ARTIST_STYLE;
}
