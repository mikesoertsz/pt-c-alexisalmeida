# Aura Tattoo — Implementation Tasks

Work through these tasks in order. Each section depends on the one before it.
Do not skip ahead. Check each box only when the feature is working end-to-end,
not just when the code is written.

---

## Phase 0 — Codebase fixes (no dependencies)

These are wrong today and must be fixed before building anything new on top.

- [ ] Rename `app/components/landing/PainPoints.tsx` → `app/components/landing/WhyAura.tsx`
- [ ] Update the import in `app/page.tsx` from `PainPoints` to `WhyAura`
- [ ] Remove the `<Promotions />` import and render from `app/page.tsx` (component returns null, no reason to import it)
- [ ] Remove `id="booking"` from `ClosingCTA` — this anchor will move to the new `BookingSection`
- [ ] Fix the `ClosingCTA` primary CTA `href` — currently points to `https://cal.com` (the generic homepage). Change it to `href="#booking"` as a scroll-to-form link until the full booking form is in place
- [ ] Confirm `nav.about` content key in `en.ts` is not linked anywhere in the Nav component. If no About section will exist at launch, remove the `about` key from `en.ts`

---

## Phase 1 — Environment and configuration

Must be done before any API routes or email sending can be tested.

- [ ] Create `.env.local` with the following keys (values from client onboarding):

```
NEXT_PUBLIC_BASE_URL=https://CLIENT-DOMAIN
NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/351XXXXXXXXX
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

CAL_API_KEY=
CAL_USERNAME=
CAL_CONSULTATION_EVENT_SLUG=consultation
CAL_SESSION_EVENT_SLUG=tattoo-session
CAL_WEBHOOK_SECRET=
CAL_API_VERSION=2024-09-04

RESEND_API_KEY=
EMAIL_FROM=bookings@CLIENT-DOMAIN
EMAIL_REPLY_TO=hello@CLIENT-DOMAIN
```

- [ ] Set `NEXT_PUBLIC_WHATSAPP_URL` — confirm the `WhatsAppFloatingButton` is now visible in the browser (it returns null when the var is empty)
- [ ] Add all env vars to Vercel project: Settings → Environment Variables. Server-only vars (`CAL_API_KEY`, `CAL_WEBHOOK_SECRET`, `RESEND_API_KEY`) set to Production only. `NEXT_PUBLIC_*` vars set to Production + Preview.

### Cal.com setup (manual — done in Cal.com dashboard)

- [ ] Create Cal.com account or confirm existing account for client
- [ ] Note the Cal.com username — this is `CAL_USERNAME`
- [ ] Create event type: **Free Consultation**
  - Slug: `consultation`
  - Duration: 20 minutes
  - Location: In-person (studio address) or Google Meet
  - Requires confirmation: No (instant confirm)
  - Min notice: 24 hours
  - Buffer after event: 10 minutes
  - Booking questions: name (auto), email (auto), phone (add), preferred language (dropdown: EN/PT/DE), tattoo idea (textarea)
- [ ] Create event type: **Tattoo Session**
  - Slug: `tattoo-session`
  - Duration: Multiple — 60 / 120 / 180 / 240 minutes
  - Location: In person (studio address)
  - Requires confirmation: Yes (manual review)
  - Min notice: 48 hours
  - Buffer after event: 15 minutes
  - Booking questions: name (auto), email (auto), phone (add), preferred language (EN/PT/DE), style, size category, placement, description, reference images
  - Stripe deposit: enabled at 30%
- [ ] Connect Stripe to Cal.com (Cal.com dashboard → Apps → Stripe)
- [ ] Set artist availability / working hours in Cal.com
- [ ] Create a Cal.com API key: Settings → Developer → API Keys. Copy into `CAL_API_KEY`
- [ ] Create a Cal.com webhook pointing to `https://CLIENT-DOMAIN/api/webhooks/cal`. Events to subscribe: `BOOKING_CREATED`, `BOOKING_CONFIRMED`, `BOOKING_CANCELLED`, `BOOKING_RESCHEDULED`. Copy the webhook secret into `CAL_WEBHOOK_SECRET`.

### Resend setup (manual — done in Resend dashboard)

