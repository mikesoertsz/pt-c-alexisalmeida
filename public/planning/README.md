# PT Starter Package — Site Delivery Reference

**Template:** pt-c-aura-web  
**Package:** Starter (€840/year)  
**Last reviewed:** 2026-05-10

This folder is the single source of truth for every deliverable required to
ship the Starter Package to a client. Each file in here corresponds to one
delivery area. Nothing is considered done until it is checked off in the
relevant document and the live site reflects the behaviour described.

---

## Folder index

| File | Area |
|---|---|
| `01-site-brief.md` | What the site is, what it does, section-by-section spec |
| `02-booking-system.md` | Cal.com setup, API routes, multi-step form spec |
| `03-email-flows.md` | All transactional email templates and trigger logic |
| `04-content-checklist.md` | Every content item needed from the client before go-live |
| `05-seo-and-meta.md` | SEO requirements, sitemap, robots, OG, structured data |
| `06-legal-pages.md` | Required legal pages and what each must contain |
| `07-analytics.md` | Vercel Analytics, GA4, Google Search Console |
| `08-env-and-deployment.md` | All environment variables and Vercel project config |
| `09-go-live-checklist.md` | Final gate before launch — nothing ships without this clear |
| `10-i18n.md` | Route-based i18n (EN/PT/DE), middleware, content system, LanguageSwitcher |
| `11-analytics-tracking.md` | GA4 setup, cookie consent, CTA event tracking, thank-you page |
| `TASKS.md` | Cursor implementation checklist — work through phases in order |

---

## What the Starter Package includes

Taken directly from portugaltattoo.com at time of writing:

**Landing and funnel**
- Professional landing page
- Lead capture forms
- CRM for leads and bookings (Cal.com native)
- Custom domain
- Basic SEO

**Booking and scheduling**
- AI booking (booking form — AI layer deferred to phase 2)
- 24/7 availability via Cal.com
- Deposit and confirmation flow
- Multi-artist or studio calendar

**Client communications**
- Email confirmations and reminders
- Client self-service cancel and reschedule (Cal.com native links)

**Payments**
- Secure deposit collection
- Basic payment processing via Stripe through Cal.com

**Paid ads setup and account management are agency deliverables, not site
deliverables.** They are not covered in this planning folder.

---

## How to use this folder

Work through documents 01–08 in order when onboarding a new client. Use
`09-go-live-checklist.md` as the final gate. Each document contains a
client-specific section (marked `CLIENT:`) for values that change per
engagement, and a template section that applies to every client.
