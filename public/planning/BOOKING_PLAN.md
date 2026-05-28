# Aura Tattoo, Booking System Implementation Plan

**Project:** pt-c-aura-web  
**Scope:** Booking system, multi-step form, email flows, WhatsApp integration  
**Stack:** Next.js 15 (App Router), TypeScript, Tailwind v4, Cal.com API v2  
**Date:** 2026-05-10

---

## 1. Overview

This document covers everything needed to implement the Portugal Tattoo **Starter Package** features on the Aura Tattoo & Meaning site. The Starter Package includes a professional landing page funnel, lead capture, AI-ready booking integration, deposit flow, email confirmations and reminders, and client self-service.

The immediate scope (pre-AI) is:

- Multi-step booking form embedded in the landing page as the primary CTA
- Cal.com API v2 integration for consultation and tattoo session slot selection
- WhatsApp floating button (already scaffolded, requires env var)
- HTML email templates for all booking lifecycle events
- Server-side API routes to proxy Cal.com and trigger emails

---

## 2. Current Codebase State

### What exists

| Area | Status |
|---|---|
| Landing page components (Hero, Nav, Gallery, Pricing, etc.) | Done |
| `WhatsAppFloatingButton` component | Done, needs `NEXT_PUBLIC_WHATSAPP_URL` set |
| `app/content/en.ts` content system | Done |
| Brand tokens (terracotta, sage, blush, olive, ink, mist) | Done |
| Fonts (Poppins body, Cormorant Garamond display, Geist mono) | Done |
| `public/html/` directory | Created, empty |

### What is missing

| Area | Status |
|---|---|
| `BookingForm` multi-step component | Not started |
| `BookingSection` wrapper on page | Not started |
| Cal.com event type setup | Not started |
| `/api/cal/slots` route | Not started |
| `/api/cal/book` route | Not started |
| `/api/webhooks/cal` route | Not started |
| `/api/email/send` route | Not started |
| Email templates in `public/html/` | Not started |
| Booking content block in `en.ts` | Not started |
| Environment variables | Not started |

---

## 3. Cal.com Setup (External, Manual Steps)

Before any code, set up two event types in Cal.com:

### Event type 1, Free Consultation

| Field | Value |
|---|---|
| Title | Free Consultation |
| Slug | `consultation` |
| Duration | 20 minutes |
| Description | Free 20-minute consultation. In person or video. Available in EN, PT, ES. |
| Location | In-person (Albufeira) or Google Meet |
| Requires confirmation | No, instant confirm |
| Buffer after | 10 minutes |
| Min notice | 24 hours |
| Booking questions | Name, email, phone, preferred language, tattoo idea (textarea), reference images (file upload optional) |
| Deposit | Not required |

### Event type 2, Tattoo Session

| Field | Value |
|---|---|
| Title | Tattoo Session |
| Slug | `tattoo-session` |
| Duration | 60 / 120 / 180 / 240 minutes (multi-duration) |
| Description | Custom tattoo session at Aura Tattoo & Meaning, Albufeira. |
| Location | In person (Albufeira studio) |
| Requires confirmation | Yes, manual review before confirm |
| Min notice | 48 hours |
| Booking questions | Name, email, phone, preferred language, placement, size category, style, description, reference images |
| Deposit | 30%, collected via Stripe integration in Cal.com |

### Cal.com API key

Create an API key in Cal.com Settings → Developer → API Keys. Use a dedicated key scoped to booking reads + writes. Store as `CAL_API_KEY` (server-only).

Get your username and event type slugs, used in the slots API call.

---

## 4. Environment Variables

Add to `.env.local`:

