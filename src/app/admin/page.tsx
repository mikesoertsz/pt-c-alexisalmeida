"use client";

import { useState, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Period = {
  id: string;
  city: string;
  country: string;
  from_date: string;
  to_date: string;
  note?: string;
  cal_slug?: string;
};

type FormState = {
  city: string;
  country: string;
  from_date: string;
  to_date: string;
  note: string;
  cal_slug: string;
};

const COUNTRIES = [
  { code: "PT", label: "Portugal" },
  { code: "DE", label: "Germany" },
  { code: "NL", label: "Netherlands" },
  { code: "ES", label: "Spain" },
  { code: "FR", label: "France" },
  { code: "GB", label: "United Kingdom" },
  { code: "US", label: "United States" },
];

const EMPTY_FORM: FormState = {
  city: "",
  country: "DE",
  from_date: "",
  to_date: "",
  note: "",
  cal_slug: "",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDisplay(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function periodStatus(period: Period): "current" | "upcoming" | "past" {
  const today = todayIso();
  if (period.from_date <= today && period.to_date >= today) return "current";
  if (period.from_date > today) return "upcoming";
  return "past";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminPage() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbAvailable, setDbAvailable] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/travel");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (body?.error?.includes("not configured")) {
          setDbAvailable(false);
        } else {
          setError(body?.error ?? "Failed to load");
        }
      } else {
        setPeriods(await res.json());
      }
    } catch {
      setError("Network error — could not reach API.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.city || !form.country || !form.from_date || !form.to_date) {
      setError("City, country, start date and end date are required.");
      return;
    }
    if (form.to_date < form.from_date) {
      setError("End date must be on or after start date.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/travel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: form.city.trim(),
          country: form.country,
          from_date: form.from_date,
          to_date: form.to_date,
          note: form.note.trim() || null,
          cal_slug: form.cal_slug.trim() || null,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.error ?? "Failed to save.");
      } else {
        setForm(EMPTY_FORM);
        await load();
      }
    } catch {
      setError("Network error — could not save.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this travel period?")) return;
    try {
      await fetch(`/api/admin/travel?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      await load();
    } catch {
      setError("Could not delete period.");
    }
  }

  const STATUS_LABELS = {
    current: { label: "NOW", bg: "bg-[#FF6D1F]", text: "text-white" },
    upcoming: { label: "UPCOMING", bg: "bg-white", text: "text-[#222222]" },
    past: { label: "PAST", bg: "bg-[#222222]/10", text: "text-[#222222]/40" },
  };

  return (
    <div className="min-h-screen bg-[#FAF3E1]">

      {/* Top bar */}
      <header className="border-b-2 border-[#222222] bg-[#222222] px-6 md:px-12 py-5">
        <div className="max-w-[960px] mx-auto flex items-center justify-between">
          <div>
            <p className="font-mono text-xs text-white/40 uppercase tracking-[0.12em] mb-1">
              [ lextattoo.com ]
            </p>
            <h1 className="font-sans font-black uppercase text-white text-xl tracking-tight leading-none">
              Travel Schedule
            </h1>
          </div>
          <a
            href="/"
            className="font-mono text-xs text-white/50 uppercase tracking-[0.12em] hover:text-white transition-colors"
          >
            &larr; Site
          </a>
        </div>
      </header>

      <main className="max-w-[960px] mx-auto px-6 md:px-12 py-12 space-y-12">

        {/* DB unavailable notice */}
        {!dbAvailable && (
          <div className="border-2 border-[#FF6D1F] bg-[#FF6D1F]/10 px-6 py-5">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-[#FF6D1F] mb-1">
              [ Supabase not connected ]
            </p>
            <p className="font-sans text-sm text-[#222222]/70 leading-relaxed">
              Set <code className="bg-[#222222]/10 px-1">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
              <code className="bg-[#222222]/10 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and{" "}
              <code className="bg-[#222222]/10 px-1">SUPABASE_SERVICE_ROLE_KEY</code> in Vercel,
              then run the migration in <code className="bg-[#222222]/10 px-1">supabase/migrations/</code>.
              Until then, use the <code className="bg-[#222222]/10 px-1">LEX_TRAVEL_SCHEDULE</code> env var.
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="border-2 border-red-400 bg-red-50 px-5 py-4">
            <p className="font-mono text-xs text-red-600 uppercase tracking-[0.10em]">{error}</p>
          </div>
        )}

        {/* Add form */}
        <section className="border-2 border-[#222222] bg-white">
          <div className="border-b-2 border-[#222222] px-6 py-4">
            <p className="font-mono text-xs text-[#222222]/50 uppercase tracking-[0.12em]">
              [ Add travel period ]
            </p>
          </div>
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* City */}
              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs text-[#222222]/50 uppercase tracking-[0.10em]">
                  City
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Berlin"
                  className="border-2 border-[#222222]/30 bg-[#FAF3E1] px-3 py-2.5 font-sans text-sm text-[#222222] placeholder:text-[#222222]/30 focus:border-[#222222] focus:outline-none"
                  required
                />
              </div>

              {/* Country */}
              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs text-[#222222]/50 uppercase tracking-[0.10em]">
                  Country
                </label>
                <select
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="border-2 border-[#222222]/30 bg-[#FAF3E1] px-3 py-2.5 font-sans text-sm text-[#222222] focus:border-[#222222] focus:outline-none"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.label} ({c.code})</option>
                  ))}
                </select>
              </div>

              {/* From date */}
              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs text-[#222222]/50 uppercase tracking-[0.10em]">
                  Start date
                </label>
                <input
                  type="date"
                  value={form.from_date}
                  onChange={(e) => setForm({ ...form, from_date: e.target.value })}
                  className="border-2 border-[#222222]/30 bg-[#FAF3E1] px-3 py-2.5 font-sans text-sm text-[#222222] focus:border-[#222222] focus:outline-none"
                  required
                />
              </div>

              {/* To date */}
              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs text-[#222222]/50 uppercase tracking-[0.10em]">
                  End date
                </label>
                <input
                  type="date"
                  value={form.to_date}
                  min={form.from_date || undefined}
                  onChange={(e) => setForm({ ...form, to_date: e.target.value })}
                  className="border-2 border-[#222222]/30 bg-[#FAF3E1] px-3 py-2.5 font-sans text-sm text-[#222222] focus:border-[#222222] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Note (optional) */}
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs text-[#222222]/50 uppercase tracking-[0.10em]">
                Note <span className="normal-case">(optional — shown on schedule)</span>
              </label>
              <input
                type="text"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Guest spot — Stigma Tattoo"
                className="border-2 border-[#222222]/30 bg-[#FAF3E1] px-3 py-2.5 font-sans text-sm text-[#222222] placeholder:text-[#222222]/30 focus:border-[#222222] focus:outline-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving || !dbAvailable}
                className="border-2 border-[#222222] bg-[#222222] text-white font-mono text-xs uppercase tracking-[0.12em] px-8 py-3 hover:bg-[#FF6D1F] hover:border-[#FF6D1F] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Add period"}
              </button>
            </div>
          </form>
        </section>

        {/* Current schedule */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <p className="font-mono text-xs text-[#222222]/50 uppercase tracking-[0.12em]">
              [ Schedule — {periods.length} {periods.length === 1 ? "period" : "periods"} ]
            </p>
            <button
              onClick={load}
              className="font-mono text-xs text-[#222222]/40 uppercase tracking-[0.10em] hover:text-[#222222] transition-colors"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="font-mono text-xs text-[#222222]/30 uppercase tracking-[0.10em]">Loading...</p>
          ) : periods.length === 0 ? (
            <div className="border-2 border-[#222222]/20 border-dashed px-6 py-10 text-center">
              <p className="font-mono text-xs text-[#222222]/30 uppercase tracking-[0.10em]">
                No travel periods added yet
              </p>
            </div>
          ) : (
            <div className="space-y-0 border-l-2 border-t-2 border-[#222222]">
              {periods.map((period) => {
                const status = periodStatus(period);
                const style = STATUS_LABELS[status];
                return (
                  <div
                    key={period.id}
                    className={[
                      "border-r-2 border-b-2 border-[#222222] px-6 py-5 flex items-start justify-between gap-4",
                      status === "current" ? "bg-[#FF6D1F]" : status === "past" ? "bg-[#222222]/5" : "bg-white",
                    ].join(" ")}
                  >
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className={[
                          "font-mono text-xs uppercase tracking-[0.10em] px-2 py-0.5",
                          style.bg,
                          style.text,
                          status === "current" ? "bg-white/20 text-white" : "",
                        ].join(" ")}>
                          {style.label}
                        </span>
                        <span className={[
                          "font-sans font-black uppercase text-lg tracking-tight leading-none",
                          status === "current" ? "text-white" : status === "past" ? "text-[#222222]/30" : "text-[#222222]",
                        ].join(" ")}>
                          {period.city}, {period.country}
                        </span>
                      </div>
                      <p className={[
                        "font-mono text-xs uppercase tracking-[0.10em]",
                        status === "current" ? "text-white/70" : "text-[#222222]/40",
                      ].join(" ")}>
                        {formatDisplay(period.from_date)} – {formatDisplay(period.to_date)}
                      </p>
                      {period.note && (
                        <p className={[
                          "font-sans text-xs",
                          status === "current" ? "text-white/70" : "text-[#222222]/40",
                        ].join(" ")}>
                          {period.note}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(period.id)}
                      className={[
                        "font-mono text-xs uppercase tracking-[0.10em] shrink-0 px-3 py-1.5 border transition-colors",
                        status === "current"
                          ? "border-white/40 text-white/60 hover:border-white hover:text-white"
                          : "border-[#222222]/20 text-[#222222]/40 hover:border-red-400 hover:text-red-500",
                      ].join(" ")}
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* How this works note */}
        <section className="border-t-2 border-[#222222]/20 pt-8">
          <p className="font-mono text-xs text-[#222222]/40 uppercase tracking-[0.10em] mb-3">
            [ How this works ]
          </p>
          <p className="font-sans text-sm text-[#222222]/50 leading-relaxed max-w-lg">
            Periods added here control what visitors see on the homepage and booking page — current location, which city is accepting bookings, and the travel timeline. Changes take effect immediately on the next page load (no redeploy needed).
          </p>
        </section>

      </main>
    </div>
  );
}
