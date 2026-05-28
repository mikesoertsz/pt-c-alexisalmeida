# Lex Almeida, Starter Package Delivery Plan

**Client:** Alexis "Lex" Almeida, lextattoo.com  
**Package:** Starter (website + booking + automation)  
**Agency:** Drifter / PortugalTattoo.com  
**Reference benchmark:** auratattoomeaning.com  
**Last updated:** 2026-05-18

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Done and working |
| 🔧 | Built but needs wire-up or fix |
| ⏳ | In progress |
| ❌ | Not started |
| 🔒 | Blocked on client action |

---

## Phase 1, Launch Blockers

Everything in this phase must be resolved before the site goes live at lextattoo.com.

### 1.1 Missing UI sections

| Task | Status | File / Notes |
|------|--------|--------------|
| FAQ section, populate `faq.items` in `en.ts`, `pt.ts`, `de.ts` | ❌ | `src/content/en.ts`, `items: []` is empty |
| FAQ component, create `src/features/marketing/components/FAQ.tsx` | ❌ | Mirror Aura's 9-question format; add to HomeLanding |
| Contact / location section, address, hours, Google Maps link | ❌ | New component; add below FAQ in HomeLanding |
| WhatsApp floating button, render it on every page | 🔧 | Component exists at `src/components/organisms/WhatsAppFloatingButton/` but is NOT rendered in HomeLanding or any layout |
| Language switcher, add to SiteNav desktop and mobile menus | 🔧 | `src/components/molecules/LanguageSwitcher/LanguageSwitcher.tsx` exists but is not imported in `SiteNav.tsx` |
| Instagram icon link, add to SiteNav using `nav.socialInstagramUrl` | 🔧 | Value is in `en.ts` (`/alexis.tattoo.art/`) but SiteNav doesn't render it |

### 1.2 Technical must-haves

| Task | Status | File / Notes |
|------|--------|--------------|
| `src/app/robots.ts`, create robots file | ❌ | Disallow `/thank-you`, allow everything else |
| Open Graph / structured data image | ✅ | Client file `NEXT_PUBLIC_OG_IMAGE_PATH` default `/img/gallery/gallery-461.webp` (`src/config/branding.ts`) |
| Complete structured data, add `telephone`, `openingHoursSpecification`, `image`, `geo` | ❌ | `src/app/[locale]/(marketing)/page.tsx` jsonLd block |
| Validate structured data | ❌ | https://validator.schema.org |

### 1.3 Environment and infrastructure

| Task | Status | Owner |
|------|--------|-------|
| Create `.env.local` with all required keys | 🔒 | Agency after client provides credentials |
| Set all env vars in Vercel project dashboard | 🔒 | Agency |
| Confirm `NEXT_PUBLIC_WHATSAPP_URL` is set (WhatsApp FAB returns null without it) | 🔒 | Agency |
| Confirm Cal.com username (`lextattoo`, to be verified with client) | 🔒 | Client |
| Connect custom domain `lextattoo.com` to Vercel project | 🔒 | Agency / Registrar |

---

## Phase 2, Booking System

The `BookingSection` currently opens `https://cal.com/lextattoo` in a new tab. This phase replaces it with a functional booking experience that captures deposits.

### 2.1 Cal.com setup (client action, done in Cal.com dashboard)

| Task | Status |
|------|--------|
| Create Cal.com account or confirm existing account for Lex | 🔒 |
| Confirm username is `lextattoo` | 🔒 |
| Create event: **Free Consultation** (slug `consultation`, 20 min, no deposit, instant confirm) | 🔒 |
| Create event: **Tattoo Session** (slug `tattoo-session`, 60/120/180/240 min, manual confirm, 30% Stripe deposit) | 🔒 |
| Connect Stripe to Cal.com, Apps → Stripe | 🔒 |
| Set availability / working hours | 🔒 |
| Create Cal.com API key → copy to `CAL_API_KEY` | 🔒 |
| Create Cal.com webhook → `https://lextattoo.com/api/webhooks/cal`; events: `BOOKING_CREATED`, `BOOKING_CONFIRMED`, `BOOKING_CANCELLED`, `BOOKING_RESCHEDULED`; copy secret to `CAL_WEBHOOK_SECRET` | 🔒 |

**Booking questions to add for Tattoo Session:**
- Phone number
- Preferred language (EN / PT / DE)
- Style (fine line / blackwork / dark art / neo-traditional / other)
- Size category (small ≤5 cm / medium 5–15 cm / large 15 cm+)
- Placement on body
- Tattoo description (textarea)
- Reference images (file upload)

**Booking questions to add for Consultation:**
- Phone number
- Preferred language (EN / PT / DE)
- Tattoo concept (textarea)

### 2.2 Cal.com embed (quickest path to live booking)

Embed Cal.com's native widget inside `BookingSection` using `@calcom/embed-react`. This replaces the tab-opening link with an inline calendar, no custom API routes needed.