```
# Cal.com
CAL_API_KEY=                        # Server-only. Cal.com API key.
CAL_USERNAME=                       # Cal.com username (e.g. aura-tattoo)
CAL_CONSULTATION_EVENT_SLUG=consultation
CAL_SESSION_EVENT_SLUG=tattoo-session
CAL_API_VERSION=2024-09-04          # Required header value

# Email (Resend)
RESEND_API_KEY=                     # Server-only.
EMAIL_FROM=bookings@auratattoo.pt   # Must be a verified sender domain in Resend
EMAIL_REPLY_TO=hello@auratattoo.pt

# WhatsApp (already used by WhatsAppFloatingButton)
NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/351XXXXXXXXX

# Cal.com webhook secret (for verifying inbound webhooks)
CAL_WEBHOOK_SECRET=
```

---

## 5. Multi-Step Booking Form

### Placement in page

The form lives in a new `<BookingSection>` inserted between `<HowItWorks>` and `<Promotions>` in `app/page.tsx`. The Hero CTA (`#booking`) already scrolls to this anchor.

### Component location

```
app/components/booking/
  BookingSection.tsx       ← section wrapper (max-w-7xl, id="booking")
  BookingForm.tsx          ← orchestrator with step state
  steps/
    Step1ServiceType.tsx   ← choose consultation or session
    Step2Artist.tsx        ← choose artist (or no preference)
    Step3Details.tsx       ← tattoo details + reference
    Step4SlotPicker.tsx    ← cal.com slots calendar
    Step5PersonalInfo.tsx  ← name, email, phone, language
    Step6Confirmation.tsx  ← summary + submit (deposit note for sessions)
  components/
    StepIndicator.tsx      ← step dots / progress bar
    SlotCalendar.tsx       ← week view slot grid
    TimeSlotButton.tsx     ← individual slot chip
```

### Step breakdown

#### Step 1, Service type

Two cards: "Free Consultation" and "Tattoo Session". Selecting one sets the event slug used in subsequent API calls. No back button on this step.

Fields stored: `serviceType: 'consultation' | 'tattoo-session'`

#### Step 2, Artist preference

Three options: Sofia Martins, Marco Alves, No preference. Selecting an artist narrows available slots to their calendar (if using Cal.com team/round-robin setup) or passes the artist as metadata.

Fields stored: `artistPreference: string`

#### Step 3, Session details

This step is conditional:

- If `consultation`: show a single textarea "Tell us your idea" and an optional file upload for reference images (max 3, JPEG/PNG, 5 MB each).
- If `tattoo-session`: show style selector (fine line, blackwork, geometric, dotwork, illustrative, other), size category (small <5 cm / medium 5–15 cm / large 15 cm+), placement input, a detailed description textarea, and the same file upload.

Fields stored: `style`, `size`, `placement`, `description`, `references[]`

#### Step 4, Slot picker

Fetches available slots from `/api/cal/slots` using the event slug and a sliding 4-week window starting from today. Renders a date selector and a grid of time slots for the selected date. Time zone is detected from the browser (`Intl.DateTimeFormat().resolvedOptions().timeZone`) and passed to the API.

Cal.com API call (proxied server-side):

```
GET https://api.cal.com/v2/slots/available
  ?eventTypeSlug={slug}
  &username={CAL_USERNAME}
  &start={todayISO}
  &end={fourWeeksISO}
  &timeZone={userTZ}
  &format=range
Headers:
  Authorization: Bearer {CAL_API_KEY}
  cal-api-version: 2024-09-04
```

Response shape (format=range):

```json
{
  "data": {
    "slots": {
      "2026-05-12": [
        { "start": "2026-05-12T10:00:00+01:00", "end": "2026-05-12T10:20:00+01:00" }
      ]
    }
  }
}
```

Slots are grouped by date in the calendar. If a date has no slots it is greyed out. Loading state uses a skeleton grid matching the slot button layout.

Fields stored: `selectedSlot: { start: string, end: string }`

#### Step 5, Personal information

Fields: first name, last name, email, phone (with country prefix, default +351), preferred language (EN / PT / ES).

Validation: email format, phone minimum 8 digits, all required except language (default EN).

