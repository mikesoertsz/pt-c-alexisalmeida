"use client";

import { useEffect, useRef, useSyncExternalStore, useCallback, type ReactNode } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

function subscribeToReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function RevealOnScroll({ children, className = "", delay = 0 }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const updateVisibility = useCallback(() => {
    if (ref.current && !hasAnimated.current) {
      hasAnimated.current = true;
      ref.current.classList.remove("opacity-0", "translate-y-6");
      ref.current.classList.add("opacity-100", "translate-y-0");
    }
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion) {
      if (element) {
        element.classList.remove("opacity-0", "translate-y-6");
        element.classList.add("opacity-100", "translate-y-0");
      }
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(updateVisibility, delay);
          } else {
            updateVisibility();
          }
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay, prefersReducedMotion, updateVisibility]);

  const initialClasses = prefersReducedMotion
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-6 transition-[opacity,transform] duration-700 ease-out";

  return (
    <div ref={ref} className={[className, initialClasses].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
