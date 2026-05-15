# 11 — Analytics, CTA Tracking, and Conversion

**GA4, cookie consent, event tracking on all CTAs, and the thank-you conversion page.**

---

## What is required

The Starter Package includes basic analytics. This document defines the full
implementation:

- Vercel Analytics (cookieless, no consent required)
- Vercel Speed Insights (Core Web Vitals, cookieless)
- Google Analytics 4 (requires cookie consent under GDPR)
- CTA event tracking on every clickable element that matters to the business
- Cookie consent banner (required before GA4 fires)
- `/thank-you` locale-aware redirect page (conversion tracking destination)

---

## Package installation

```bash
pnpm add @vercel/analytics @vercel/speed-insights
```

GA4 is loaded via `@next/third-parties/google` — this is already bundled with
Next.js 15 and requires no separate installation.

---

## Environment variable

Add to `.env.local` and to Vercel environment variables (Production + Preview):

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Get the GA4 Measurement ID from the Google Analytics dashboard after creating
the property. The ID always starts with `G-`.

---

## Vercel Analytics and Speed Insights

These are cookieless and require no consent banner. Add them unconditionally
to the locale layout:

```tsx
// app/[locale]/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

// Inside the layout return, as the last two children of <body>:
<Analytics />
<SpeedInsights />
```

Enable both in the Vercel project dashboard under Project → Analytics.

---

## Google Analytics 4

GA4 uses cookies (`_ga`, `_ga_*`) and is therefore an analytics cookie under
the ePrivacy Directive. It must only fire after the visitor has granted consent.

### Loading GA4 conditionally

Use `@next/third-parties/google` `GoogleAnalytics` component, but render it
only after consent is granted. Do not load it unconditionally in the layout.

```tsx
// app/[locale]/layout.tsx
'use client' — this part must be in a client component

import { GoogleAnalytics } from '@next/third-parties/google'
import { useConsent } from '@/app/hooks/useConsent'

export function AnalyticsLoader() {
  const { analyticsConsented } = useConsent()
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  if (!analyticsConsented || !gaId) return null
  return <GoogleAnalytics gaId={gaId} />
}
```

Render `<AnalyticsLoader />` in the locale layout body. It renders nothing
until consent is given.

### `useConsent` hook

```ts
// app/hooks/useConsent.ts
'use client'

import { useState, useEffect } from 'react'

const CONSENT_COOKIE = 'COOKIE_CONSENT'

export type ConsentState = 'accepted' | 'declined' | null

export function useConsent() {
  const [state, setState] = useState<ConsentState>(null)

  useEffect(() => {
    const raw = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${CONSENT_COOKIE}=`))
      ?.split('=')[1]
    if (raw === 'accepted' || raw === 'declined') setState(raw)
  }, [])

  function accept() {
    document.cookie = `${CONSENT_COOKIE}=accepted;max-age=${60 * 60 * 24 * 365};path=/;samesite=lax`
    setState('accepted')
  }

  function decline() {
    document.cookie = `${CONSENT_COOKIE}=declined;max-age=${60 * 60 * 24 * 365};path=/;samesite=lax`
    setState('declined')
  }

  return {
    consentState: state,
    analyticsConsented: state === 'accepted',
    accept,
    decline,
  }
}
```

---

## Cookie consent banner

The banner must appear on first visit before any analytics cookie fires. It
must not appear if the visitor has already made a choice.

### Component: `CookieConsentBanner.tsx`

```tsx
// app/components/shared/CookieConsentBanner.tsx
'use client'

import { useConsent } from '@/app/hooks/useConsent'
import type { ContentSchema } from '@/app/content'

interface Props {
  content: ContentSchema['cookieConsent']
}

