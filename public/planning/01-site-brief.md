# 01, Site Brief

**What the site is. What it does. Why each section exists.**

---

## Purpose

This is a single-page marketing and booking site for an independent tattoo
artist or small studio. Its one job is to convert a visitor who has discovered
the studio, through Instagram, a referral, or a search, into a confirmed
consultation or tattoo session booking.

Every section exists to advance that goal. If a section does not move the
visitor toward the booking form, it earns its place by building the trust or
answering the objection that would otherwise stop them.

---

## Audience

The site must work clearly for three visitor types:

1. **Ready to book.** They have already decided. They want the booking form
   fast and they want reassurance that the studio is real, hygienic, and
   professional. The nav CTA and the Hero CTA both drop them directly to the
   booking form.

2. **Exploring.** They are interested but not committed. They want to see the
   work, read about the artists, understand the process, and know the prices
   before they make a move. The page is structured to walk them through this
   in order.

3. **Referred or pre-sold.** They were sent the link by a friend or found the
   studio on Instagram. They need social proof confirmed and a frictionless
   path to book. The Testimonials and Stats sections serve this group.

The site is fully multilingual from day one. English is the default locale
(`/`). Portuguese (`/pt`) and German (`/de`) are served via route-based locale
routing. The Algarve client base spans local Portuguese residents, British and
Irish expats, and German tourists, all three languages are in-scope for the
Starter Package. See `10-i18n.md` for the full implementation specification.

---

## Current state vs required state

This section lists every meaningful gap between what is in the codebase today
and what is required for the Starter Package to be considered delivered.

### Critical, site is non-functional without these

| # | Issue | Current state | Required state |
|---|---|---|---|
| C1 | Booking form does not exist | `ClosingCTA` has `id="booking"` and links to `https://cal.com` (the generic Cal.com homepage) | A multi-step booking form replaces the ClosingCTA section or is inserted above it. The `#booking` anchor resolves to a real, working form |
| C2 | `ClosingCTA` external link is wrong | Links to `https://cal.com` | Must link to the client's specific Cal.com event type URL, or be replaced entirely by the embedded form |
| C3 | WhatsApp URL is not set | `NEXT_PUBLIC_WHATSAPP_URL` is empty; `WhatsAppFloatingButton` returns null silently | Env var set to the studio's real WhatsApp business number |
| C4 | Gallery has no images | All `gallery.items[*].src` are empty strings; the carousel renders placeholder boxes | Minimum 8 real portfolio images uploaded |
| C5 | Artist photos are missing | `artists.items[*].image` are empty; cards show initials fallback | Real photos provided for each artist |

### Functional gaps, required for Starter Package delivery

| # | Issue | Current state | Required state |
|---|---|---|---|
| F1 | No email infrastructure | No email routes or templates exist | Resend API connected, all 10 email templates built and sending correctly |
| F2 | Cal.com not configured | No event types, no API key | Two event types live: Free Consultation (20 min) and Tattoo Session (multi-duration). API key in env |
| F3 | Deposit flow not connected | Pricing section notes a 30% deposit but there is no mechanism to collect it | Cal.com event type for Tattoo Session has Stripe deposit enabled (30%) |
| F4 | Legal pages do not exist | Footer links to `/legal/terms`, `/legal/refunds`, `/legal/privacy`, `/legal/gdpr`, `/legal/cookies`, all 404 | All five legal pages exist with correct content |
| F5 | Video section has no video | `VideoSection` renders a placeholder | Real studio video uploaded to Cloudinary and URL set in content |
| F6 | OG image is missing | `metadata.openGraph.images` references `/og-image.jpg` which does not exist in `/public/` | A 1200×630 OG image is in `/public/og-image.jpg` |
| F7 | Sitemap and robots.txt missing | No `/sitemap.xml` or `/robots.txt` | Both exist and are correct for the client domain |

### Structural issues, should be fixed before launch