Fields stored: `firstName`, `lastName`, `email`, `phone`, `language`

#### Step 6, Review and confirm

Summary card listing service type, artist, date/time in the user's local timezone, and (for sessions) the pricing tier and deposit amount. A checkbox acknowledges the deposit and cancellation policy. A primary button labelled "Confirm booking" submits to `/api/cal/book`.

On success: show inline success state (no redirect) with confirmation reference number and "We'll send a confirmation to your email" message.

On error: show an inline error with a fallback WhatsApp link.

### Form state management

Use React `useState` with a typed `BookingFormState` object. No external state library needed. Validation per-step using native HTML constraint API + custom checks before advancing.

### Layout

`BookingSection` uses `max-w-7xl mx-auto` and a two-column layout on desktop: left column (40%) is a sticky summary panel showing the current selection context, right column (60%) holds the form steps. On mobile it collapses to single column with the summary panel hidden until Step 6.

---

## 6. API Routes

### `GET /api/cal/slots`

Proxies the Cal.com slots API. Never exposes `CAL_API_KEY` to the client.

```ts
// app/api/cal/slots/route.ts
// Query params: eventSlug, start, end, timeZone
// Returns: { slots: Record<string, { start: string, end: string }[]> }
```

### `POST /api/cal/book`

Creates a Cal.com booking. Accepts the full form payload and maps it to the Cal.com v2 bookings API body.

```ts
// app/api/cal/book/route.ts
// Body: BookingFormState
// On success: returns { bookingUid, meetingUrl?, start, end }
// Also triggers confirmation email via Resend
```

Cal.com create booking endpoint:

```
POST https://api.cal.com/v2/bookings
Headers:
  Authorization: Bearer {CAL_API_KEY}
  cal-api-version: 2024-09-04
  Content-Type: application/json

Body:
{
  "eventTypeSlug": "consultation",
  "username": "{CAL_USERNAME}",
  "start": "2026-05-12T10:00:00Z",
  "attendee": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "timeZone": "Europe/Lisbon",
    "language": "en"
  },
  "guests": [],
  "metadata": {
    "artistPreference": "Sofia Martins",
    "language": "en",
    "tattooIdea": "A botanical sleeve with roses...",
    "style": "fine-line",
    "size": "medium",
    "placement": "forearm"
  }
}
```

### `POST /api/webhooks/cal`

Receives Cal.com webhook events and triggers email sends:

| Event | Email triggered |
|---|---|
| `BOOKING_CREATED` | Confirmation email |
| `BOOKING_CONFIRMED` (after manual review for sessions) | Confirmation email + deposit request |
| `BOOKING_CANCELLED` | Cancellation email |
| `BOOKING_RESCHEDULED` | Reschedule confirmation email |
| Cron 24h before | Reminder email |
| Cron 2h before | Same-day reminder email |

Verify the webhook signature using `CAL_WEBHOOK_SECRET` before processing.

### `POST /api/email/send`

Internal route (not publicly callable) used by other API routes to send templated emails via Resend.

```ts
// app/api/email/send/route.ts
// Body: { template: EmailTemplate, to: string, data: Record<string, string> }
// Reads HTML from public/html/{template}.html, interpolates {{variables}}, sends via Resend
```

---

## 7. Email Templates

All templates live in `public/html/` as self-contained HTML files. They use table-based layouts for maximum email client compatibility. Brand colours match the site: `#cc7d47` (terracotta), `#262b26` (ink), `#fbf7f1` (mist), `#807045` (olive). Body font is Arial (email-safe fallback for Poppins).

Template variables use `{{double_curly_braces}}` for server-side interpolation.

### Template list

