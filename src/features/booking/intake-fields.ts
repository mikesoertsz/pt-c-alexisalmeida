/**
 * Shared field definitions for the booking intake form.
 *
 * Imported by both the client component (`BookingIntakeForm`) and the server
 * route (`/api/booking/intake`) so the option lists and validation rules can
 * never drift apart.
 *
 * Field set mirrors the Cal.com booking questions used on
 * auratattoomeaning.com (tattoo idea / placement / style / approximate size),
 * extended with the fields required for Lex's intake (budget, colour vs black
 * and grey, availability, existing tattoos, reference image, GDPR consent).
 */

export const INTAKE_MAX_IDEA_LENGTH = 1000;

/** Max reference upload size in bytes (4 MB — stays under the serverless body cap). */
export const INTAKE_MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export const INTAKE_ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

/** Dial codes for the markets Lex works in (Porto + German guest spots first). */
export const PHONE_COUNTRY_CODES = [
  { code: "+351", label: "Portugal" },
  { code: "+49", label: "Germany" },
  { code: "+34", label: "Spain" },
  { code: "+33", label: "France" },
  { code: "+31", label: "Netherlands" },
  { code: "+41", label: "Switzerland" },
  { code: "+43", label: "Austria" },
  { code: "+44", label: "United Kingdom" },
  { code: "+1", label: "USA / Canada" },
] as const;

export const DEFAULT_PHONE_COUNTRY_CODE = "+351";

export const COLOUR_PREFERENCES = [
  { value: "black-and-grey", label: "Black and grey" },
  { value: "colour", label: "Colour" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const BUDGET_RANGES = [
  { value: "under-300", label: "Under 300 EUR" },
  { value: "300-600", label: "300 - 600 EUR" },
  { value: "600-1000", label: "600 - 1000 EUR" },
  { value: "1000-2000", label: "1000 - 2000 EUR" },
  { value: "2000-plus", label: "2000 EUR and above" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const EXISTING_TATTOOS_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No, this would be my first" },
] as const;

export type ColourPreference = (typeof COLOUR_PREFERENCES)[number]["value"];
export type BudgetRange = (typeof BUDGET_RANGES)[number]["value"];
export type ExistingTattoos = (typeof EXISTING_TATTOOS_OPTIONS)[number]["value"];

/** Parsed and validated intake payload. */
export interface BookingIntakeFields {
  name: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  /** Country code + national number, digits only after the leading `+`. */
  phoneFull: string;
  tattooIdea: string;
  placement: string;
  approxSizeCm: string;
  style: string;
  colourPreference: ColourPreference;
  budgetRange: BudgetRange;
  preferredDates: string;
  existingTattoos: ExistingTattoos;
  consent: true;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/** Pragmatic RFC-5322 subset: local@label(.label)+ with a 2+ char TLD. */
export const EMAIL_PATTERN =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

/** National part of a phone number: 6-14 digits, spaces/dashes/dots/parens allowed. */
export const PHONE_NATIONAL_PATTERN = /^(?:[\s().-]*\d){6,14}[\s().-]*$/;

export const EMAIL_PATTERN_SOURCE = EMAIL_PATTERN.source;
export const PHONE_NATIONAL_PATTERN_SOURCE = PHONE_NATIONAL_PATTERN.source;

export function isValidEmail(value: string): boolean {
  return value.length <= 254 && EMAIL_PATTERN.test(value);
}

export function isValidNationalPhone(value: string): boolean {
  return PHONE_NATIONAL_PATTERN.test(value);
}

export function isValidPhoneCountryCode(value: string): boolean {
  return PHONE_COUNTRY_CODES.some((c) => c.code === value);
}

/** Strips formatting so the stored number is `+<digits>`. */
export function toE164(countryCode: string, nationalNumber: string): string {
  const cc = countryCode.replace(/[^\d]/g, "");
  const national = nationalNumber.replace(/[^\d]/g, "").replace(/^0+/, "");
  return `+${cc}${national}`;
}

export function isColourPreference(value: string): value is ColourPreference {
  return COLOUR_PREFERENCES.some((o) => o.value === value);
}

export function isBudgetRange(value: string): value is BudgetRange {
  return BUDGET_RANGES.some((o) => o.value === value);
}

export function isExistingTattoos(value: string): value is ExistingTattoos {
  return EXISTING_TATTOOS_OPTIONS.some((o) => o.value === value);
}

export function labelForValue(
  options: ReadonlyArray<{ value: string; label: string }>,
  value: string,
): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

/**
 * Validates a raw record of string values.
 * Returns the parsed fields, or a map of field name -> error message.
 */
export function validateIntake(
  raw: Record<string, string>,
): { ok: true; fields: BookingIntakeFields } | { ok: false; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const name = (raw.name ?? "").trim();
  if (name.length < 2) errors.name = "Please enter your name.";
  if (name.length > 120) errors.name = "Name is too long.";

  const email = (raw.email ?? "").trim();
  if (!isValidEmail(email)) errors.email = "Please enter a valid email address.";

  const phoneCountryCode = (raw.phoneCountryCode ?? DEFAULT_PHONE_COUNTRY_CODE).trim();
  if (!isValidPhoneCountryCode(phoneCountryCode)) {
    errors.phoneCountryCode = "Please choose a country code.";
  }

  const phoneNumber = (raw.phoneNumber ?? "").trim();
  if (!isValidNationalPhone(phoneNumber)) {
    errors.phoneNumber = "Please enter a valid phone number (6-14 digits).";
  }

  const tattooIdea = (raw.tattooIdea ?? "").trim();
  if (tattooIdea.length < 10) errors.tattooIdea = "Please describe your idea in a little more detail.";
  if (tattooIdea.length > INTAKE_MAX_IDEA_LENGTH) {
    errors.tattooIdea = `Please keep this under ${INTAKE_MAX_IDEA_LENGTH} characters.`;
  }

  const placement = (raw.placement ?? "").trim();
  if (placement.length < 2) errors.placement = "Please tell us where the tattoo goes.";

  const approxSizeCm = (raw.approxSizeCm ?? "").trim();
  if (!/\d/.test(approxSizeCm)) errors.approxSizeCm = "Please give an approximate size in cm.";

  const style = (raw.style ?? "").trim();
  if (style.length < 2) errors.style = "Please tell us which style you are drawn to.";

  const colourPreference = (raw.colourPreference ?? "").trim();
  if (!isColourPreference(colourPreference)) {
    errors.colourPreference = "Please choose colour or black and grey.";
  }

  const budgetRange = (raw.budgetRange ?? "").trim();
  if (!isBudgetRange(budgetRange)) errors.budgetRange = "Please choose a budget range.";

  const preferredDates = (raw.preferredDates ?? "").trim();
  if (preferredDates.length < 3) errors.preferredDates = "Please share your rough availability.";

  const existingTattoos = (raw.existingTattoos ?? "").trim();
  if (!isExistingTattoos(existingTattoos)) {
    errors.existingTattoos = "Please let us know if you have existing tattoos.";
  }

  const consent = (raw.consent ?? "").trim();
  if (consent !== "true" && consent !== "on") {
    errors.consent = "Please confirm you agree to your details being processed.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    fields: {
      name,
      email,
      phoneCountryCode,
      phoneNumber,
      phoneFull: toE164(phoneCountryCode, phoneNumber),
      tattooIdea,
      placement,
      approxSizeCm,
      style,
      colourPreference: colourPreference as ColourPreference,
      budgetRange: budgetRange as BudgetRange,
      preferredDates,
      existingTattoos: existingTattoos as ExistingTattoos,
      consent: true,
    },
  };
}
