# 07 — Analytics

**Basic analytics is included in the Starter Package.**

---

## What is included

### Vercel Analytics

Vercel Analytics is the primary analytics tool for this package. It requires
one line of code and zero cookie consent under the ePrivacy Directive because
it does not use cookies or fingerprinting.

Install:

```bash
pnpm add @vercel/analytics
```

Add to `app/layout.tsx`:

```tsx
import { Analytics } from "@vercel/analytics/react";

// Inside RootLayout, as the last child of <body>:
<Analytics />
```

Enable in the Vercel project dashboard: Project Settings → Analytics → Enable.

**What it tracks:** Page views, unique visitors, referrers, countries, devices,
OS. No events, no funnels, no custom goals.

**What it does not track:** Form submissions, button clicks, booking
completions. For those, use Vercel Speed Insights or add custom events in
a later phase.

### Vercel Speed Insights

Tracks real-user Core Web Vitals (LCP, CLS, INP). Zero config. No cookies.

```bash
pnpm add @vercel/speed-insights
```

```tsx
import { SpeedInsights } from "@vercel/speed-insights/next";

// Alongside <Analytics /> in layout.tsx
<SpeedInsights />
```

---

## Google Search Console

Not an analytics tool in the traditional sense, but essential for understanding
organic search performance.

1. Add property at https://search.google.com/search-console
2. Verify via DNS TXT record (Vercel domain settings)
3. Submit sitemap: `https://CLIENT-DOMAIN/sitemap.xml`
4. Check weekly for the first month after launch:
   - Crawl errors
   - Index coverage
   - Core Web Vitals (field data)
   - Top queries (after ~2 weeks of data)

---

## Google Analytics 4

GA4 is included in the Starter Package. It requires a cookie consent banner
because GA4 uses analytics cookies (`_ga`, `_ga_*`) — consent is required
under the ePrivacy Directive before any GA4 cookie is set.

See `11-analytics-tracking.md` for the full implementation.

### Setup

1. Create a GA4 property at https://analytics.google.com
2. Copy the Measurement ID (starts with `G-`)
3. Add `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` to `.env.local` and Vercel env vars
4. The `GoogleAnalytics` component from `@next/third-parties/google` is loaded
   conditionally — only after the visitor accepts analytics cookies
5. The `CookieConsentBanner` component handles consent collection

### CTA event tracking

Every CTA button that is meaningful to the conversion funnel fires a
`trackEvent()` call with a consistent `event_label`. See `11-analytics-tracking.md`
for the full list of tracked events.

### Conversion tracking

The booking form redirects to `/thank-you` (locale-aware) on successful
submission. Mark `booking_complete` as a conversion event in GA4. This gives
the client a real-time conversion count in their GA4 dashboard.

### What requires Growth tier or separate agreement

- Meta Pixel / Facebook Pixel
- Hotjar or session recording tools
- Conversion tracking tied to ad spend
- Server-side event tracking (GA4 Measurement Protocol)

If a client requests any of the above, escalate to Growth tier pricing.

---

## Analytics the client will have access to

After launch, the client can view:

| Data | Where |
|---|---|
| Site visitors, page views, referrers | Vercel Analytics dashboard |
| Core Web Vitals, performance | Vercel Speed Insights |
| Search impressions, click-through rates | Google Search Console |
| Bookings, cancellations, no-shows | Cal.com dashboard |
| Email open rates, delivery rates | Resend dashboard |
