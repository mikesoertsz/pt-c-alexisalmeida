"use client";

import { useRef, useState } from "react";
import {
  BUDGET_RANGES,
  COLOUR_PREFERENCES,
  DEFAULT_PHONE_COUNTRY_CODE,
  EXISTING_TATTOOS_OPTIONS,
  INTAKE_ACCEPTED_IMAGE_TYPES,
  INTAKE_MAX_IDEA_LENGTH,
  INTAKE_MAX_UPLOAD_BYTES,
  PHONE_COUNTRY_CODES,
  validateIntake,
} from "@/features/booking/intake-fields";

interface BookingIntakeFormProps {
  /** Localised href of the privacy policy, for the consent checkbox. */
  privacyHref: string;
}

interface FormState {
  name: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  tattooIdea: string;
  placement: string;
  approxSizeCm: string;
  style: string;
  colourPreference: string;
  budgetRange: string;
  preferredDates: string;
  existingTattoos: string;
  consent: boolean;
}

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  phoneCountryCode: DEFAULT_PHONE_COUNTRY_CODE,
  phoneNumber: "",
  tattooIdea: "",
  placement: "",
  approxSizeCm: "",
  style: "",
  colourPreference: "",
  budgetRange: "",
  preferredDates: "",
  existingTattoos: "",
  consent: false,
};

// ---------------------------------------------------------------------------
// Shared class strings — Swiss industrial: hard borders, mono labels, no radius
// ---------------------------------------------------------------------------

const labelClass =
  "font-mono text-xs text-brand-black/50 uppercase tracking-[0.10em]";
const helpClass = "font-body text-xs text-brand-black/40 leading-relaxed";
const errorClass = "font-mono text-xs text-[#c1400f] uppercase tracking-[0.10em]";
const fieldClass =
  "w-full border-2 border-brand-black/30 bg-brand-linen px-3 py-2.5 font-body text-sm text-brand-black placeholder:text-brand-black/30 focus:border-brand-black focus:outline-none";
const numericFieldClass = `${fieldClass} font-mono`;