export function CookieConsentBanner({ content }: Props) {
  const { consentState, accept, decline } = useConsent()

  if (consentState !== null) return null

  return (
    <div
      role="dialog"
      aria-label={content.ariaLabel}
      className="fixed bottom-0 left-0 right-0 z-50 bg-ink text-mist border-t border-sage/20 px-4 py-4 md:px-6 md:py-5"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-mist/80 max-w-prose">
          {content.body}{' '}
          <a href="/legal/cookies" className="underline underline-offset-2">
            {content.learnMoreLabel}
          </a>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={decline}
            className="px-4 py-2 text-xs border border-sage/40 rounded text-mist/70 hover:border-sage transition-colors"
          >
            {content.declineLabel}
          </button>
          <button
            type="button"
            onClick={accept}
            className="px-4 py-2 text-xs bg-terracotta text-white rounded hover:bg-terracotta/90 transition-colors"
          >
            {content.acceptLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
```

### Content keys to add to `en.ts`

```ts
cookieConsent: {
  ariaLabel: "Cookie consent",
  body: "We use cookies to understand how visitors use this site. Analytics cookies are optional.",
  learnMoreLabel: "Learn more",
  declineLabel: "Decline",
  acceptLabel: "Accept",
},
```

Translate this block fully into `pt.ts` and `de.ts`.

### Render in `app/[locale]/page.tsx`

```tsx
<CookieConsentBanner content={content.cookieConsent} />
```

---

## CTA event tracking

Every CTA that represents a meaningful business action must fire a GA4 event
when clicked. Use a shared `trackEvent` helper.

### Helper: `app/lib/analytics.ts`

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

Extend `Window` for TypeScript:

```ts
// app/types/gtag.d.ts
declare global {
  interface Window {
    gtag: (
      command: string,
      target: string,
      params?: Record<string, unknown>
    ) => void
  }
}
```

### Events to track

Every button and link that moves a visitor toward a booking must call
`trackEvent`. Use consistent `event_category` and `event_label` values so
GA4 reports are readable.

| Element | Event name | label |
|---|---|---|
| Hero primary CTA "Book a free consultation" | `cta_click` | `hero_primary` |
| Hero secondary CTA "See how it works" | `cta_click` | `hero_secondary` |
| Nav "Book a consultation" button | `cta_click` | `nav_book` |
| WhatsApp floating button | `cta_click` | `whatsapp_float` |
| Hero WhatsApp link | `cta_click` | `hero_whatsapp` |
| Pricing tier CTA (each tier) | `cta_click` | `pricing_cta_[tier]` |
| ClosingCTA primary button | `cta_click` | `closing_cta_primary` |
| ClosingCTA WhatsApp link | `cta_click` | `closing_cta_whatsapp` |
| Booking form: Step 1 — service selected | `booking_step_1` | `consultation` or `session` |
| Booking form: Step 4 — slot selected | `booking_step_4` | `slot_selected` |
| Booking form: Step 6 — submit | `booking_submit` | `consultation` or `session` |
| Booking form: Step 6 — success | `booking_complete` | `consultation` or `session` |
| Language switcher — language changed | `language_switch` | `en`, `pt`, or `de` |

All events should also include `event_category: 'engagement'` in the params
object.

### Example usage in a Hero button

```tsx
<button
  onClick={() => {
    trackEvent('cta_click', { event_category: 'engagement', event_label: 'hero_primary' })
    // then perform the navigation / scroll
  }}
>
  {content.hero.primaryCta}
</button>
```

---

## Thank-you page (conversion destination)

The booking form does not show an inline success message. On successful booking,
it redirects to `/thank-you` (locale-prefixed: `/pt/thank-you`, `/de/thank-you`
for non-English visitors). This makes conversions trackable as a GA4 destination
goal.

### File: `app/[locale]/thank-you/page.tsx`

```tsx
import { type Locale, isValidLocale, DEFAULT_LOCALE } from '@/app/lib/locale'
import { getContent } from '@/app/content'
import { Nav } from '@/app/components/landing/Nav'
import { FooterGutter } from '@/app/components/landing/FooterGutter'

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale: Locale = isValidLocale(localeParam) ? localeParam : DEFAULT_LOCALE
  const content = getContent(locale)

  return (
    <>
      <Nav content={content.nav} locale={locale} />
      <main className="min-h-screen bg-mist flex items-center justify-center px-4">
        <div className="max-w-xl text-center py-24">
          <p className="text-sm font-mono text-terracotta mb-4">
            {content.thankYou.preheading}
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-ink mb-6">
            {content.thankYou.heading}
          </h1>
          <p className="text-base text-olive mb-8">
            {content.thankYou.body}
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-terracotta text-white text-sm rounded hover:bg-terracotta/90 transition-colors"
          >
            {content.thankYou.backLabel}
          </a>
        </div>
      </main>
      <FooterGutter content={content.footer} locale={locale} />
    </>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale: Locale = isValidLocale(localeParam) ? localeParam : DEFAULT_LOCALE
  const content = getContent(locale)

  return {
    title: content.thankYou.metaTitle,
    robots: { index: false, follow: false },  // do not index the thank-you page
  }
}
```

### Content keys to add to `en.ts`

```ts
thankYou: {
  metaTitle: "Booking confirmed — Aura Tattoo & Meaning",
  preheading: "You're all set",
  heading: "We'll be in touch.",
  body: "Your booking request has been sent. Check your email for a confirmation. If you have any questions, reach us on WhatsApp.",
  backLabel: "Back to the site",
},
```

Translate fully into `pt.ts` and `de.ts`.

### GA4 conversion goal setup

After the thank-you page is live:

1. In Google Analytics 4 → Reports → Events, confirm `booking_complete` events
   are firing
2. In GA4 → Configure → Conversions, mark `booking_complete` as a conversion
   event
3. Optionally create a destination-based goal: visits to `/thank-you` (any
   locale prefix) as a backup conversion signal

### Redirect from booking form

In `Step6Confirmation.tsx`, on successful API response:

```ts
import { useRouter } from 'next/navigation'

const router = useRouter()

// after trackEvent('booking_complete', ...)
const localePath = locale === 'en' ? '' : `/${locale}`
router.push(`${localePath}/thank-you`)
```

---

## Cookie classification (complete table)

| Cookie | Name | Purpose | Classification | Consent required | Max age |
|---|---|---|---|---|---|
| Language preference | `NEXT_LOCALE` | Stores user's language choice | Functional | No | 1 year |
| Cookie consent record | `COOKIE_CONSENT` | Records consent choice | Strictly necessary | No | 1 year |
| Google Analytics | `_ga`, `_ga_*` | User behaviour analytics | Analytics | Yes | 2 years |

The `COOKIE_CONSENT` cookie itself requires no consent — it is the mechanism
by which the visitor's choice is stored. Without it, the banner would reappear
on every page load.

---

## Legal page update — `/legal/cookies`

The cookies page must be updated to list all three cookie categories with
accurate names, purposes, and max ages. See the table above. The language
preference cookie and consent cookie should be listed under "Functional — always
active". GA4 cookies under "Analytics — optional, requires consent".

---

## Vercel Analytics dashboard

After the domain is live and analytics is enabled:

- Page views and unique visitors appear in Vercel → Analytics
- Speed Insights shows real-user Core Web Vitals under Vercel → Speed Insights
- No code changes required — Vercel captures these automatically
- These are separate from GA4 — both can run simultaneously