| Task | Status | File |
|------|--------|------|
| `pnpm add @calcom/embed-react` | ❌ | |
| Update `BookingSection.tsx` to render `<Cal calLink="lextattoo/consultation" />` inline | ❌ | `src/features/marketing/components/BookingSection.tsx` |
| Style embed to match dark brand, use Cal.com theme config (`theme: 'dark'`, brand colour `#F2EEE8`) | ❌ | |
| Add `trackEvent('booking_open', ...)` when embed becomes visible | ❌ | |

### 2.3 API-backed booking (full flow, enables custom emails and analytics)

Build after the embed is live. Enables custom email triggers and deposit tracking.

| Task | Status | File |
|------|--------|------|
| Create `src/lib/cal.ts`, typed fetch wrappers for Cal.com API v2 (`getAvailableSlots`, `createBooking`) | ❌ | |
| Create `src/app/api/cal/slots/route.ts`, GET handler, forwards to Cal.com | ❌ | |
| Create `src/app/api/cal/book/route.ts`, POST handler, creates booking, sends confirmation email | ❌ | |
| Create `src/app/api/webhooks/cal/route.ts`, POST handler, verifies HMAC signature, routes to email sends | ❌ | |
| Create `src/lib/types/booking.ts`, `BookingFormState`, `CalSlot`, `CalSlotsResponse`, `CalBookingResponse` | ❌ | |

---

## Phase 3, Starter Package Automation

### 3.1 Transactional email (Resend)

| Task | Status | Owner |
|------|--------|-------|
| Create Resend account and verify `lextattoo.com` sending domain | 🔒 | Agency |
| Create API key → copy to `RESEND_API_KEY` | 🔒 | Agency |
| Confirm `bookings@lextattoo.com` is a valid address | 🔒 | Client / Registrar |
| Create `src/lib/email.ts`, token-replace HTML template helper using Resend | ❌ | |

**Email templates to create in `public/html/`:**

| Template | Trigger | Status |
|----------|---------|--------|
| `booking-confirmation.html` | Cal.com webhook `BOOKING_CREATED` | ❌ |
| `booking-confirmed-session.html` | Cal.com webhook `BOOKING_CONFIRMED` | ❌ |
| `deposit-received.html` | Stripe webhook (via Cal.com) | ❌ |
| `reminder-24h.html` | Cal.com reminder or cron | ❌ |
| `reminder-2h.html` | Cal.com reminder or cron | ❌ |
| `aftercare-guide.html` | Sent 2 hours after session ends | ❌ |
| `review-request.html` | Sent 7 days post-session | ❌ |
| `cancellation.html` | Cal.com webhook `BOOKING_CANCELLED` | ❌ |
| `reschedule-confirmation.html` | Cal.com webhook `BOOKING_RESCHEDULED` | ❌ |
| `consultation-followup.html` | Sent 48 hours after consultation | ❌ |

**All templates:** dark brand, max-width 600px, Cormorant Garamond headings, no external CSS, all variables in `{{double_curly_braces}}`.

### 3.2 AI chatbot (package deliverable, deferred post-launch)

The Starter package includes an AI chatbot for customer enquiries. Planned implementation: floating chat widget powered by a system-prompted Claude API call, scoped to Lex's studio knowledge base (style, process, pricing, availability, FAQ). No Supabase dependency required for MVP.

| Task | Status |
|------|--------|
| Design chatbot scope and knowledge base | ❌ |
| Build `/api/chat` streaming route using Claude API | ❌ |
| Build floating chat widget component | ❌ |
| Wire to HomeLanding | ❌ |

---

## Phase 4, Analytics & SEO

| Task | Status | Notes |
|------|--------|-------|
| Enable Vercel Analytics in dashboard, Project → Analytics | 🔒 | Agency |
| Enable Vercel Speed Insights in dashboard | 🔒 | Agency |
| Create `src/app/robots.ts` | ❌ | |
| Open Graph image via client asset (`/img/gallery/…` or env) | ✅ | |
| Add `booking_complete` GA4 conversion, GA4 → Configure → Conversions | 🔒 | Agency after GA4 property is live |
| Complete jsonLd structured data in `page.tsx` | ❌ | Add telephone, geo, openingHours, image |
| Validate structured data at schema.org | ❌ | |
| Confirm hreflang tags in Google Search Console after deploy | 🔒 | Agency |
| Lighthouse score ≥ 85 mobile | ❌ | Run in Chrome incognito on production URL |
| LCP < 2.5s, CLS < 0.1 (PageSpeed Insights) | ❌ | |
| OG image validated in Facebook Sharing Debugger | ❌ | |
| Add CTA tracking events to Hero, Nav, Pricing, ClosingCTA | ❌ | See `TASKS.md` Phase 9 for full event list |

---

## Phase 5, Content & QA

### 5.1 Content to populate (agency + client)

| Item | Status | Notes |
|------|--------|-------|
| FAQ questions and answers, minimum 8 items | 🔒 | Client provides Q&A; agency writes copy in brand voice |
| Confirm Google Maps link for studio at Rua do Paraíso 82 | 🔒 | Client confirms address is current |
| Confirm studio hours (for Contact section and structured data) | 🔒 | Client |
| Review all 7 testimonials, confirm client approves their use | 🔒 | Client written sign-off |
| Confirm pricing tiers and deposit policy in writing | 🔒 | Client |
| Confirm `NEXT_PUBLIC_WHATSAPP_URL` phone number | 🔒 | Client, currently +351 934 613 635 |