| # | Issue | Current state | Required state |
|---|---|---|---|
| S1 | Nav "About" link goes nowhere | `nav.about` content exists in `en.ts` but the Nav component does not render this link, and there is no `#about` anchor on the page | Either add an About section with `id="about"` or remove the content key. Do not ship a nav link that goes nowhere |
| S2 | Language switcher is cosmetic | Nav renders an `EN` button that is a non-interactive `<button>` element. Clicking it does nothing | Replace with a functional `LanguageSwitcher` client component that switches between EN, PT, and DE using route-based locale routing, see `10-i18n.md` |
| S3 | `ClosingCTA` uses `id="booking"` | The dark closing section carries the `#booking` anchor. The booking form needs to be a distinct section above the closing CTA | Move `id="booking"` to the new `BookingSection`. The ClosingCTA becomes a reinforcing section below the form, not the booking destination |
| S4 | `Promotions` is a null stub | The component imports and renders nothing | If promotions are not in scope for this client, remove the component from `page.tsx` entirely. Do not import dead components into the render tree |
| S5 | `PainPoints` renders `whyUs` content | The component file is named `PainPoints.tsx` but it renders the `whyUs` block from content, studio differentiators and amenities. These are two different jobs | Keep the content as-is; rename the component file to `WhyAura.tsx` and update the import in `page.tsx` |

### Content issues, must be resolved with client

| # | Issue | Required action |
|---|---|---|
| N1 | All testimonials are placeholder text | Client to provide 4 real reviews, or verify the placeholders are real |
| N2 | Social proof stats are unverified | "8+ years", "2,000+ clients", "4.9 stars" need client confirmation before publishing |
| N3 | Artist Instagram handles are placeholders | `@sofiamartins.ink` and `@marcoalves.tattoo`, confirm these are real handles |
| N4 | Studio address is not specified | Structured data and email templates reference "Albufeira, Algarve", need the full street address for emails and Google Maps link |
| N5 | `EMAIL_FROM` domain needs verification | The sending domain (`auratattoo.pt` or whatever the client uses) must be verified in Resend before any email can send |

---

## Page structure and section purposes

The sections below are listed in render order. Each entry describes what the
section is trying to accomplish in the conversion funnel, what it currently
does, what it should do, and whether any changes are required.

---

### Nav

**Purpose in funnel:** Persistent anchor. Keeps the booking CTA visible at all
times. Provides orientation links for the exploring visitor.

**Current state:**
- Sticky header, correct brand styling
- Links: Our Work → `#gallery`, Process → `#how-it-works`, Pricing →
  `#pricing`, FAQ → `#faq`
- Book CTA → `#booking`
- Language toggle button rendered but non-functional
- Mobile hamburger menu works correctly

**Required state:**
- Replace the cosmetic `EN` button with the functional `LanguageSwitcher` component (issue S2, see `10-i18n.md`)
- Confirm `nav.about` is not linked anywhere (issue S1)
- The "Book a consultation" CTA must resolve to the working booking form

**No structural changes needed beyond the above.**

---

### Hero

**Purpose in funnel:** Make the value proposition unmistakable in under 5
seconds. Capture the "ready to book" visitor immediately. Give the "exploring"
visitor a clear path downward.

**Current state:**
- Headline: "Tattoos with intention.", correct and distinctive
- Sub: one paragraph describing the studio philosophy, good
- Primary CTA: `#booking`, correct anchor but broken destination (issue C1)
- Secondary CTA: scrolls to `#how-it-works`, correct
- Guarantee line: "Consultations are free. No commitment required.", strong
- WhatsApp link: renders correctly when env var is set (currently hidden)
- Preheading badge: "Boutique tattoo studio · Portugal", good

**Required state:**
- No copy changes needed
- Once booking form is built and `#booking` resolves correctly, this section
  is complete
- WhatsApp link will appear once `NEXT_PUBLIC_WHATSAPP_URL` is set (issue C3)

---

### VideoSection

**Purpose in funnel:** Humanise the studio. A short video of the space, the
artists at work, and the atmosphere does more to reduce anxiety than any copy.
This is especially important for first-time tattoo clients.