| File | Trigger | Description |
|---|---|---|
| `booking-confirmation.html` | Immediately after booking created | Confirms slot, date, time, location, what to expect |
| `booking-confirmed-session.html` | After manual review approval (sessions) | Confirms session, deposit amount, payment link |
| `deposit-received.html` | After deposit payment confirmed | Receipt with session details |
| `reminder-24h.html` | 24 hours before appointment | Date, time, location, prep notes |
| `reminder-2h.html` | 2 hours before appointment | Short reminder, address, parking |
| `aftercare-guide.html` | Sent same day as session, 3 hours after end time | Aftercare instructions, healing timeline |
| `review-request.html` | Sent 14 days after session | Thank you + link to Google Review |
| `cancellation.html` | On booking cancelled | Acknowledges cancellation, refund/transfer policy |
| `reschedule-confirmation.html` | On booking rescheduled | New date/time confirmation |
| `consultation-followup.html` | Sent 48h after consultation if no session booked | Soft follow-up with session CTA |

### Shared template variables

All templates receive:

```
{{client_first_name}}
{{service_type}}      , "Free Consultation" or "Tattoo Session"
{{artist_name}}
{{date}}              , e.g. "Tuesday, 12 May 2026"
{{time}}              , e.g. "10:00 AM (WEST)"
{{booking_reference}} , Cal.com booking uid (truncated)
{{studio_address}}    , Aura Tattoo & Meaning, Albufeira, Algarve
{{whatsapp_link}}     , wa.me link for questions
{{cancel_link}}       , Cal.com self-service cancel URL
{{reschedule_link}}   , Cal.com self-service reschedule URL
```

### Design system for emails

Header: white background, centred Aura logotype in `#262b26`, 1px border-bottom in `#e3d6c2`.  
Body: `#fbf7f1` background, max-width 600px centred, 32px horizontal padding.  
Primary button: `#cc7d47` background, white text, 6px border-radius, 48px height.  
Dividers: 1px solid `#e3d6c2`.  
Footer: `#262b26` background, white text, studio address, social links, unsubscribe link.  
Font stack: `'Poppins', Arial, sans-serif`, Poppins loaded via Google Fonts `<link>` at top of each template for clients that support webfonts.

---

## 8. WhatsApp Floating Button

Already implemented in `app/components/shared/WhatsAppFloatingButton.tsx`. Reads `NEXT_PUBLIC_WHATSAPP_URL` from env. Returns `null` if not set (safe for dev).

**Action required:** Set `NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/351XXXXXXXXX` in `.env.local` and Vercel environment variables.

No code changes needed to the component itself.

---

## 9. Dependencies to Install

```bash
pnpm add resend         # Transactional email
pnpm add react-icons    # Already used by WhatsAppFloatingButton
```

No Cal.com SDK is needed, the API is consumed directly via `fetch` in server-side route handlers.

Optional (for file uploads in Step 3):

```bash
pnpm add @uploadthing/react uploadthing   # Or use a presigned S3 URL approach
```

---

## 10. File and Folder Changes

### New files to create

```
app/
  api/
    cal/
      slots/route.ts
      book/route.ts
    webhooks/
      cal/route.ts
    email/
      send/route.ts
  components/
    booking/
      BookingSection.tsx
      BookingForm.tsx
      steps/
        Step1ServiceType.tsx
        Step2Artist.tsx
        Step3Details.tsx
        Step4SlotPicker.tsx
        Step5PersonalInfo.tsx
        Step6Confirmation.tsx
      components/
        StepIndicator.tsx
        SlotCalendar.tsx
        TimeSlotButton.tsx
  lib/
    cal.ts          ← typed wrappers for Cal.com API calls
    email.ts        ← email send helper using Resend
    types/
      booking.ts    ← BookingFormState, CalSlot, CalBooking types
public/
  html/
    booking-confirmation.html
    booking-confirmed-session.html
    deposit-received.html
    reminder-24h.html
    reminder-2h.html
    aftercare-guide.html
    review-request.html
    cancellation.html
    reschedule-confirmation.html
    consultation-followup.html
```

### Modified files

