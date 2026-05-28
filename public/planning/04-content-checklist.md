# 04, Content Checklist

**Everything needed from the client before the site can go live.**

Nothing in this document is optional. If a client cannot supply an item,
the section that depends on it must be removed from the page for launch
and added in a subsequent update.

---

## CLIENT: section (fill in per engagement)

```
Client name:
Studio name:
Location (full address):
WhatsApp Business number:     +351
Email (bookings):
Email (general):
Domain:
Cal.com username:
Resend sending domain:
Instagram handle:
Google Business profile URL:
Number of artists:
```

---

## Images

| Item | Qty | Spec | Status |
|---|---|---|---|
| Portfolio images | 8–16 | JPEG or PNG, min 800×1000px, 4:5 ratio | |
| Artist photos | 1 per artist | JPEG or PNG, portrait, min 600×800px, 3:4 ratio | |
| Studio/space photos | 2–4 | Landscape, min 1200×800px | |
| OG image | 1 | JPEG, exactly 1200×630px, includes studio name | |
| Video poster / thumbnail | 1 | JPEG, 1920×1080px | |
| Studio video | 1 | MP4, 60–90 seconds, uploaded to Cloudinary | |

All images must be:
- Taken by or owned by the client
- Not watermarked
- Not sourced from other artists' portfolios
- Consistent in quality, do not mix phone snapshots and professional shots

---

## Copy and information

### Studio details

| Item | Notes | Status |
|---|---|---|
| Studio name | Full legal trading name | |
| Tagline / headline | Or confirm "Tattoos with intention." is acceptable | |
| Studio description (1–2 paragraphs) | Used in Hero sub and About section | |
| Full street address | For emails, structured data, and Google Maps link | |
| Opening hours | Day and time format: Mon–Fri 10:00–18:00 | |
| Languages spoken | Confirm EN, PT, ES or update | |

### Artists

For each artist (duplicate this block):

| Item | Notes | Status |
|---|---|---|
| Full name | | |
| Role / title | e.g. "Lead Artist & Founder" | |
| Specialty styles | e.g. "Fine line, botanical, symbolic" | |
| Short bio (3–5 sentences) | Written in third person | |
| Instagram handle | Full handle including @ | |
| Photo | See Images section above | |

### Pricing

| Item | Notes | Status |
|---|---|---|
| Small piece price | Current template: from €80 | |
| Medium piece price | Current template: from €180 | |
| Large piece price | Current template: from €350 | |
| Deposit percentage | Current template: 30% | |
| Deposit policy | Non-refundable? Transferable with how much notice? | |
| Accepted payment methods | Cash, card, Multibanco, other | |
| Touch-up policy | Current template: free within 3 months | |

### Social proof

| Item | Notes | Status |
|---|---|---|
| Years of experience | Current template: 8+ | |
| Clients tattooed | Current template: 2,000+ | |
| Review score | Current template: 4.9★, must be real or removed | |
| Languages | Current template: EN·PT·ES | |

### Testimonials

Minimum 2, maximum 6. Each must be a real review.

| Item | Notes | Status |
|---|---|---|
| Review 1 text + author name + context | e.g. "Client, Lisbon" | |
| Review 2 text + author name + context | | |
| Review 3 text + author name + context | Optional | |
| Review 4 text + author name + context | Optional | |

Reviews can be copied from Google, Facebook, or direct messages. Client must
confirm they have permission to republish each one.

### FAQ

The template has 8 FAQ items. Client must confirm or update:

| Question | Action required | Status |
|---|---|---|
| Does it hurt? | Confirm answer is accurate | |
| How do I prepare? | Confirm answer | |
| How long does healing take? | Confirm answer | |
| Can I bring my own design? | Confirm answer | |
| Do you do cover-ups? | Confirm yes/no and policy | |
| What is your deposit policy? | Must match Cal.com event config | |
| Do you tattoo minors? | Confirm 18+ policy and ID requirement | |
| Do you speak English? | Confirm languages | |

Client may add up to 4 additional questions.

### Studio experience / comforts

The `WhyAura` section lists six studio amenities. Client must confirm each one
is real and remove any that are not offered:

| Amenity | Offered? |
|---|---|
| Calming tea | |
| Free Wi-Fi | |
| Meditative / calm studio space | |
| Coffee and refreshments | |
| Music (client's playlist or curated) | |
| Gentle aftercare walkthrough | |

---

## Booking configuration

| Item | Notes | Status |
|---|---|---|
| Cal.com account created | Client or agency | |
| Cal.com username confirmed | Used in API calls | |
| Consultation event type created | 20 min, slug: consultation | |
| Tattoo session event type created | Multi-duration, slug: tattoo-session | |
| Stripe connected to Cal.com | Required for deposit collection | |
| Deposit amount configured in Cal.com | 30% of estimated session cost | |
| Artist availability set in Cal.com | Working hours, days off, buffer times | |
| Minimum notice period set | 24h for consultations, 48h for sessions | |
| Buffer between appointments | 10–15 min recommended | |
| Cal.com API key created | Stored in Vercel env vars | |
| Cal.com webhook configured | Points to `/api/webhooks/cal` | |

---

## Email configuration

| Item | Notes | Status |
|---|---|---|
| Resend account created | | |
| Sending domain verified in Resend | e.g. auratattoo.pt | |
| `bookings@[domain]` address created | Used as FROM address | |
| `RESEND_API_KEY` added to Vercel env | | |
| All 10 email templates reviewed | Client reviews draft before launch | |
| Template variables confirmed | Studio name, address, WhatsApp link | |

---

## Domain and hosting

| Item | Notes | Status |
|---|---|---|
| Domain registered or transferred | | |
| DNS pointed to Vercel | | |
| Domain added to Vercel project | | |
| SSL certificate active | Auto-provisioned by Vercel | |
| `www` redirect configured | `www.domain` → `domain` or vice versa | |
| Canonical URL confirmed | Used in sitemap and metadata | |

---

## Legal

All five legal pages require client review and approval before launch.
See `06-legal-pages.md` for content requirements.

| Page | Client reviewed | Status |
|---|---|---|
| `/legal/terms` | | |
| `/legal/refunds` | | |
| `/legal/privacy` | | |
| `/legal/gdpr` | | |
| `/legal/cookies` | | |

---

## Social and external profiles

| Item | Notes | Status |
|---|---|---|
| Instagram URL confirmed | Used in artists section | |
| Google Business profile claimed and verified | | |
| Google Maps pin correct | Address matches site | |
| Facebook page URL (if any) | Optional footer link | |