- [ ] Create Resend account or confirm existing
- [ ] Add and verify the client's sending domain (e.g. `auratattoo.pt`)
- [ ] Create API key, copy into `RESEND_API_KEY`
- [ ] Confirm `bookings@CLIENT-DOMAIN` is a valid address

---

## Phase 2 — Type definitions and lib utilities

Write these before any components or routes — they are imported everywhere.

- [ ] Create `app/lib/types/booking.ts` with the following exported types:

```ts
export type ServiceType = 'consultation' | 'tattoo-session'
export type TattooStyle = 'fine-line' | 'blackwork' | 'geometric' | 'dotwork' | 'illustrative' | 'other'
export type TattooSize = 'small' | 'medium' | 'large'

export interface BookingFormState {
  step: 1 | 2 | 3 | 4 | 5 | 6
  serviceType: ServiceType | null
  artistPreference: string | null   // artist name or 'no-preference'
  style: TattooStyle | null         // session only
  size: TattooSize | null           // session only
  placement: string                 // session only
  description: string
  references: File[]
  selectedSlot: CalSlot | null
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface CalSlot {
  start: string   // ISO 8601
  end: string     // ISO 8601
}

export interface CalSlotsResponse {
  data: {
    slots: Record<string, CalSlot[]>  // key is YYYY-MM-DD
  }
}

export interface CalBookingResponse {
  data: {
    uid: string
    title: string
    start: string
    end: string
    meetingUrl?: string
    status: string
  }
}
```

- [x] Create `app/lib/locale.ts` with locale constants, type, and utilities:

```ts
export const LOCALES = ['en', 'pt', 'de'] as const
export type Locale = typeof LOCALES[number]
export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_COOKIE = 'NEXT_LOCALE'
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365  // 1 year

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  pt: 'Português',
  de: 'Deutsch',
}

export const LOCALE_SHORT: Record<Locale, string> = {
  en: 'EN',
  pt: 'PT',
  de: 'DE',
}

export function isValidLocale(value: unknown): value is Locale {
  return LOCALES.includes(value as Locale)
}

export function resolveLocaleFromHeader(acceptLanguage: string): Locale {
  const preferred = acceptLanguage.split(',').map(l => l.split(';')[0].trim().toLowerCase())
  for (const lang of preferred) {
    if (lang.startsWith('pt')) return 'pt'
    if (lang.startsWith('de')) return 'de'
    if (lang.startsWith('en')) return 'en'
  }
  return DEFAULT_LOCALE
}
```

- [ ] Create `app/lib/cal.ts` — typed fetch wrappers for Cal.com API v2:

```ts
// getAvailableSlots(eventSlug, start, end, timeZone) → CalSlotsResponse
// createBooking(payload) → CalBookingResponse
// All calls set headers: Authorization: Bearer ${CAL_API_KEY}, cal-api-version: ${CAL_API_VERSION}
// Base URL: https://api.cal.com/v2
// Server-only functions — use process.env directly, no NEXT_PUBLIC prefix
```

- [ ] Create `app/lib/email.ts` — email send helper:

```ts
// sendEmail(template: string, to: string, variables: Record<string, string>) → Promise<void>
// Reads /public/html/{template}.html
// Replaces all {{variable}} tokens with values from the variables object
// Sends via Resend using RESEND_API_KEY, EMAIL_FROM, EMAIL_REPLY_TO env vars
```

- [x] Create `app/lib/analytics.ts` — GA4 event helper:

```ts
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number>
) {
  if (typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return
  window.gtag('event', eventName, params)
}
```

- [x] Create `app/types/gtag.d.ts` — Window.gtag type declaration:

```ts
declare global {
  interface Window {
    gtag: (command: string, target: string, params?: Record<string, unknown>) => void
  }
}
```

- [x] Create `app/hooks/useConsent.ts` — cookie consent hook (see `11-analytics-tracking.md` for full code)

---

## Phase 3 — i18n routing and content system

Build this before the page structure changes — the locale-aware layout and
content system must exist before components receive props.

See `10-i18n.md` for all implementation details.

- [x] Create `middleware.ts` at the project root (locale detection and redirect — full code in `10-i18n.md`)
- [x] Create `app/content/` folder with `index.ts`, `en.ts`, `pt.ts`, `de.ts`
  - `en.ts`: rename existing content export to `export const en = { ... }` — source of truth
  - `index.ts`: exports `ContentSchema` type and `getContent(locale)` helper
  - `pt.ts`: full Portuguese translation — every key matching `en.ts`
  - `de.ts`: full German translation — use formal "Sie" throughout