| File | Change |
|---|---|
| `app/page.tsx` | Import `BookingSection`, insert between `HowItWorks` and `Promotions` |
| `app/content/en.ts` | Add `booking` content block (labels, step titles, field placeholders, error messages) |
| `.env.local` | Add all booking-related env vars (see section 4) |

---

## 11. Content to Add to `en.ts`

A new `booking` block covering:

- Section preheading, heading, subheading
- Step titles and descriptions for all 6 steps
- All form field labels and placeholder text
- Validation error messages
- Artist names and specialties (already in `artists` block, reference rather than duplicate)
- Style options list
- Size category labels
- Success and error state copy
- Deposit policy notice copy
- Cancellation policy short copy

---

## 12. Page Integration

In `app/page.tsx`, the `BookingSection` is inserted after `HowItWorks`:

```tsx
<RevealOnScroll>
  <HowItWorks />
</RevealOnScroll>
<BookingSection />        {/* No RevealOnScroll wrapper, form must be instantly interactive */}
<Promotions />
```

The Hero component already has `href="#booking"` on its primary CTA. No Hero changes needed. The Pricing component's "Book a free consultation" link should also point to `#booking`.

---

## 13. Accessibility and UX Notes

- Each form step is wrapped in a `<fieldset>` with a `<legend>` for screen reader navigation.
- Focus moves to the first interactive element of each new step on advance (use `useEffect` + `ref.focus()`).
- All form inputs have visible `<label>` elements, never placeholder-only.
- Error messages use `role="alert"` and `aria-describedby` on the associated input.
- The slot calendar uses `role="grid"` with `aria-label` on each slot button including the formatted time.
- The deposit checkbox requires explicit user action, cannot be pre-checked.
- Loading states disable the submit/advance button and show a spinner inside it.
- The `NEXT_PUBLIC_WHATSAPP_URL` fallback is shown on error states in Step 6.

---

## 14. Implementation Order

1. Environment variables, `.env.local` setup
2. Cal.com event types, manual setup in Cal.com dashboard
3. `app/lib/cal.ts`, typed API wrappers
4. `/api/cal/slots` route, test with curl
5. `/api/cal/book` route, test with a real booking
6. `/api/webhooks/cal` route, set up webhook in Cal.com dashboard, test signature verification
7. Email templates, all 10 HTML files in `public/html/`
8. `app/lib/email.ts` + `/api/email/send`, test with Resend sandbox
9. `BookingForm` component, Steps 1–6
10. `BookingSection`, wrapper with layout
11. Page integration, insert `BookingSection` into `page.tsx`
12. Content additions to `en.ts`
13. WhatsApp env var, set `NEXT_PUBLIC_WHATSAPP_URL`
14. End-to-end test, full booking flow for both consultation and session types
15. Vercel env vars, add all env vars to production project settings
16. Deploy and smoke test

---

## 15. Out of Scope (Next Phase)

The following Starter Package features are explicitly deferred:

- **AI chatbot**, deferred. Floating button UI shell can be added later as a `ChatWidget` component in the same pattern as `WhatsAppFloatingButton`.
- **Deposit payment UI**, handled by Cal.com's native Stripe integration. No custom payment page needed for MVP.
- **Client self-service portal**, Cal.com generates cancel/reschedule links automatically and includes them in all confirmation emails.
- **CRM integration**, bookings land in Cal.com natively. Export to Airtable or Notion can be added later via a webhook handler.
- **Analytics**, Vercel Analytics can be enabled in one line. Deferred until post-launch.
- **Portuguese and Spanish content**, `en.ts` architecture supports this. Add `pt.ts` and `es.ts` in a second phase.

---

## Sources

- [Cal.com API v2, Get available time slots](https://cal.com/docs/api-reference/v2/slots/get-available-time-slots-for-an-event-type)
- [Cal.com API essentials, Rollout guide](https://rollout.com/integration-guides/cal.com/api-essentials)
- [Portugal Tattoo, Starter Package](https://www.portugaltattoo.com/en)
