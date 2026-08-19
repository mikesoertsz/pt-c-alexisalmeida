import { NextResponse } from "next/server";
import {
  BUDGET_RANGES,
  COLOUR_PREFERENCES,
  EXISTING_TATTOOS_OPTIONS,
  INTAKE_ACCEPTED_IMAGE_TYPES,
  INTAKE_MAX_UPLOAD_BYTES,
  labelForValue,
  validateIntake,
  type BookingIntakeFields,
} from "@/features/booking/intake-fields";
import { sendEmail } from "@/lib/email";
import { getLegalEntity } from "@/lib/legal-entity";
import { createServiceClient } from "@/lib/supabase";

export const runtime = "nodejs";

const REFERENCE_BUCKET = process.env.BOOKING_REFERENCE_BUCKET?.trim() || "booking-references";
/** Signed URL lifetime for a reference image: 90 days. */
const REFERENCE_URL_TTL_SECONDS = 60 * 60 * 24 * 90;

const TEXT_FIELDS = [
  "name",
  "email",
  "phoneCountryCode",
  "phoneNumber",
  "tattooIdea",
  "placement",
  "approxSizeCm",
  "style",
  "colourPreference",
  "budgetRange",
  "preferredDates",
  "existingTattoos",
  "consent",
] as const;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function notificationRecipients(): string[] {
  const configured = process.env.BOOKING_NOTIFICATION_EMAIL?.trim();
  if (configured) {
    return configured
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [getLegalEntity().email];
}

/** Uploads the reference image and returns a signed URL, or null when unavailable. */
async function storeReference(
  file: File,
  fields: BookingIntakeFields,
): Promise<{ url: string | null; note: string }> {
  const client = createServiceClient();
  if (!client) {
    return { url: null, note: "Supabase not configured — image was not stored." };
  }

  const extension = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "jpg";
  const safeName = fields.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const objectPath = `${new Date().toISOString().slice(0, 10)}/${Date.now()}-${safeName || "client"}.${extension}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await client.storage
    .from(REFERENCE_BUCKET)
    .upload(objectPath, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return { url: null, note: `Upload failed: ${uploadError.message}` };
  }

  const { data, error: signError } = await client.storage
    .from(REFERENCE_BUCKET)
    .createSignedUrl(objectPath, REFERENCE_URL_TTL_SECONDS);

  if (signError || !data?.signedUrl) {
    return { url: null, note: `Stored at ${REFERENCE_BUCKET}/${objectPath} (no signed URL).` };
  }

  return { url: data.signedUrl, note: `${REFERENCE_BUCKET}/${objectPath}` };
}

function buildNotificationHtml(
  fields: BookingIntakeFields,
  reference: { fileName: string | null; url: string | null; note: string | null },
): string {
  const rows: Array<[string, string]> = [
    ["Name", fields.name],
    ["Email", fields.email],
    ["Phone", fields.phoneFull],
    ["Tattoo idea", fields.tattooIdea],
    ["Placement", fields.placement],
    ["Approximate size (cm)", fields.approxSizeCm],
    ["Style", fields.style],
    ["Colour vs black and grey", labelForValue(COLOUR_PREFERENCES, fields.colourPreference)],
    ["Budget range", labelForValue(BUDGET_RANGES, fields.budgetRange)],
    ["Preferred dates", fields.preferredDates],
    ["Existing tattoos", labelForValue(EXISTING_TATTOOS_OPTIONS, fields.existingTattoos)],
    [
      "Reference image",
      reference.fileName
        ? reference.url
          ? `<a href="${escapeHtml(reference.url)}">${escapeHtml(reference.fileName)}</a>`
          : `${escapeHtml(reference.fileName)} — ${escapeHtml(reference.note ?? "not stored")}`
        : "None supplied",
    ],
    ["GDPR consent", "Given at submission"],
    ["Submitted", new Date().toISOString()],
  ];

  const body = rows
    .map(([label, value]) => {
      // The reference row is pre-escaped because it may contain a link.
      const safeValue = label === "Reference image" ? value : escapeHtml(value).replace(/\n/g, "<br>");
      return `<tr>
        <td style="padding:8px 16px 8px 0;font-family:monospace;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#22222280;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
        <td style="padding:8px 0;font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#222222;">${safeValue}</td>
      </tr>`;
    })
    .join("");

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:32px;background:#FAF3E1;color:#222222;">
    <div style="max-width:640px;margin:0 auto;border:2px solid #222222;background:#ffffff;">
      <div style="border-bottom:2px solid #222222;padding:16px 24px;">
        <p style="margin:0;font-family:monospace;font-size:12px;text-transform:uppercase;letter-spacing:0.12em;color:#22222280;">[ New booking request ]</p>
        <h1 style="margin:6px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:20px;text-transform:uppercase;letter-spacing:-0.02em;">${escapeHtml(fields.name)}</h1>
      </div>
      <table role="presentation" style="width:100%;border-collapse:collapse;padding:24px;">
        <tbody>${body}</tbody>
      </table>
    </div>
  </body>
</html>`;
}

export async function POST(req: Request) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data" }, { status: 400 });
  }

  const raw: Record<string, string> = {};
  for (const key of TEXT_FIELDS) {
    const value = formData.get(key);
    raw[key] = typeof value === "string" ? value : "";
  }

  const parsed = validateIntake(raw);
  if (!parsed.ok) {
    return NextResponse.json(
      { error: "Some fields need attention.", errors: parsed.errors },
      { status: 400 },
    );
  }
  const fields = parsed.fields;

  // ---- optional reference image ------------------------------------------
  const uploaded = formData.get("reference");
  const file = uploaded instanceof File && uploaded.size > 0 ? uploaded : null;

  if (file) {
    if (!(INTAKE_ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported image type.", errors: { reference: "Use a JPG, PNG, WEBP or HEIC image." } },
        { status: 400 },
      );
    }
    if (file.size > INTAKE_MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: "Image too large.", errors: { reference: "Image must be 4 MB or smaller." } },
        { status: 400 },
      );
    }
  }

  let referenceUrl: string | null = null;
  let referenceNote: string | null = null;
  if (file) {
    const stored = await storeReference(file, fields);
    referenceUrl = stored.url;
    referenceNote = stored.note;
  }

  // ---- notification -------------------------------------------------------
  try {
    await sendEmail({
      to: notificationRecipients(),
      subject: `Booking request — ${fields.name} (${fields.placement}, ${fields.approxSizeCm} cm)`,
      html: buildNotificationHtml(fields, {
        fileName: file?.name ?? null,
        url: referenceUrl,
        note: referenceNote,
      }),
      replyTo: fields.email,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Notification failed";
    return NextResponse.json({ error: `Could not send your request: ${message}` }, { status: 502 });
  }

  return NextResponse.json({ ok: true, referenceStored: Boolean(referenceUrl) }, { status: 201 });
}