**Current state:**
- Renders a placeholder with "Video coming soon"
- The `videoSection.videoUrl` in `en.ts` is an empty string

**Required state:**
- A real 60–90 second studio video
- Uploaded to Cloudinary (the project already uses Cloudinary CDN for the
  Portugal Tattoo platform video)
- URL set in `en.ts` at `videoSection.videoUrl`
- The component should autoplay muted and loop with a play/pause toggle, or
  render a standard video player with a poster image
- `videoSection.poster` also needs a real image path

**If no video is available at launch:** remove this section from `page.tsx`
entirely. An empty placeholder section actively harms trust. Do not ship it.

---

### SocialProof

**Purpose in funnel:** Instant credibility. Four numbers that a new visitor
absorbs in one glance: experience, volume, satisfaction, and language reach.

**Current state:**
- `8+ years`, `2,000+ clients`, `4.9★`, `EN·PT·DE`
- Visual treatment is correct (mono numbers, subtle dividers, muted palette)
- Renders immediately below the Hero with no wrapper padding, tight and
  effective

**Required state:**
- Client must confirm all four values before launch (issue N2)
- No structural or visual changes needed

---

### Gallery

**Purpose in funnel:** Show the work. This is the section the "exploring"
visitor needs most. Portfolio quality determines whether they continue reading
or leave.

**Current state:**
- Horizontal drag carousel using `embla-carousel-react`
- 8 placeholder items, all `src: ""`
- Renders grey placeholder boxes with alt text

**Required state:**
- Minimum 8 portfolio images, ideally 12–16
- Images should represent the full range of styles the studio offers (fine
  line, blackwork, geometric, etc.)
- Supplied by client as high-quality JPEGs, minimum 800×1000px (4:5 ratio)
- Uploaded to `/public/images/gallery/` or hosted on Cloudinary
- `gallery.items` in `en.ts` updated with real `src` and `alt` values
- `alt` text should describe the tattoo (style, subject, placement), this has
  SEO value

**If no images are available at launch:** this section must be removed. An
empty portfolio carousel is worse than no portfolio section.

---

### Artists

**Purpose in funnel:** Introduce the people behind the work. Clients want to
know who will be touching them. Names, faces, and specialties build the
personal trust that converts browsers into bookers.

**Current state:**
- Two artist cards with bio, role, specialty, and Instagram link
- Both images are empty, renders initials fallback
- Copy is placeholder (Sofia Martins, Marco Alves)

**Required state:**
- Real artist names, roles, specialties, and bios
- Real photos, portrait orientation (3:4), minimum 600×800px
- Real Instagram handles (issue N3)
- Number of artist cards must match the actual team
- If a studio has one artist, render one card. Do not show placeholder artists.

---

### WhyAura (currently named PainPoints)

**Purpose in funnel:** Answer the "why this studio over any other" question.
Converts the visitor who is comparing options. Three differentiators, followed
by the studio comfort amenities that reduce first-time anxiety.

**Current state:**
- Component file: `PainPoints.tsx` (misleading name, issue S5)
- Renders `whyUs` content correctly: three numbered value propositions, then
  six studio comfort items (tea, WiFi, music, etc.)
- Content is strong and specific

**Required state:**
- Rename `PainPoints.tsx` to `WhyAura.tsx`; update import in `page.tsx`
- Confirm the six comfort items match what the studio actually offers. If the
  client does not serve tea or have music, remove those items. False amenities
  destroy trust faster than listing none.
- No visual or structural changes needed

---

### HowItWorks

**Purpose in funnel:** Remove uncertainty about the booking process. Many
first-time clients do not book because they do not know what happens after they
click. Four numbered steps walk them through consultation → design → session →
aftercare.

**Current state:**
- Four steps with correct, client-appropriate copy
- Clean numbered layout, horizontal dividers between steps
- No interactive elements

**Required state:**
- Confirm the four steps accurately describe the client's actual process. The
  current copy is well-written and correct for most studios. Verify with client
  before launch.