### 5.2 Translation review

| Item | Status |
|------|--------|
| Portuguese strings reviewed by native PT speaker | 🔒 |
| German strings reviewed by native DE speaker ("Sie" register) | 🔒 |
| Deposit policy and FAQ copy legally accurate in all three languages | 🔒 |

### 5.3 Legal page sign-off

| Page | Status |
|------|--------|
| Terms & Conditions | 🔒 Client written sign-off required |
| Privacy Policy | 🔒 Client written sign-off required |
| Refunds Policy | 🔒 Client written sign-off required |
| GDPR / Data Processing | 🔒 Client written sign-off required |
| Cookies Policy | 🔒 Client written sign-off required |

### 5.4 Pre-launch QA checklist

| Check | Status |
|-------|--------|
| All routes return 200: `/`, `/pt`, `/de`, `/thank-you`, `/pt/thank-you`, `/de/thank-you` | ❌ |
| All five legal page footer links load without 404 | ❌ |
| Cookie consent banner appears on first visit, disappears after choice, does not reappear | ❌ |
| Accept consent → GA4 fires `page_view` (verify in GA4 DebugView) | ❌ |
| Decline consent → GA4 never loads (check Network tab) | ❌ |
| Language switcher changes URL and persists cookie | ❌ |
| Mobile hamburger menu opens and all links scroll correctly | ❌ |
| Hero CTA scrolls to `#booking` | ❌ |
| Nav "Book a consultation" scrolls to `#booking` | ❌ |
| WhatsApp floating button visible and dials correct number | ❌ |
| Full booking flow tested end-to-end (consultation + session) on production URL | ❌ |
| Confirmation email arrives within 2 minutes of booking | ❌ |
| Cal.com dashboard shows test bookings | ❌ |
| No console errors in any locale | ❌ |
| Client sign-off recorded | 🔒 |

---

## Phase 6, Deferred / Growth Tier

These items are out of scope for the Starter package MVP but are noted here for the Growth retainer roadmap.

| Item | Notes |
|------|-------|
| Paid ads setup (Meta + Google) | Service, not a build task, handled by Growth retainer |
| Meta Pixel and Google Tag installation | Part of ads setup |
| Email marketing automation sequences | Post-launch; requires client email list |
| Supabase CMS integration (contact form submissions, inquiry log) | Planned in `docs/PLAN_PUBLIC_SITE.md` Phase A |
| Multi-step booking wizard with custom UI | Replaces Cal.com embed if client needs more control |
| Review request automation (7-day post-session) | Requires email automation platform |
| Referral programme | See `docs/` promotions doc |

---

## Client Actions Required

The following cannot be done by the agency and are blocking delivery. Client should action within 5 business days of receiving this plan.

| Action | Blocks |
|--------|--------|
| Confirm or create Cal.com account (username `lextattoo`) | Booking system |
| Set availability / working hours in Cal.com | Booking system |
| Connect Stripe to Cal.com | Deposit collection |
| Confirm WhatsApp number (+351 934 613 635) | WhatsApp FAB |
| Confirm studio address and operating hours | Contact section, structured data |
| Provide GA4 Measurement ID (or approve agency creating property) | Analytics |
| Sign off all five legal pages in writing | Legal compliance |
| Approve testimonial use in writing | Testimonials section |
| Confirm pricing tiers and deposit policy | Pricing section |
| Provide FAQ questions and answers (minimum 8) | FAQ section |
| Confirm `bookings@lextattoo.com` is set up or approve alternative sending address | Email automation |

---

## Definition of Done, Starter Package

The site is considered delivered when all of the following are true:

- [ ] Site is live at `lextattoo.com` with SSL
- [ ] All three locale routes (`/`, `/pt`, `/de`) return 200 with correct content
- [ ] FAQ section live with minimum 8 client-approved questions
- [ ] Contact section live with correct address, hours, and Google Maps link
- [ ] WhatsApp floating button live and dialling the correct number
- [ ] Language switcher functional (EN / PT / DE)
- [ ] Cookie consent banner functional; GA4 fires only on acceptance
- [ ] Booking system live, client can take consultation and session bookings via Cal.com
- [ ] 30% deposit collected automatically via Stripe for Tattoo Session bookings
- [ ] Booking confirmation email arrives within 2 minutes of booking creation
- [ ] 24h and 2h reminder emails are configured in Cal.com or via webhook
- [ ] All five legal pages live and client sign-off recorded
- [ ] OG image renders correctly in social sharing debuggers
- [ ] Lighthouse mobile score ≥ 85 on production URL
- [ ] Structured data validates at schema.org
- [ ] Vercel Analytics and Speed Insights enabled
- [ ] `booking_complete` GA4 conversion event confirmed in GA4 DebugView
- [ ] Client written sign-off received and filed
