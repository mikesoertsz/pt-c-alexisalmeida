# 09 — Go-Live Checklist

**Nothing ships without every item in Section 1 checked.**

Work through this document top to bottom. If any Section 1 item cannot be
checked, the launch is blocked. Do not negotiate exceptions — these are
minimum viable requirements, not a wish list.

---

## Section 1 — Hard blockers (launch cannot proceed)

### Content

- [ ] All portfolio images uploaded and rendering (minimum 8)
- [ ] All artist photos uploaded and rendering
- [ ] Artist names, bios, and Instagram handles are real and confirmed by client
- [ ] All social proof stats confirmed by client in writing
- [ ] All testimonials are real reviews, confirmed by client in writing
- [ ] Pricing confirmed by client in writing
- [ ] Deposit policy confirmed by client and matches Cal.com event configuration
- [ ] Studio name, address, and contact details are correct throughout the site

### Booking system

- [ ] Cal.com consultation event type live and bookable
- [ ] Cal.com tattoo session event type live and bookable
- [ ] Stripe connected to Cal.com for deposit collection
- [ ] Test consultation booking end-to-end (slot → personal info → confirm)
- [ ] Test tattoo session booking end-to-end including deposit payment
- [ ] Cal.com webhook configured and receiving events
- [ ] `#booking` anchor resolves to the embedded BookingForm section
- [ ] Hero CTA and Nav CTA both scroll to the booking form correctly
- [ ] Slot picker shows real availability, not test data

### Emails

- [ ] Resend sending domain verified
- [ ] Booking confirmation email sends on test booking
- [ ] Reminder email sends correctly (test with a near-future booking)
- [ ] Cancellation email sends on test cancellation
- [ ] All template variables rendering correctly (no `{{placeholder}}` visible)
- [ ] Emails render correctly in Gmail, Apple Mail, and Outlook (test via Litmus
      or Email on Acid, or test accounts)
- [ ] Unsubscribe link in footer is functional

### Legal

- [ ] `/legal/terms` exists and has client-reviewed content
- [ ] `/legal/privacy` exists and has client-reviewed content
- [ ] `/legal/refunds` exists and has client-reviewed content
- [ ] `/legal/gdpr` exists and has client-reviewed content
- [ ] `/legal/cookies` exists and has client-reviewed content
- [ ] Client has signed off on all legal pages in writing

### Technical

- [ ] Custom domain is live with valid SSL certificate
- [ ] `www` redirect is configured correctly
- [ ] `NEXT_PUBLIC_BASE_URL` set to the live domain in Vercel env vars
- [ ] `NEXT_PUBLIC_WHATSAPP_URL` set and WhatsApp button is visible
- [ ] All five env var groups are set in Vercel Production environment
- [ ] No 404 errors in the navigation or footer links
- [ ] No console errors on page load
- [ ] OG image exists at `/public/og-image.jpg` and loads correctly
- [ ] Structured data validates at https://validator.schema.org
- [ ] Sitemap is accessible at `/sitemap.xml`
- [ ] robots.txt is accessible at `/robots.txt`

### Performance

- [ ] Lighthouse score ≥ 85 on mobile (run in Chrome incognito)
- [ ] LCP under 2.5s on mobile (PageSpeed Insights)
- [ ] CLS under 0.1 (PageSpeed Insights)
- [ ] No images missing `width`/`height` (check Next.js build output for
      warnings)

---

## Section 2 — Should be done at launch (not hard blockers)

- [ ] Google Search Console property created and sitemap submitted
- [ ] Vercel Analytics enabled in Vercel dashboard
- [ ] Vercel Speed Insights enabled
- [ ] Cal.com reminder notifications enabled (24h before and 2h before)
- [ ] Client trained on Cal.com dashboard (accepting bookings, managing
      availability, marking sessions complete)
- [ ] Client trained on Resend dashboard (delivery logs, bounce management)
- [ ] Studio video uploaded and rendering in VideoSection (or section removed
      from page)
- [ ] Language switcher removed from Nav (until i18n is implemented)

---

## Section 3 — Post-launch (within first 2 weeks)

- [ ] Verify Google Search Console has no crawl errors after first crawl
- [ ] Check Vercel Analytics is recording visits
- [ ] Confirm first real booking flows correctly end-to-end
- [ ] Check email delivery rates in Resend (flag anything below 95% delivered)
- [ ] Review any Cal.com webhook delivery failures in Cal.com dashboard
- [ ] Confirm the client can log in to Cal.com and view their bookings

---

## Sign-off

Before the site is considered delivered, get written confirmation from the
client that they have:

1. Reviewed the live site and confirmed it is correct
2. Received the Cal.com and Resend login credentials
3. Read the training notes on managing their calendar
4. Signed off on all legal pages

Record the date of client sign-off here:

```
Client sign-off date:
Confirmed by:
Delivered by:
```
