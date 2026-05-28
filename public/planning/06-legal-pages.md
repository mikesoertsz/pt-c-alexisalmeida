# 06, Legal Pages

**All five pages must exist before the site accepts any bookings.**

The footer links to five legal pages. Every one of them returns 404 in the
current codebase. Publishing a site that collects names, email addresses, phone
numbers, and payment details without these pages is a GDPR violation and
exposes the client to liability.

---

## Required pages

| Route | Title | Priority |
|---|---|---|
| `/legal/terms` | Terms and Conditions | Required before launch |
| `/legal/privacy` | Privacy Policy | Required before launch |
| `/legal/refunds` | Refund Policy | Required before launch |
| `/legal/gdpr` | GDPR Statement | Required before launch |
| `/legal/cookies` | Cookie Policy | Required before launch |

---

## Where they live in the codebase

Create a shared layout for all legal pages:

```
app/
  legal/
    layout.tsx        ← shared legal page layout (nav + footer + prose wrapper)
    terms/page.tsx
    privacy/page.tsx
    refunds/page.tsx
    gdpr/page.tsx
    cookies/page.tsx
```

The layout should render a simple prose container with the Nav and FooterGutter,
consistent with the rest of the site. Content can be static MDX or plain TSX.

---

## What each page must contain

### Terms and Conditions (`/legal/terms`)

Required clauses for a tattoo studio operating in Portugal under EU law:

1. **Business identification**, Full legal name of the studio owner/entity,
   registered address, NIF (Portuguese tax number), contact email
2. **Services description**, What services are offered (consultation, tattoo
   sessions) and what they include
3. **Booking and deposit**, How bookings are confirmed, deposit amount and
   terms, what constitutes a confirmed booking
4. **Cancellation policy**, Notice periods, what happens to the deposit on
   cancellation vs reschedule
5. **Client obligations**, Age requirement (18+, ID required), health
   disclosures, preparation requirements
6. **Right to refuse service**, Studio's right to decline on health, safety,
   or design grounds
7. **Intellectual property**, Who owns the design created during the session.
   Standard position: the artist retains copyright; the client receives a
   licence to wear the tattoo and share photos with credit
8. **Limitation of liability**, Healing outcomes, touch-up policy, what the
   studio is and is not responsible for
9. **Governing law**, Portuguese law, Algarve jurisdiction

### Privacy Policy (`/legal/privacy`)

GDPR-compliant privacy policy. Must cover:

1. **Data controller identity**, Studio name, address, NIF, contact email
2. **Data collected**, Name, email, phone, booking details, payment details
   (note: full card details are not collected by the site, they go through
   Cal.com/Stripe)
3. **Purpose of processing**, Booking management, email communications,
   service delivery
4. **Legal basis**, Contract performance (bookings), legitimate interest
   (reminders), legal obligation (financial records)
5. **Data processors**, Cal.com (booking data), Resend (email), Vercel
   (hosting), Stripe via Cal.com (payments). Each must be named with a link
   to their own privacy policy.
6. **Retention periods**, Booking records: 7 years (Portuguese tax law
   requirement for financial records). Marketing emails: until unsubscribe.
7. **Data subject rights**, Right to access, rectification, erasure,
   portability, restriction, objection. Contact email for requests.
8. **International transfers**, Vercel, Resend, and Cal.com may process data
   outside the EU. Confirm adequacy decisions or SCCs are in place.
9. **Complaints**, Right to lodge a complaint with the CNPD (Comissão
   Nacional de Proteção de Dados), Portugal's data protection authority

### Refund Policy (`/legal/refunds`)

1. **Deposits**, Explicitly non-refundable. Transferable to a new date with
   48 hours' notice (or whatever the client's actual policy is).
2. **Session payments**, Under what circumstances (if any) a full or partial
   refund is available after the session
3. **Touch-ups**, Free within 3 months (confirm with client) as a service
   guarantee, not a refund
4. **EU Consumer Rights**, Under Directive 2011/83/EU, consumers generally
   have a 14-day cooling-off right for distance contracts. However, this right
   is explicitly excluded for services where performance has begun with the
   consumer's agreement. A signed booking confirmation acknowledging this
   exclusion is best practice.
5. **How to request**, Contact email and process

### GDPR Statement (`/legal/gdpr`)

This supplements the Privacy Policy with explicit GDPR rights information
in plain language. Useful for clients who want to exercise their rights
without reading the full Privacy Policy.

1. Summary of data collected and why
2. How long data is kept
3. Rights summary (access, erasure, portability, objection)
4. How to submit a request (email address, response time: within 30 days)
5. How to complain to the CNPD

### Cookie Policy (`/legal/cookies`)

1. **What cookies this site uses**, The site currently has no analytics
   or tracking cookies (Vercel Analytics uses no cookies by default).
   If Google Analytics or Meta Pixel is added, update this page immediately.
2. **Essential cookies**, Session management, CSRF tokens if any forms use
   them
3. **Third-party cookies**, Cal.com embed may set cookies. Resend does not.
4. **Cookie consent**, If any non-essential cookies are present, a consent
   banner is required under the ePrivacy Directive. Vercel Analytics is
   privacy-first and does not require consent.
5. **How to manage cookies**, Browser settings instructions

---

## Important notes

**These are not "copy this template" pages.** Each legal page must reflect
the actual business practices of the specific client. The content above is a
required-clauses list, not draft copy.

For each client, either:
- Draft the pages based on the content checklist information provided and have
  the client review and sign off in writing, or
- Engage a local Portuguese lawyer to draft the pages (recommended for any
  studio handling significant revenue)

The Portugal Tattoo agency is not providing legal advice. These pages are the
client's legal documents and the client is responsible for their accuracy.

---

## Page structure in code

Each legal page should be clean prose, consistent with the brand:

- `max-w-3xl mx-auto px-4 py-16`
- `font-poppins` body text at `text-sm` or `text-base`
- `Cormorant Garamond` for the page heading
- Sections separated by `<h2>` and `<h3>` headings
- `text-olive` body colour
- `text-ink` headings
- Last updated date at the top of each page

No special components needed, these are document pages.
