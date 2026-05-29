"use client";

import { useEffect, useLayoutEffect, useState } from "react";

export type NavTone = "light" | "dark";

const NAV_PROBE_OFFSET_PX = 65;

function resolveNavTone(): NavTone {
  const sections = document.querySelectorAll<HTMLElement>("[data-nav-tone]");
  if (sections.length === 0) return "light";

  const probeY = NAV_PROBE_OFFSET_PX;

  for (const section of sections) {
    const { top, bottom } = section.getBoundingClientRect();
    if (top <= probeY && bottom > probeY) {
      const tone = section.dataset.navTone;
      return tone === "dark" ? "dark" : "light";
    }
  }

  const first = sections[0];
  if (first.getBoundingClientRect().top > probeY) {
    const tone = first.dataset.navTone;
    return tone === "dark" ? "dark" : "light";
  }

  const last = sections[sections.length - 1];
  const tone = last.dataset.navTone;
  return tone === "dark" ? "dark" : "light";
}

export function useNavTone(): NavTone {
  const [tone, setTone] = useState<NavTone>("light");

  useLayoutEffect(() => {
    setTone(resolveNavTone());
  }, []);

  useEffect(() => {
    let rafId = 0;

    function sync() {
      setTone(resolveNavTone());
    }

    function onScroll() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(sync);
    }

    sync();

    const sections = document.querySelectorAll<HTMLElement>("[data-nav-tone]");
    const observer = new IntersectionObserver(onScroll, {
      rootMargin: `-${NAV_PROBE_OFFSET_PX}px 0px 0px 0px`,
      threshold: [0, 0.01, 0.1, 0.25, 0.5, 0.75, 1],
    });
    sections.forEach((section) => observer.observe(section));

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return tone;
}
