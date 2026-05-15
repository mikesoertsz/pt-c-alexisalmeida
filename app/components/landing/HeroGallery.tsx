"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

interface HeroGalleryProps {
  slides: readonly { readonly src: string; readonly alt: string }[];
}

export default function HeroGallery(props: HeroGalleryProps) {
  const { slides } = props;
  const [active, setActive] = useState(0);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  useEffect(() => {
    setActive(0);
  }, [slides]);

  useEffect(() => {
    if (prefersReducedMotion || slides.length <= 1) return;

    const intervalMs = 5200;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [prefersReducedMotion, slides.length]);

  return (
    <div
      className="relative aspect-square w-full max-w-[min(100%,400px)] lg:max-w-[min(100%,460px)] xl:max-w-[min(100%,500px)] mx-auto lg:mx-0 lg:ml-auto overflow-hidden border border-white/12 shadow-2xl shadow-hero-void/40 bg-hero-void/25 lg:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
      aria-label="Recent studio artwork"
    >
      {slides.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          sizes="(max-width: 1024px) 90vw, 40vw"
          className={`object-cover transition-opacity duration-[1400ms] ease-in-out motion-reduce:duration-0 ${
            i === active ? "opacity-100 z-[1]" : "opacity-0 z-0"
          }`}
          priority={i === 0}
          draggable={false}
        />
      ))}
    </div>
  );
}