- No structural changes needed

---

### BookingSection, NEW (does not exist yet)

**Purpose in funnel:** The primary conversion mechanism. This is where
visitors become leads. Everything above this point exists to earn enough trust
to get the visitor to this form.

**Current state:** Does not exist. The `#booking` anchor resolves to the
`ClosingCTA` section, which links to `https://cal.com`, broken.

**Required state:**

A distinct section with `id="booking"` inserted between `HowItWorks` and
`Pricing` in `page.tsx`. It renders the multi-step `BookingForm` component
inside a `max-w-7xl` container.

The form has six steps:

1. **Service type**, Two options: Free Consultation (20 min, no commitment,
   in-person or video) and Tattoo Session (book a session directly, 30%
   deposit required). This determines which Cal.com event type is used for
   all subsequent steps.

2. **Artist preference**, One card per artist, plus "No preference". If the
   studio has one artist this step is skipped automatically. This is stored as
   metadata on the Cal.com booking, not as a routing constraint (unless the
   client has set up separate Cal.com calendars per artist).

3. **Session details**, Conditional on service type:
   - Consultation: a single "Tell us about your idea" textarea (required), and
     an optional reference image upload (max 3 files, JPEG/PNG, 5 MB each).
   - Tattoo session: style selector (fine line / blackwork / geometric / dotwork
     / illustrative / other), size category (small <5cm / medium 5–15cm / large
     15cm+), placement text input, description textarea (required), optional
     reference image upload.

4. **Slot picker**, Fetches available slots from `/api/cal/slots` using the
   event slug and a 4-week window from today. Shows a date selector and a
   time slot grid for the selected date. Time zone is detected from the
   browser. No available slots shows a prompt to contact via WhatsApp.

5. **Personal information**, First name, last name, email, phone (country
   prefix default +351), preferred language (EN / PT / DE).

6. **Review and confirm**, Summary of all selections. Checkbox acknowledging
   deposit policy (for sessions) or free consultation terms. Submit button
   triggers `/api/cal/book`. On success: inline confirmation with booking
   reference. On error: inline error with WhatsApp fallback link.

**Layout:** Two-column at desktop (sticky context panel left 40%, form steps
right 60%). Single column on mobile. No page navigation on step change, the
form updates in place.

**See `02-booking-system.md` for full technical specification.**

---

### Pricing

**Purpose in funnel:** Remove the "how much will this cost me?" objection
before the visitor reaches the booking form. Simple, three-tier pricing by
size reduces anxiety and filters for serious clients.

**Current state:**
- Three tiers: Small (€80+), Medium (€180+), Large (€350+)
- Good copy: each tier has a size range, short description, and example types
- Deposit note and payment method notes are present
- CTA links to `#booking`, correct anchor, currently broken destination

**Required state:**
- Confirm prices with client. These are template defaults, not real prices.
- Confirm the deposit policy (30% is the template default)
- Confirm accepted payment methods (currently: cash, Multibanco, card)
- Once `#booking` resolves to a real form, this section requires no other
  changes

---

### Testimonials

**Purpose in funnel:** Social proof at the moment of maximum hesitation. The
visitor has read the prices, considered booking, and is now looking for
reassurance from people who have already been through the process.

**Current state:**
- Four testimonial cards alternating white/mist backgrounds
- All four testimonials are plausible placeholder copy (issue N1)
- No star ratings, no dates, no photo avatars (initials only)

**Required state:**
- All testimonials must be real or removed. Publishing fabricated reviews is
  illegal in the EU under the Consumer Rights Directive (2011/83/EU) as
  amended by the Omnibus Directive (2019/2161).
- Client to provide real reviews. These can be extracted from Google, Facebook,
  or direct messages with client permission.
- If the client has fewer than 4 reviews, show only what is real. Two honest
  reviews outperform four invented ones.
- A Google Reviews badge or star count aggregate is a strong addition once
  verified reviews are in place.