- [x] Move `app/page.tsx` → `app/[locale]/page.tsx`
  - Accept `params: Promise<{ locale: string }>` (Next.js 15 pattern — must `await params`)
  - Resolve locale, call `getContent(locale)`, pass content slices as props to all section components
- [x] Add `generateStaticParams` and analytics wrappers under `app/[locale]/layout.tsx`; keep root `app/layout.tsx` with `<html lang>` driven by middleware `x-locale` header (URLs stay unprefixed for English)
- [x] Add `export async function generateMetadata` to `app/[locale]/page.tsx` with full hreflang including `x-default` (see `10-i18n.md`)
- [x] Update all landing section components to receive content as props (not import `en` directly)
  - `Nav.tsx` — receives `content.nav` and `locale`
  - `Hero.tsx` — receives `content.hero` and `content.whatsapp`
  - `SocialProof.tsx` — receives `content.socialProof`
  - `Gallery.tsx` — receives `content.gallery`
  - `Artists.tsx` — receives `content.artists`
  - `WhyAura.tsx` — receives `content.whyUs`
  - `HowItWorks.tsx` — receives `content.howItWorks`
  - `Pricing.tsx` — receives `content.pricing`
  - `Testimonials.tsx` — receives `content.testimonials`
  - `FAQ.tsx` — receives `content.faq`
  - `ClosingCTA.tsx` — receives `content.closingCta` and `content.whatsapp`
  - `FooterGutter.tsx` — receives `content.footer` and `locale`
- [x] Create `app/components/shared/LanguageSwitcher.tsx` (full code in `10-i18n.md`)
  - Replaces the cosmetic `EN` button in `Nav.tsx`
  - Uses `router.push()` and `document.cookie` to switch locale and persist preference
  - Active locale shown with `bg-terracotta text-white`
- [x] Update the `NEXT_LOCALE` cookie classification in `/legal/cookies` — list as functional, always active, no consent required
- [x] Update `app/sitemap.ts` to include all locale variants of every page (see `10-i18n.md`)

### Translation quality check

- [ ] Have all Portuguese strings reviewed by a native PT speaker before launch
- [ ] Have all German strings reviewed by a native DE speaker before launch
- [ ] Verify deposit policy and FAQ copy is legally accurate in all three languages
- [ ] Confirm formal register throughout DE copy ("Sie" not "du")

---

## Phase 4 — Cookie consent and analytics

- [x] Run `pnpm add @vercel/analytics @vercel/speed-insights` (completed with `npm install` in this repo)
- [x] Create `app/components/shared/CookieConsentBanner.tsx` (full code in `11-analytics-tracking.md`)
  - Reads `COOKIE_CONSENT` cookie on mount via `useConsent` hook
  - Accept button: sets `COOKIE_CONSENT=accepted`, hides banner, enables GA4
  - Decline button: sets `COOKIE_CONSENT=declined`, hides banner, GA4 never loads
  - Banner does not appear if consent is already recorded
- [x] Add `cookieConsent` content block to `en.ts`, `pt.ts`, `de.ts`
- [x] Create `app/components/analytics/AnalyticsLoader.tsx` client component
  - Uses `useConsent()` to check `analyticsConsented`
  - Renders `<GoogleAnalytics gaId={gaId} />` only when consent is granted and `NEXT_PUBLIC_GA_ID` is set
- [x] Import and render `<Analytics />` and `<SpeedInsights />` in `app/[locale]/layout.tsx` — these are cookieless and always active
- [x] Import and render `<AnalyticsLoader />` in `app/[locale]/layout.tsx`
- [x] Import and render `<CookieConsentBanner content={content.cookieConsent} />` in `app/[locale]/page.tsx`
- [ ] Enable Vercel Analytics in Vercel dashboard: Project → Analytics → Enable
- [ ] Enable Vercel Speed Insights in Vercel dashboard: Project → Speed Insights → Enable

---

## Phase 5 — API routes

Write and test each route independently before wiring up the form.

### `/api/cal/slots`

