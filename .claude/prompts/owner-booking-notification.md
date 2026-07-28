# Owner Booking Notification via Cal Webhook + Resend

Add an owner notification email that fires whenever Cal.com sends a webhook to this site, so the agency knows when the client gets a booking.

---

## Context

This project already has:

- `src/lib/email.ts` — Resend-based `sendTemplatedEmail()` for client-facing transactional emails
- `src/lib/email-cal-webhook.ts` — helpers: `extractWebhookFields`, `formatSlotForEmail`, `triggerToTemplate`, `subjectForTemplate`
- `src/app/api/webhooks/cal/route.ts` — Cal webhook handler (signature-verified, currently only emails the client)

---

## Implementation

### 1. `src/lib/email.ts` — add a raw `sendEmail()` helper

Add a `sendEmail()` function for sends that don't need a template file:

- Params: `to: string | string[]`, `subject: string`, `html: string`, `replyTo?: string`
- Reads `RESEND_API_KEY` and `EMAIL_FROM` from env, throws if missing
- Uses `new Resend(apiKey).emails.send()`
- Refactor existing `sendTemplatedEmail()` to call `sendEmail()` internally so Resend config is not duplicated

### 2. `src/lib/email-cal-webhook.ts` — append three exports

**`ownerNotifyRecipients(): string[]`**

- Reads `BOOKING_NOTIFY_EMAIL` env var (comma-separated)
- Falls back to `mike@drifter.agency` if unset
- Returns a filtered array of valid email addresses (must contain `@`)

**`triggerLabel(triggerRaw: unknown): string`**

Maps Cal trigger strings to human-readable labels:

| Trigger | Label |
|---|---|
| `BOOKING_CREATED` / `BOOKING_REQUESTED` | `New booking` |
| `BOOKING_CONFIRMED` | `Booking confirmed` |
| `BOOKING_CANCELLED` | `Booking cancelled` |
| `BOOKING_RESCHEDULED` | `Booking rescheduled` |
| `BOOKING_PAID` | `Deposit paid` |
| _(default)_ | `Booking update` |

**`buildOwnerNotification(input): { subject: string; html: string }`**

Input shape:

```ts
{
  label: string;
  clientName: string;
  clientEmail: string | null;
  serviceType: string;
  date: string;
  time: string;
  bookingRef: string;
  manageLink: string;
}
```

- Subject: `${label}: ${clientName} — [Artist Name] Tattoo`
- HTML: a simple branded table email with:
  - Dark header bar with artist name and label badge (tangerine accent)
  - Data rows: Client / Email / Service / Date / Time / Reference
  - Footer links: "Reply to client" (`mailto:`) and "Manage in Cal.com"
  - Footer note: `Automated notification · [Agency Name] / Drifter`
  - Brand colours from the project's design system (linen background `#FAF3E1`, black header `#222`, tangerine accent `#FF6D1F`)
- Use an `escapeHtml()` helper on all interpolated values

### 3. `src/app/api/webhooks/cal/route.ts` — fire the notification before the client email

After parsing the webhook and extracting fields, **before** the client email send:

1. Call `ownerNotifyRecipients()` — if the array is non-empty:
   - Call `buildOwnerNotification()` with the extracted fields
   - Call `sendEmail({ to: recipients, subject, html, replyTo: extracted.email ?? undefined })`
   - Wrap in `try/catch` — log errors but never let a notification failure block the client email
   - Track a `notified: boolean` in the response JSON
2. The existing client email send is unchanged — it still runs after, using the templated system

### 4. `.env.example` — add a documented block

```env
# Transactional + notification email (Resend)
# RESEND_API_KEY=re_...
# EMAIL_FROM=Artist Name Tattoo <bookings@domain.com>   # must be a Resend-verified domain
# Cal.com webhook signature secret (Cal → Settings → Webhooks → Secret). Required in production.
# CAL_WEBHOOK_SECRET=
# Internal booking notification recipients, comma-separated. Defaults to mike@drifter.agency.
# BOOKING_NOTIFY_EMAIL=mike@drifter.agency
# DEFAULT_TIMEZONE=Europe/Lisbon
```

### 5. `.env.local` — add locally (gitignored, do not commit)

```env
RESEND_API_KEY=re_REDACTED_ROTATE_THIS_KEY
EMAIL_FROM=Artist Name Tattoo <onboarding@resend.dev>
BOOKING_NOTIFY_EMAIL=mike@drifter.agency
DEFAULT_TIMEZONE=Europe/Lisbon
```

> `onboarding@resend.dev` is the Resend sandbox sender — only delivers to the account owner's address. Fine for the agency notification. Swap to `bookings@[clientdomain].com` once that domain is verified in Resend.

---

## Verify

Run `npx tsc --noEmit` to confirm no type errors, then simulate a Cal webhook:

```bash
curl -s -X POST http://localhost:[PORT]/api/webhooks/cal \
  -H "Content-Type: application/json" \
  -d '{
    "triggerEvent": "BOOKING_CREATED",
    "payload": {
      "uid": "test-booking-abc123",
      "title": "Free Intake Consultation",
      "startTime": "2026-06-20T10:00:00.000Z",
      "attendees": [
        { "name": "Test Client", "email": "mike@drifter.agency", "timeZone": "Europe/Lisbon" }
      ]
    }
  }'
```

Expected response:

```json
{ "ok": true, "mailed": "booking-confirmation", "notified": true }
```

Then check mike@drifter.agency inbox for the notification email.

---

## Notes

- **Why the webhook and not `/thank-you`:** the redirect is client-side — it won't fire if the user closes the tab or loses connection. The Cal webhook fires server-to-server on the booking itself, so no booking is ever missed.
- **`EMAIL_FROM` domain:** must be verified in Resend for client emails to deliver to arbitrary addresses. Until the client's domain is verified, `onboarding@resend.dev` only delivers to the Resend account owner (mike@drifter.agency) — the agency notification works, client emails don't.
- **`CAL_WEBHOOK_SECRET`:** set in production by registering the webhook in Cal.com (Settings → Webhooks → add `https://[clientdomain]/api/webhooks/cal`, copy the secret). Without it, the handler rejects all webhook calls in production.
- **Shared Resend key:** `re_REDACTED_ROTATE_THIS_KEY` is send-only restricted — safe to share across client projects. Rotate it if ever exposed publicly.
- **Per-project adjustments:** update the artist name and brand colours in `buildOwnerNotification()` to match each client's design system.