export function BookingIntakeForm({ privacyHref }: BookingIntakeFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [reference, setReference] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setReference(null);
      return;
    }
    if (!(INTAKE_ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      setErrors((prev) => ({ ...prev, reference: "Use a JPG, PNG, WEBP or HEIC image." }));
      if (fileInputRef.current) fileInputRef.current.value = "";
      setReference(null);
      return;
    }
    if (file.size > INTAKE_MAX_UPLOAD_BYTES) {
      setErrors((prev) => ({ ...prev, reference: "Image must be 4 MB or smaller." }));
      if (fileInputRef.current) fileInputRef.current.value = "";
      setReference(null);
      return;
    }
    setErrors((prev) => {
      const next = { ...prev };
      delete next.reference;
      return next;
    });
    setReference(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const result = validateIntake({
      name: form.name,
      email: form.email,
      phoneCountryCode: form.phoneCountryCode,
      phoneNumber: form.phoneNumber,
      tattooIdea: form.tattooIdea,
      placement: form.placement,
      approxSizeCm: form.approxSizeCm,
      style: form.style,
      colourPreference: form.colourPreference,
      budgetRange: form.budgetRange,
      preferredDates: form.preferredDates,
      existingTattoos: form.existingTattoos,
      consent: form.consent ? "true" : "",
    });

    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    setStatus("sending");

    try {
      const body = new FormData();
      body.set("name", form.name);
      body.set("email", form.email);
      body.set("phoneCountryCode", form.phoneCountryCode);
      body.set("phoneNumber", form.phoneNumber);
      body.set("tattooIdea", form.tattooIdea);
      body.set("placement", form.placement);
      body.set("approxSizeCm", form.approxSizeCm);
      body.set("style", form.style);
      body.set("colourPreference", form.colourPreference);
      body.set("budgetRange", form.budgetRange);
      body.set("preferredDates", form.preferredDates);
      body.set("existingTattoos", form.existingTattoos);
      body.set("consent", "true");
      if (reference) body.set("reference", reference);

      const res = await fetch("/api/booking/intake", { method: "POST", body });

      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as {
          error?: string;
          errors?: Record<string, string>;
        };
        if (payload.errors) setErrors(payload.errors);
        setSubmitError(payload.error ?? "Could not send your request. Please try again.");
        setStatus("idle");
        return;
      }

      setForm(EMPTY_FORM);
      setReference(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setStatus("sent");
    } catch {
      setSubmitError("Network error — your request was not sent.");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <section className="border-2 border-brand-black bg-white px-6 py-10 md:px-10 md:py-14">
        <p className="font-mono text-xs text-brand-black/50 uppercase tracking-[0.12em] mb-4">
          [ Request received ]
        </p>
        <h2 className="font-display font-black uppercase text-brand-black text-3xl md:text-4xl leading-[0.9] tracking-tighter mb-4">
          Thank you
        </h2>
        <p className="font-body text-sm text-brand-black/70 leading-relaxed max-w-[52ch]">
          Lex reviews every request personally and responds within 48 hours. If your idea is a fit,
          you will receive a proposal and the next available dates.
        </p>
      </section>
    );
  }

  return (
    <section className="border-2 border-brand-black bg-white">
      <div className="border-b-2 border-brand-black px-6 py-4 md:px-10">
        <p className="font-mono text-xs text-brand-black/50 uppercase tracking-[0.12em]">
          [ Project details ]
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="px-6 py-8 md:px-10 md:py-10 space-y-8">
        <p className={helpClass}>
          The more detail you give, the faster Lex can answer. Fields marked with an asterisk are
          required.
        </p>

        {/* ---------------------------------------------------------------- */}
        {/* Contact                                                          */}
        {/* ---------------------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="intake-name" className={labelClass}>
              Your name *
            </label>
            <input
              id="intake-name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={fieldClass}
              aria-invalid={Boolean(errors.name)}
              required
            />
            {errors.name && <p className={errorClass}>{errors.name}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="intake-email" className={labelClass}>
              Email address *
            </label>
            <input
              id="intake-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={fieldClass}
              aria-invalid={Boolean(errors.email)}
              required
            />
            {errors.email && <p className={errorClass}>{errors.email}</p>}
          </div>
        </div>

        {/* Phone with country code */}
        <div className="flex flex-col gap-2">
          <label htmlFor="intake-phone" className={labelClass}>
            Phone number *
          </label>
          <div className="flex gap-3">
            <select
              id="intake-phone-code"
              name="phoneCountryCode"
              aria-label="Country dialling code"
              value={form.phoneCountryCode}
              onChange={(e) => update("phoneCountryCode", e.target.value)}
              className={`${numericFieldClass} w-auto shrink-0`}
            >
              {PHONE_COUNTRY_CODES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} {c.label}
                </option>
              ))}
            </select>
            <input
              id="intake-phone"
              name="phoneNumber"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="912 345 678"
              value={form.phoneNumber}
              onChange={(e) => update("phoneNumber", e.target.value)}
              className={numericFieldClass}
              aria-invalid={Boolean(errors.phoneNumber)}
              required
            />
          </div>
          <p className={helpClass}>
            Portugal and Germany both supported — pick the code that matches your number. Used for
            WhatsApp confirmation only.
          </p>
          {(errors.phoneNumber || errors.phoneCountryCode) && (
            <p className={errorClass}>{errors.phoneNumber ?? errors.phoneCountryCode}</p>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* The piece                                                        */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex flex-col gap-2">
          <label htmlFor="intake-idea" className={labelClass}>
            Tell us about your tattoo idea *
          </label>
          <textarea
            id="intake-idea"
            name="tattooIdea"
            rows={5}
            maxLength={INTAKE_MAX_IDEA_LENGTH}
            placeholder="e.g. A small lotus flower, a portrait of my dog, a geometric sleeve..."
            value={form.tattooIdea}
            onChange={(e) => update("tattooIdea", e.target.value)}
            className={fieldClass}
            aria-invalid={Boolean(errors.tattooIdea)}
            required
          />
          <p className={helpClass}>
            <span className="font-mono">
              {form.tattooIdea.length}/{INTAKE_MAX_IDEA_LENGTH}
            </span>{" "}
            characters.
          </p>
          {errors.tattooIdea && <p className={errorClass}>{errors.tattooIdea}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="intake-placement" className={labelClass}>
              Where would you like the tattoo? *
            </label>
            <input
              id="intake-placement"
              name="placement"
              type="text"
              placeholder="e.g. Inner forearm, behind the ear, upper back..."
              value={form.placement}
              onChange={(e) => update("placement", e.target.value)}
              className={fieldClass}
              aria-invalid={Boolean(errors.placement)}
              required
            />
            {errors.placement && <p className={errorClass}>{errors.placement}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="intake-size" className={labelClass}>
              Approximate size of the tattoo? *
            </label>
            <input
              id="intake-size"
              name="approxSizeCm"
              type="text"
              inputMode="numeric"
              placeholder="12 x 8"
              value={form.approxSizeCm}
              onChange={(e) => update("approxSizeCm", e.target.value)}
              className={numericFieldClass}
              aria-invalid={Boolean(errors.approxSizeCm)}
              required
            />
            <p className={helpClass}>In centimetres — width x height is enough.</p>
            {errors.approxSizeCm && <p className={errorClass}>{errors.approxSizeCm}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="intake-style" className={labelClass}>
              What style are you drawn to? *
            </label>
            <input
              id="intake-style"
              name="style"
              type="text"
              placeholder="e.g. Fine line, blackwork, dark art, neo-traditional..."
              value={form.style}
              onChange={(e) => update("style", e.target.value)}
              className={fieldClass}
              aria-invalid={Boolean(errors.style)}
              required
            />
            {errors.style && <p className={errorClass}>{errors.style}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="intake-budget" className={labelClass}>
              Budget range *
            </label>
            <select
              id="intake-budget"
              name="budgetRange"
              value={form.budgetRange}
              onChange={(e) => update("budgetRange", e.target.value)}
              className={form.budgetRange ? numericFieldClass : fieldClass}
              aria-invalid={Boolean(errors.budgetRange)}
              required
            >
              <option value="">Select a range</option>
              {BUDGET_RANGES.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
            {errors.budgetRange && <p className={errorClass}>{errors.budgetRange}</p>}
          </div>
        </div>

        {/* Colour vs black and grey */}
        <fieldset className="flex flex-col gap-3">
          <legend className={labelClass}>Colour or black and grey? *</legend>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {COLOUR_PREFERENCES.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 font-body text-sm text-brand-black"
              >
                <input
                  type="radio"
                  name="colourPreference"
                  value={option.value}
                  checked={form.colourPreference === option.value}
                  onChange={(e) => update("colourPreference", e.target.value)}
                  className="accent-brand-tangerine"
                />
                {option.label}
              </label>
            ))}
          </div>
          {errors.colourPreference && <p className={errorClass}>{errors.colourPreference}</p>}
        </fieldset>

        {/* Existing tattoos */}
        <fieldset className="flex flex-col gap-3">
          <legend className={labelClass}>Do you have existing tattoos? *</legend>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {EXISTING_TATTOOS_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 font-body text-sm text-brand-black"
              >
                <input
                  type="radio"
                  name="existingTattoos"
                  value={option.value}
                  checked={form.existingTattoos === option.value}
                  onChange={(e) => update("existingTattoos", e.target.value)}
                  className="accent-brand-tangerine"
                />
                {option.label}
              </label>
            ))}
          </div>
          {errors.existingTattoos && <p className={errorClass}>{errors.existingTattoos}</p>}
        </fieldset>

        {/* Availability */}
        <div className="flex flex-col gap-2">
          <label htmlFor="intake-dates" className={labelClass}>
            Preferred dates or availability *
          </label>
          <input
            id="intake-dates"
            name="preferredDates"
            type="text"
            placeholder="e.g. Any weekend in June, or weekday evenings after 18:00"
            value={form.preferredDates}
            onChange={(e) => update("preferredDates", e.target.value)}
            className={fieldClass}
            aria-invalid={Boolean(errors.preferredDates)}
            required
          />
          <p className={helpClass}>
            Lex works from Porto and travels to Germany — tell us which you need.
          </p>
          {errors.preferredDates && <p className={errorClass}>{errors.preferredDates}</p>}
        </div>

        {/* Reference upload */}
        <div className="flex flex-col gap-2">
          <label htmlFor="intake-reference" className={labelClass}>
            Reference image (optional)
          </label>
          <input
            id="intake-reference"
            name="reference"
            type="file"
            ref={fileInputRef}
            accept={INTAKE_ACCEPTED_IMAGE_TYPES.join(",")}
            onChange={handleFile}
            className="w-full border-2 border-brand-black/30 bg-brand-linen px-3 py-2.5 font-body text-sm text-brand-black file:mr-4 file:border-2 file:border-brand-black file:bg-white file:px-3 file:py-1.5 file:font-mono file:text-xs file:uppercase file:tracking-[0.10em] file:text-brand-black focus:border-brand-black focus:outline-none"
          />
          <p className={helpClass}>
            JPG, PNG, WEBP or HEIC. Maximum <span className="font-mono">4 MB</span>.
          </p>
          {reference && (
            <p className="font-mono text-xs text-brand-black/50 uppercase tracking-[0.10em]">
              [ {reference.name} · {(reference.size / 1024 / 1024).toFixed(2)} MB ]
            </p>
          )}
          {errors.reference && <p className={errorClass}>{errors.reference}</p>}
        </div>

        {/* GDPR consent */}
        <div className="flex flex-col gap-2 border-t-2 border-brand-black/10 pt-6">
          <label className="flex items-start gap-3 font-body text-sm text-brand-black leading-relaxed">
            <input
              type="checkbox"
              name="consent"
              checked={form.consent}
              onChange={(e) => update("consent", e.target.checked)}
              className="mt-1 accent-brand-tangerine"
              aria-invalid={Boolean(errors.consent)}
              required
            />
            <span>
              I consent to Lex Almeida storing and processing the details above so my request can be
              answered. I can withdraw consent at any time.{" "}
              <a
                href={privacyHref}
                className="underline underline-offset-4 decoration-brand-black/40 hover:text-brand-tangerine hover:decoration-brand-tangerine"
              >
                Privacy policy
              </a>
              . *
            </span>
          </label>
          {errors.consent && <p className={errorClass}>{errors.consent}</p>}
        </div>

        {submitError && (
          <div className="border-2 border-[#c1400f] bg-[#c1400f]/5 px-5 py-4">
            <p className={errorClass}>{submitError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center border-2 border-brand-black bg-brand-black text-brand-linen font-body text-xs uppercase tracking-[0.12em] px-10 py-4 transition-colors hover:bg-brand-tangerine hover:border-brand-tangerine focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-tangerine focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-40 disabled:pointer-events-none"
        >
          {status === "sending" ? "Sending..." : "Send request"}
        </button>
      </form>
    </section>
  );
}