- [ ] Create `app/api/cal/slots/route.ts`
  - Method: GET
  - Query params: `eventSlug`, `start`, `end`, `timeZone`
  - Calls `getAvailableSlots` from `app/lib/cal.ts`
  - Returns the `CalSlotsResponse` data to the client
  - Returns 400 if required params missing, 500 on Cal.com error
- [ ] Test: `curl "http://localhost:3000/api/cal/slots?eventSlug=consultation&start=2026-05-12&end=2026-06-09&timeZone=Europe/Lisbon"` — should return real slot data from Cal.com

### `/api/cal/book`

- [ ] Create `app/api/cal/book/route.ts`
  - Method: POST
  - Body: `BookingFormState` (minus `step` and `references` — files handled separately)
  - Maps form state to Cal.com v2 booking payload
  - On success: calls `sendEmail('booking-confirmation', ...)`, returns `{ bookingUid, start, end }`
  - On error: returns 500 with `{ error: string }`
- [ ] Test: POST a valid consultation booking payload, confirm it appears in Cal.com dashboard and confirmation email arrives

### `/api/webhooks/cal`

- [ ] Create `app/api/webhooks/cal/route.ts`
  - Method: POST
  - Verify `X-Cal-Signature-256` header against `CAL_WEBHOOK_SECRET` using HMAC-SHA256. Return 401 if invalid.
  - Route to email send by `triggerEvent`:
    - `BOOKING_CREATED` → `booking-confirmation`
    - `BOOKING_CONFIRMED` → `booking-confirmed-session`
    - `BOOKING_CANCELLED` → `cancellation`
    - `BOOKING_RESCHEDULED` → `reschedule-confirmation`
  - Return 200 immediately — do not block on email success
- [ ] Test: Use Cal.com webhook test feature to fire a `BOOKING_CREATED` event and confirm the email sends

---

## Phase 6 — Email templates

Create all 10 HTML email templates in `public/html/`. Each is a self-contained
HTML file using table-based layout. No external CSS — everything inline.

### Design system for all templates

- Background: `#fbf7f1` (mist)
- Max-width: 600px, centred
- Header: white bg, studio name in `#262b26`, 1px bottom border `#e3d6c2`
- Body padding: 32px horizontal
- Primary button: `#cc7d47` bg, white text, 6px border-radius
- Footer: `#262b26` bg, white text, studio address + WhatsApp + unsubscribe
- Font: `'Poppins', Arial, sans-serif`
- All variable tokens: `{{double_curly_braces}}`

### Templates to create

- [ ] `public/html/booking-confirmation.html`
- [ ] `public/html/booking-confirmed-session.html`
- [ ] `public/html/deposit-received.html`
- [ ] `public/html/reminder-24h.html`
- [ ] `public/html/reminder-2h.html`
- [ ] `public/html/aftercare-guide.html`
- [ ] `public/html/review-request.html`
- [ ] `public/html/cancellation.html`
- [ ] `public/html/reschedule-confirmation.html`
- [ ] `public/html/consultation-followup.html`

See `03-email-templates.md` for subject lines, triggers, variables, and tone for each template.

### After all templates are created

- [ ] Test all 10 templates in Gmail (web)
- [ ] Test all 10 templates in Apple Mail
- [ ] Test all 10 templates in Outlook (test account or Litmus)
- [ ] Confirm no `{{variable}}` tokens appear in sent emails (all replaced)
- [ ] Confirm unsubscribe link in footer works

---

## Phase 7 — Booking form components

Build the form after the API routes are working. Do not build the UI before
the backend exists — you need real slot data to build the slot picker against.

### Content block in content files

- [ ] Add a `booking` block to `app/content/en.ts`:
  - Note: the `language` dropdown options must be `{ en: "English", pt: "Português", de: "Deutsch" }` — not Spanish
- [ ] Add the full `booking` block translated to `app/content/pt.ts`
- [ ] Add the full `booking` block translated to `app/content/de.ts`

### Component files to create

- [ ] Create `app/components/booking/BookingSection.tsx`
  - `id="booking"`, `scroll-mt-16`, `bg-mist`
  - `max-w-7xl mx-auto` inner container
  - Two-column at `lg:` breakpoint (40% sticky context panel, 60% form)
  - Receives content and locale as props