---

### FAQ

**Purpose in funnel:** Handle the objections of the "almost ready to book"
visitor. Eight accordion items covering pain, preparation, healing, custom
designs, cover-ups, deposits, minors, and languages.

**Current state:**
- Eight questions, well-written, accurate for most studios
- Accordion component works correctly

**Required state:**
- Client to confirm each answer matches their actual policy
- The deposit Q&A references 30% non-refundable with 48h notice for transfer
 , confirm this is the client's real policy and matches the Cal.com event
  type configuration
- The minors question (18+ only, photo ID required) must be confirmed by the
  client
- No structural changes needed

---

### ClosingCTA

**Purpose in funnel:** One final push for the visitor who has read everything
and still not booked. Dark background creates visual contrast and signals that
the page is ending, creating mild urgency. The CTA here should echo the main
booking form above it, not duplicate it.

**Current state:**
- Dark `bg-ink` section with heading, subheading, and two CTAs
- Primary CTA links to `https://cal.com` (broken, issue C2)
- Secondary CTA is the WhatsApp link (correct, hidden until env var set)
- `id="booking"` is on this element, must be moved to `BookingSection`

**Required state:**
- Remove `id="booking"` from this component (moves to `BookingSection`)
- Primary CTA should scroll up to `#booking` to use the embedded form, or
  open the Cal.com event URL directly as a fallback for visitors who scrolled
  past the form
- The WhatsApp secondary CTA is correct and should remain
- Copy is strong, no changes needed

---

### FooterGutter

**Purpose in funnel:** Legal and trust signals. Clients need to see that the
studio has proper terms and a privacy policy before entering personal details.
Also communicates professionalism.

**Current state:**
- Three columns: copyright, legal links, agency credit
- Five legal links: Terms, Refunds, Privacy, GDPR, Cookies, all 404

**Required state:**
- All five legal pages must exist before launch (issue F4)
- Copyright year uses `new Date().getFullYear()`, correct, no change needed
- Agency credit "A Drifter brand" is included, confirm client has agreed to this
- See `06-legal-pages.md` for what each legal page must contain

---

### WhatsAppFloatingButton

**Purpose in funnel:** Persistent low-friction contact option. Some visitors
will never fill in a form but will message on WhatsApp. Capturing them this
way is vastly better than losing them entirely.

**Current state:**
- Component is complete and correctly positioned (bottom right, safe area
  inset aware, correct z-index)
- Returns null if `NEXT_PUBLIC_WHATSAPP_URL` is not set
- Icon is correct (react-icons FaWhatsapp)

**Required state:**
- Set `NEXT_PUBLIC_WHATSAPP_URL` to the client's WhatsApp Business number in
  the format `https://wa.me/351XXXXXXXXX`
- Optionally set a pre-filled message using query string:
  `https://wa.me/351XXXXXXXXX?text=Hi%2C%20I%27d%20like%20to%20book%20a%20consultation`
- No code changes needed

---

## Section order in page.tsx, final required order

```
Nav
Hero
VideoSection            ← remove if no video at launch
SocialProof
Gallery                 ← remove if no images at launch
Artists
WhyAura                 ← rename from PainPoints
HowItWorks
BookingSection          ← NEW, id="booking" lives here
Pricing
Testimonials
FAQ
ClosingCTA              ← remove id="booking" from here
FooterGutter
WhatsAppFloatingButton
```

---

## What this site does not do (and should not claim to do)

- It does not process payments directly. Payments and deposits go through
  Cal.com's Stripe integration.
- It does not store client data in a custom database. Booking records live in
  Cal.com. Email delivery records live in Resend. If the client wants a CRM,
  that is a separate integration (phase 2).
- It does not have an AI chatbot. The floating chat widget placeholder (`Chat`
  referenced on the Portugal Tattoo main site) is not part of the initial
  delivery. The WhatsApp button is the human-supported equivalent.
- It does not manage scheduling conflicts. That is Cal.com's job.
- It does not send SMS. Email only.
