"use client";

import { useEffect, useRef, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
  title: string;
  body: string;
  emailNote: string;
  calendarLabel: string;
  cta: string;
  ctaHref: string;
  /** ISO date string from Cal.eu redirect params, e.g. "2026-05-29T10:00:00.000Z" */
  startTime?: string;
  endTime?: string;
  eventTitle?: string;
}

// ---------------------------------------------------------------------------
// Calendar link helpers
// ---------------------------------------------------------------------------

function fmtIso(iso: string): string {
  // "2026-05-29T10:00:00.000Z" -> "20260529T100000Z"
  return iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function googleCalUrl(start: string, end: string, title: string): string {
  return (
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${fmtIso(start)}/${fmtIso(end)}` +
    `&details=${encodeURIComponent("Tattoo consultation with Lex Almeida. Check your email for full details.")}`
  );
}

function outlookUrl(start: string, end: string, title: string): string {
  return (
    "https://outlook.live.com/calendar/0/action/compose?rru=addevent" +
    `&subject=${encodeURIComponent(title)}` +
    `&startdt=${encodeURIComponent(start)}` +
    `&enddt=${encodeURIComponent(end)}` +
    `&body=${encodeURIComponent("Tattoo consultation with Lex Almeida.")}`
  );
}

function icsDataUrl(start: string, end: string, title: string): string {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Lex Almeida Tattoo//EN",
    "BEGIN:VEVENT",
    `DTSTART:${fmtIso(start)}`,
    `DTEND:${fmtIso(end)}`,
    `SUMMARY:${title}`,
    "DESCRIPTION:Tattoo consultation with Lex Almeida. Check your email for details.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

// ---------------------------------------------------------------------------
// Confetti
// ---------------------------------------------------------------------------

const CONFETTI_COLORS = [
  "#FF6D1F", // tangerine
  "#222222", // black
  "#F5E7C6", // cotton
  "#FAF3E1", // linen
  "#FF6D1F",
  "#222222",
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  rotV: number;
  w: number;
  h: number;
  color: string;
  opacity: number;
}

function useConfetti(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 80,
      vx: (Math.random() - 0.5) * 3.5,
      vy: 2.5 + Math.random() * 3,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.12,
      w: 6 + Math.random() * 8,
      h: 10 + Math.random() * 6,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      opacity: 1,
    }));

    const START = performance.now();
    const DURATION = 3500; // ms total
    const FADE_START = 2600; // ms before fade begins

    let raf: number;

    function draw(now: number) {
      if (!ctx || !canvas) return;
      const elapsed = now - START;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const globalFade =
        elapsed > FADE_START
          ? 1 - (elapsed - FADE_START) / (DURATION - FADE_START)
          : 1;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.07; // gravity
        p.rot += p.rotV;
        p.opacity = Math.max(0, globalFade);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      if (elapsed < DURATION) {
        raf = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [canvasRef]);
}

// ---------------------------------------------------------------------------
// Calendar icon buttons
// ---------------------------------------------------------------------------

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.43c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 3.96zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  );
}

function OutlookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4" fill="currentColor">
      <path d="M7 12a5 5 0 1 0 10 0A5 5 0 0 0 7 12zm5-3.5A3.5 3.5 0 1 1 8.5 12 3.504 3.504 0 0 1 12 8.5z" fill="#0078D4"/>
      <path d="M0 4h10v16H0z" fill="#0078D4"/>
      <path d="M5 8.5A2.5 2.5 0 1 0 5 13.5 2.5 2.5 0 0 0 5 8.5z" fill="#fff"/>
      <path d="M10 4l12 2v12l-12 2V4z" fill="#0078D4"/>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ThankYouContent({
  title,
  body,
  emailNote,
  calendarLabel,
  cta,
  ctaHref,
  startTime,
  endTime,
  eventTitle,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useConfetti(canvasRef);

  const hasCalendarData = Boolean(startTime && endTime);
  const calTitle = eventTitle ?? "Tattoo Consultation — Lex Almeida";

  const downloadIcs = useCallback(() => {
    if (!startTime || !endTime) return;
    const url = icsDataUrl(startTime, endTime, calTitle);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lex-almeida-consultation.ics";
    a.click();
  }, [startTime, endTime, calTitle]);

  return (
    <>
      {/* Confetti canvas — fixed, pointer-events-none */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-50 pointer-events-none"
        aria-hidden="true"
      />

      {/* Vertically + horizontally centered content */}
      <div className="flex items-center justify-center min-h-[calc(100svh-8rem)] px-6 py-16">
        <div className="w-full max-w-md text-center space-y-8">

          {/* Status tag */}
          <p className="animate-fade-up-in font-mono text-xs text-brand-tangerine uppercase tracking-[0.16em]">
            [ confirmed ]
          </p>

          {/* Heading */}
          <h1 className="animate-fade-up-in animate-delay-100 font-display font-black uppercase text-brand-black leading-[0.9] tracking-tighter text-4xl md:text-5xl">
            {title}
          </h1>

          {/* Divider */}
          <div className="animate-fade-up-in animate-delay-200 w-12 h-0.5 bg-brand-black mx-auto" />

          {/* Body */}
          <p className="animate-fade-up-in animate-delay-200 font-body text-sm text-brand-black/70 leading-relaxed">
            {body}
          </p>

          {/* Email note */}
          <div className="animate-fade-up-in animate-delay-300 inline-flex items-center gap-2 border border-brand-black/15 bg-brand-cotton px-4 py-3 text-left w-full">
            <svg viewBox="0 0 20 20" className="w-4 h-4 shrink-0 text-brand-tangerine" fill="currentColor" aria-hidden="true">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0 0 16 4H4a2 2 0 0 0-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.118z"/>
            </svg>
            <span className="font-mono text-xs text-brand-black/70 uppercase tracking-[0.08em]">
              {emailNote}
            </span>
          </div>

          {/* Calendar buttons */}
          {hasCalendarData && (
            <div className="animate-fade-up-in animate-delay-400 space-y-3">
              <p className="font-mono text-xs text-brand-muted uppercase tracking-[0.12em]">
                {calendarLabel}
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {/* Google Calendar */}
                <a
                  href={googleCalUrl(startTime!, endTime!, calTitle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-brand-black/20 bg-white hover:bg-brand-cotton px-4 py-2.5 font-mono text-xs text-brand-black uppercase tracking-[0.08em] transition-colors"
                  aria-label="Add to Google Calendar"
                >
                  <GoogleIcon />
                  Google
                </a>

                {/* Apple / iCal */}
                <button
                  type="button"
                  onClick={downloadIcs}
                  className="inline-flex items-center gap-2 border border-brand-black/20 bg-white hover:bg-brand-cotton px-4 py-2.5 font-mono text-xs text-brand-black uppercase tracking-[0.08em] transition-colors cursor-pointer"
                  aria-label="Add to Apple Calendar"
                >
                  <AppleIcon />
                  Apple
                </button>

                {/* Outlook */}
                <a
                  href={outlookUrl(startTime!, endTime!, calTitle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-brand-black/20 bg-white hover:bg-brand-cotton px-4 py-2.5 font-mono text-xs text-brand-black uppercase tracking-[0.08em] transition-colors"
                  aria-label="Add to Outlook Calendar"
                >
                  <OutlookIcon />
                  Outlook
                </a>
              </div>
            </div>
          )}

          {/* Back to home CTA */}
          <div className="animate-fade-up-in animate-delay-500 pt-2">
            <a
              href={ctaHref}
              className="inline-block bg-brand-tangerine text-white font-mono text-xs uppercase tracking-[0.16em] px-8 py-4 hover:bg-brand-black transition-colors"
            >
              {cta}
            </a>
          </div>

        </div>
      </div>
    </>
  );
}