- [ ] Create `app/components/booking/BookingForm.tsx`
  - `"use client"`
  - Holds `BookingFormState` in `useState`
  - `advanceStep()` validates current step before advancing
  - Fires `trackEvent('booking_step_1', ...)`, `trackEvent('booking_submit', ...)`, `trackEvent('booking_complete', ...)` at the correct moments
  - On success: calls `router.push(localePath + '/thank-you')` — does NOT show inline success

- [ ] Create `app/components/booking/components/StepIndicator.tsx`
  - 6-step indicator, accessible `aria-label="Step N of 6"`

- [ ] Create `app/components/booking/steps/Step1ServiceType.tsx`
  - Two selectable cards: Consultation / Tattoo Session
  - Fires `trackEvent('booking_step_1', { event_label: serviceType })`

- [ ] Create `app/components/booking/steps/Step2Artist.tsx`
  - One card per artist plus "No preference"
  - Auto-skips if only one artist

- [ ] Create `app/components/booking/steps/Step3Details.tsx`
  - Conditional fields based on `serviceType`
  - Consultation: description + optional references
  - Session: style selector, size selector, placement, description, references

- [ ] Create `app/components/booking/steps/Step4SlotPicker.tsx`
  - `"use client"` — fetches `/api/cal/slots` on mount
  - Fires `trackEvent('booking_step_4', { event_label: 'slot_selected' })` on slot selection
  - Loading, error, no-slots states all handled

- [ ] Create `app/components/booking/components/TimeSlotButton.tsx`

- [ ] Create `app/components/booking/steps/Step5PersonalInfo.tsx`
  - Phone default prefix `+351`
  - Language: toggle buttons EN / PT / DE (three options — not four)

- [ ] Create `app/components/booking/steps/Step6Confirmation.tsx`
  - Fires `trackEvent('booking_submit', ...)` on submit button click
  - On API success: fires `trackEvent('booking_complete', ...)` then redirects to `/thank-you`
  - On API error: shows `booking.errorBody` and WhatsApp link

### After all booking components are created

- [ ] Add `BookingSection` to `app/[locale]/page.tsx` between `HowItWorks` and `Pricing`
- [ ] Verify Hero primary CTA scrolls to `#booking` correctly
- [ ] Verify Nav "Book a consultation" CTA scrolls to `#booking` correctly
- [ ] Verify Pricing "Book a free consultation" link scrolls to `#booking` correctly
- [ ] Submit a real consultation test booking end-to-end
- [ ] Submit a real session test booking end-to-end including deposit payment
- [ ] Confirm both test bookings appear in Cal.com dashboard
- [ ] Confirm confirmation emails arrive for both

---

## Phase 8 — Thank-you conversion page

- [x] Create `app/[locale]/thank-you/page.tsx` (full code in `11-analytics-tracking.md`)
  - Locale-aware (reads `params.locale`, calls `getContent(locale)`)
  - `robots: { index: false }` — do not index the thank-you page
  - Renders `Nav`, a centred confirmation block, and `FooterGutter`
- [x] Add `thankYou` content block — implemented as copy in `app/[locale]/legal/copy.ts`
- [ ] Verify the page loads at `/thank-you`, `/pt/thank-you`, and `/de/thank-you`
- [ ] Add the thank-you page to GA4 conversions: GA4 → Configure → Conversions → mark `booking_complete` event as a conversion
- [ ] Confirm the booking form redirects correctly to the locale-prefixed thank-you URL on success

---

## Phase 9 — CTA event tracking

Add `trackEvent()` calls to every CTA that matters to the conversion funnel.
Import `trackEvent` from `app/lib/analytics.ts`.

- [ ] Hero primary CTA → `trackEvent('cta_click', { event_category: 'engagement', event_label: 'hero_primary' })`
- [ ] Hero secondary CTA → `event_label: 'hero_secondary'`
- [ ] Hero WhatsApp link → `event_label: 'hero_whatsapp'`
- [ ] Nav "Book a consultation" button → `event_label: 'nav_book'`
- [ ] WhatsApp floating button → `event_label: 'whatsapp_float'`
- [ ] Pricing tier CTAs → `event_label: 'pricing_cta_small'`, `'pricing_cta_medium'`, `'pricing_cta_large'`
- [ ] ClosingCTA primary button → `event_label: 'closing_cta_primary'`
- [ ] ClosingCTA WhatsApp link → `event_label: 'closing_cta_whatsapp'`
- [x] Language switcher changes → `trackEvent('language_switch', { event_label: nextLocale })`
- [ ] All booking form milestones (in BookingForm.tsx) — see Phase 7

---

## Phase 10 — SEO and meta

- [ ] Create `/public/og-image.jpg` — 1200×630px
- [ ] Update structured data in `app/[locale]/page.tsx` — add `url`, `telephone`, `address.streetAddress`, `address.postalCode`, `geo.latitude`, `geo.longitude`, `openingHoursSpecification`, `image`
- [x] Fix `availableLanguage` in structured data to `["English", "Portuguese", "German"]` — not Spanish
- [x] Update sitemap in `app/sitemap.ts` to cover all three locale variants × all pages (see `10-i18n.md`)
- [ ] Create `app/robots.ts`
- [ ] Update meta description in `app/[locale]/page.tsx` with client's actual specialties
- [ ] Confirm all gallery images have descriptive `alt` text
- [ ] Confirm all artist photos have `alt` text in the format "[Name], tattoo artist at [Studio]"
- [ ] Validate structured data at https://validator.schema.org

---

## Phase 11 — Legal pages

- [x] Create `app/[locale]/legal/layout.tsx` — **superseded by** `LegalDocumentFrame.tsx`
- [x] Create `app/[locale]/legal/terms/page.tsx`
- [x] Create `app/[locale]/legal/privacy/page.tsx`
- [x] Create `app/[locale]/legal/refunds/page.tsx`
- [x] Create `app/[locale]/legal/gdpr/page.tsx`
- [x] Create `app/[locale]/legal/cookies/page.tsx`
- [ ] Click all five footer links on the live dev server and confirm they load without 404
- [ ] All five legal pages client-reviewed and signed off in writing

---

## Phase 12 — Content (client-supplied)

These tasks block on the client providing assets. Raise them early in the
onboarding process — do not wait until development is complete.

- [ ] Receive and upload minimum 8 portfolio images → `public/img/gallery/`
- [ ] Update `gallery.items` in `en.ts` with real `src` and `alt` values
- [ ] Receive and upload artist photo(s) → `public/img/artists/`
- [ ] Update `artists.items` in `en.ts` with real image paths, names, bios, Instagram handles
- [ ] Confirm social proof stats with client in writing (`socialProof.stats`)
- [ ] Replace all placeholder testimonials with real, client-confirmed reviews
- [ ] Confirm or update all pricing tiers and notes
- [ ] Confirm or update each FAQ answer — especially deposit policy and minors policy
- [ ] Confirm or update studio comfort items (`whyUs.comforts`) — remove any that do not apply
- [ ] If no studio video: remove `<VideoSection />` from page render
- [ ] If video available: upload to Cloudinary, update `videoSection.videoUrl` and `videoSection.poster`

---

## Phase 13 — Pre-launch verification

Run through `public/planning/09-go-live-checklist.md` line by line.
Do not mark the project as delivered until every Section 1 item is checked.

- [ ] All Section 1 hard blockers cleared
- [ ] Language switcher works correctly in all three locales — EN, PT, DE
- [ ] Cookie consent banner appears on first visit with no prior consent cookie
- [ ] Accepting consent: GA4 loads and fires events
- [ ] Declining consent: GA4 does not load
- [ ] Revisiting the site: banner does not reappear
- [ ] All three locale routes return 200 (`/`, `/pt`, `/de`)
- [ ] `/pt/thank-you` and `/de/thank-you` return 200
- [ ] hreflang tags present on all locale pages, validated in Google Search Console
- [ ] `booking_complete` conversion event visible in GA4
- [ ] Lighthouse score ≥ 85 mobile (Chrome incognito, production URL)
- [ ] LCP under 2.5s on mobile (PageSpeed Insights)
- [ ] CLS under 0.1 (PageSpeed Insights)
- [ ] OG image renders correctly in Facebook Sharing Debugger
- [ ] No console errors on page load in any locale
- [ ] All footer legal links load without 404
- [ ] WhatsApp button visible and opens correct number
- [ ] Full booking flow tested end-to-end (consultation + session) on production URL
- [ ] Client sign-off recorded in `public/planning/09-go-live-checklist.md`
