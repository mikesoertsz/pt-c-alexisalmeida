# Portugal Tattoo, Starter Package: Project Overview

**Package:** Starter  
**Price:** €70/month (€840/year)  
**Audience:** Individual tattoo artists and small studios in Portugal  
**Value proposition:** A professional multilingual website with AI-powered booking, running 24/7 without manual admin.

---

## What the Starter Package Delivers

- A professionally designed, multilingual website (EN / PT / ES)
- AI chatbot for booking enquiries, availability checks, and FAQ handling
- Cal.com-powered booking system (open-source, self-hosted or cloud)
- Admin backend for calendar and booking management
- GDPR-compliant cookie consent
- Legal pages localised for Portugal
- 30-day money-back guarantee

The Starter package does not include paid advertising management, that is the Growth tier.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16+ (App Router only) |
| Hosting | Vercel |
| Database | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| Booking calendar | Cal.com (open-source, self-hosted on Railway/Render or Cal.com Cloud) |
| AI chatbot | OpenAI API (GPT-4o) with function calling |
| Vector knowledge base | Supabase pgvector |
| UI components | shadcn/ui (default, no custom styles) |
| Atomic components | tailwind-styled-components (`tw`), Wrapper, InnerWrap, TitleBlock |
| Styling | Tailwind CSS (utility classes for layout and sizing only) |
| Package manager | pnpm (primary) + bun (scripts and runtime) |
| Language | TypeScript (strict mode) |
| Auth | Supabase Auth (magic link + email/password) |
| File storage | Supabase Storage |
| Email | Resend |
| Notifications | Sonner (from shadcn/ui) |
| i18n | next-intl |
| Cookie consent | Sonner toast + custom GDPR hook |

---

## Repository Setup

### Prerequisites

```bash
node >= 20
pnpm >= 9
bun >= 1.1
```

### Initialise

```bash
pnpm create next-app@latest pt-starter \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd pt-starter
pnpm install
```

### Add shadcn/ui

```bash
pnpm dlx shadcn@latest init
# Choose: Default style, Neutral base colour, CSS variables: yes
```

### Install core dependencies

```bash
pnpm add tailwind-styled-components
pnpm add clsx
pnpm add @supabase/ssr @supabase/supabase-js
pnpm add next-intl
pnpm add openai
pnpm add resend
pnpm add sonner
pnpm add @cal-com/atoms          # Cal.com embed SDK
pnpm add zod
pnpm add @tanstack/react-query
pnpm add date-fns
```

### Install shadcn components

```bash
pnpm dlx shadcn@latest add button card input label textarea
pnpm dlx shadcn@latest add dialog sheet drawer
pnpm dlx shadcn@latest add form
pnpm dlx shadcn@latest add select
pnpm dlx shadcn@latest add badge
pnpm dlx shadcn@latest add separator
pnpm dlx shadcn@latest add toast sonner
pnpm dlx shadcn@latest add table
pnpm dlx shadcn@latest add avatar
pnpm dlx shadcn@latest add skeleton
pnpm dlx shadcn@latest add scroll-area
pnpm dlx shadcn@latest add tabs
pnpm dlx shadcn@latest add navigation-menu
pnpm dlx shadcn@latest add dropdown-menu
pnpm dlx shadcn@latest add popover
pnpm dlx shadcn@latest add calendar
pnpm dlx shadcn@latest add alert
pnpm dlx shadcn@latest add switch
```

### bun scripts (package.json)

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "db:generate": "bun run supabase gen types typescript --local > src/types/database.types.ts",
    "db:migrate": "bun run supabase db push",
    "db:reset": "bun run supabase db reset"
  }
}
```

---

## Environment Variables

Create `.env.local` (never commit):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o

# Cal.com
NEXT_PUBLIC_CAL_USERNAME=artist-slug       # Cal.com username for the artist
NEXT_PUBLIC_CAL_EVENT_SLUG=consultation    # Cal.com event type slug
CAL_API_KEY=cal_...                        # Cal.com API key (for admin slot queries)
CAL_WEBHOOK_SECRET=whsec_...               # For webhook signature verification

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@portugaltattoo.com

# App
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_DEFAULT_LOCALE=en
ADMIN_EMAIL=artist@example.com
```

---

## Folder Structure

```
pt-starter/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx                  # Root layout with i18n provider
│   │   │   ├── page.tsx                    # Landing page (/)
│   │   │   ├── booking/
│   │   │   │   └── page.tsx                # Booking page (/booking)
│   │   │   └── legal/
│   │   │       ├── layout.tsx              # Legal section layout
│   │   │       ├── page.tsx                # Legal index (/legal)
│   │   │       ├── privacy/page.tsx        # Privacy policy
│   │   │       ├── terms/page.tsx          # Terms of service
│   │   │       ├── cookies/page.tsx        # Cookie policy
│   │   │       └── refunds/page.tsx        # Refund policy
│   │   ├── admin/
│   │   │   ├── layout.tsx                  # Admin layout (auth guard)
│   │   │   ├── page.tsx                    # Admin dashboard
│   │   │   ├── bookings/
│   │   │   │   ├── page.tsx                # Bookings list
│   │   │   │   └── [id]/page.tsx           # Booking detail
│   │   │   ├── calendar/
│   │   │   │   └── page.tsx                # Calendar view
│   │   │   ├── availability/
│   │   │   │   └── page.tsx                # Availability management
│   │   │   ├── customers/
│   │   │   │   └── page.tsx                # Customer list
│   │   │   ├── chatbot/
│   │   │   │   └── page.tsx                # Chatbot knowledge base editor
│   │   │   └── settings/
│   │   │       └── page.tsx                # Studio/artist settings
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts                # POST /api/chat, OpenAI stream
│   │   │   ├── bookings/
│   │   │   │   ├── route.ts                # GET /api/bookings, POST /api/bookings
│   │   │   │   └── [id]/route.ts           # GET/PATCH/DELETE /api/bookings/[id]
│   │   │   ├── availability/
│   │   │   │   └── route.ts                # GET /api/availability?date=YYYY-MM-DD
│   │   │   ├── webhooks/
│   │   │   │   └── cal/route.ts            # POST /api/webhooks/cal, Cal.com events
│   │   │   └── admin/
│   │   │       ├── bookings/route.ts       # Admin booking management
│   │   │       ├── calendar/route.ts       # Admin calendar sync
│   │   │       └── knowledge/route.ts      # Knowledge base CRUD
│   │   └── auth/
│   │       ├── login/page.tsx              # Admin login
│   │       └── callback/route.ts           # Supabase auth callback
│   ├── components/
│   │   ├── ui/                             # shadcn components (auto-generated)
│   │   ├── landing/
│   │   │   ├── Nav.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── PainPoints.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── FAQ.tsx
│   │   │   └── Footer.tsx
│   │   ├── booking/
│   │   │   ├── CalEmbed.tsx                # Cal.com embed wrapper
│   │   │   ├── BookingConfirmation.tsx
│   │   │   └── BookingCancellation.tsx
│   │   ├── chatbot/
│   │   │   ├── ChatWidget.tsx              # Floating chat button + panel
│   │   │   ├── ChatMessages.tsx
│   │   │   └── ChatInput.tsx
│   │   ├── admin/
│   │   │   ├── AdminNav.tsx
│   │   │   ├── BookingTable.tsx
│   │   │   ├── CalendarView.tsx
│   │   │   └── KnowledgeEditor.tsx
│   │   ├── legal/
│   │   │   └── LegalLayout.tsx
│   │   └── shared/
│   │       ├── CookieBanner.tsx            # GDPR cookie consent (Sonner)
│   │       ├── LanguageSwitcher.tsx
│   │       └── LocaleLink.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                   # Browser client
│   │   │   ├── server.ts                   # Server client (cookies)
│   │   │   └── middleware.ts               # Session refresh
│   │   ├── openai/
│   │   │   ├── client.ts
│   │   │   ├── tools.ts                    # Function calling definitions
│   │   │   └── knowledge.ts               # Vector search helpers
│   │   ├── cal/
│   │   │   ├── client.ts                   # Cal.com REST API wrapper
│   │   │   └── webhooks.ts                 # Webhook signature verification
│   │   ├── email/
│   │   │   └── resend.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useCookieConsent.ts
│   │   ├── useLanguage.ts
│   │   └── useBooking.ts
│   ├── i18n/
│   │   ├── routing.ts
│   │   ├── navigation.ts
│   │   └── messages/
│   │       ├── en.json
│   │       ├── pt.json
│   │       └── es.json
│   ├── types/
│   │   ├── database.types.ts               # Generated by Supabase CLI
│   │   ├── booking.ts
│   │   └── chat.ts
│   └── middleware.ts                       # next-intl + Supabase session
├── public/
│   ├── og-image.jpg                        # 1200x630 Open Graph image
│   └── favicon.ico
├── supabase/
│   ├── migrations/
│   │   └── 001_initial.sql
│   └── config.toml
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.local                              # Never commit
└── package.json
```

---

## next.config.ts

```typescript
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/routing.ts')

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'cal.com' },
    ],
  },
}

export default withNextIntl(nextConfig)
```

---

## src/middleware.ts

```typescript
import { type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { updateSession } from '@/lib/supabase/middleware'
import { routing } from '@/i18n/routing'

const intlMiddleware = createMiddleware(routing)

export async function middleware(request: NextRequest) {
  // Supabase session refresh (must run before intl for auth routes)
  if (request.nextUrl.pathname.startsWith('/admin') ||
      request.nextUrl.pathname.startsWith('/auth')) {
    return await updateSession(request)
  }
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!_next|_vercel|.*\\..*).*)',
    '/api/:path*',
  ],
}
```

---

## src/i18n/routing.ts

```typescript
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'pt', 'es'],
  defaultLocale: 'en',
  localePrefix: 'as-needed', // /en is omitted; /pt and /es are prefixed
})
```

---

## Supabase Client Setup

### src/lib/supabase/server.ts

```typescript
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types'

export async function createServerClient() {
  const cookieStore = await cookies()

  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server component, cookies set by middleware
          }
        },
      },
    }
  )
}
```

### src/lib/supabase/client.ts

```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

## Vercel Deployment

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "devCommand": "pnpm dev",
  "env": {
    "NODE_ENV": "production"
  }
}
```

All environment variables must be set in the Vercel project dashboard under Settings > Environment Variables. Never use `.env.local` in production.

---

## Atomic Design Methodology

Every page and every section in this project follows the Atomic Design pattern defined in the shared template files in `PT-Templates/`. Agents must read and apply this pattern to every component they build.

---

### Reference Files

The canonical atom and component files live in `PT-Templates/` (one level above this `Starter/` folder):

| File | Purpose |
|---|---|
| `PT-Templates/atoms.tsx` | All base styled components, Wrapper, InnerWrap, typography atoms |
| `PT-Templates/titleblock.tsx` | Reusable section heading component |
| `PT-Templates/FooterGutter.tsx` | Standard footer with PT brand links |

Copy these into the project at:
```
src/app/components/atoms.tsx
src/app/components/TitleBlock.tsx
src/components/landing/Footer.tsx   ← adapt FooterGutter.tsx
```

---

### The Wrapper / InnerWrap Rule

**Every section on every page** must be wrapped in `<Wrapper>` containing `<InnerWrap>` (or their Centered variants). No section may render outside this structure.

```tsx
import { Wrapper, InnerWrap } from "@/app/components/atoms"

export function MySection() {
  return (
    <Wrapper>
      <InnerWrap>
        {/* section content */}
      </InnerWrap>
    </Wrapper>
  )
}
```

Use `WrapperCentered` / `InnerWrapCentered` for sections that need vertical centring (hero, closing CTA, full-bleed). Use `Wrapper` / `InnerWrap` for standard content sections.

```tsx
// Standard section (content left-aligned or card grid)
<Wrapper>
  <InnerWrap>...</InnerWrap>
</Wrapper>

// Centred section (hero, full-bleed CTA)
<WrapperCentered>
  <InnerWrapCentered>...</InnerWrapCentered>
</WrapperCentered>
```

The `InnerWrap` enforces `max-w-[1440px]` and horizontal centring. Never apply `max-w-*` to a section directly, put it on a child inside `InnerWrap` if you need a narrower content column.

---

### TitleBlock, Standard Section Headings

All section headings use the `TitleBlock` component. Never write raw `<h2>`, `<h3>`, or standalone heading + subheading markup directly in a section, always use `TitleBlock`.

```tsx
import { TitleBlock } from "@/app/components/TitleBlock"

<TitleBlock
  preheading="optional eyebrow text"
  heading="The main section title"
  subheading="A supporting sentence or two below the heading."
  body="Optional longer body copy."
  orientation="center"   // "center" | "left"
  theme="light"          // "light" | "dark"
  headingLevel="h2"      // "h1" | "h2" | "h3" | "h4"
  isHero={false}         // true only for the page H1
/>
```

Props reference:

| Prop | Type | Default | Notes |
|---|---|---|---|
| `preheading` | `string` |, | Small eyebrow label above heading |
| `heading` | `string \| ReactNode` |, | Main section title |
| `subheading` | `string \| ReactNode` |, | Secondary line; renders as `SubTitle` |
| `body` | `string \| ReactNode` |, | Paragraph copy below subheading |
| `orientation` | `"center" \| "left"` | `"center"` | Text alignment and flex direction |
| `theme` | `"light" \| "dark"` | `"light"` | Light = brand colours, dark = white text |
| `headingLevel` | `"h1"–"h4"` | `"h2"` | Controls semantic tag and visual size |
| `isHero` | `boolean` | `false` | Shorthand for `headingLevel="h1"` |

---

### Typography Atoms

All typography must use the atoms from `atoms.tsx`. Never write raw Tailwind typography classes on `<h1>–<h4>` or `<p>` elements.

| Atom | Tag | Use |
|---|---|---|
| `Title` | `h1` | Page hero heading |
| `Heading` | `h2` | Section headings |
| `SubHeading` | `h3` | Sub-section headings |
| `SmallHeading` | `h4` | Card headings, labels |
| `PreTitle` | `h4` | Eyebrow / pre-label |
| `SubTitle` | `h2` | Section subtitle / supporting copy |
| `Body` | `p` | Body paragraph text |

Import:
```tsx
import { Heading, SubHeading, Body, PreTitle, Title } from "@/app/components/atoms"
```

---

### Layout Atoms

| Atom | Use |
|---|---|
| `Wrapper` | Standard section outer container |
| `InnerWrap` | Standard section inner container (max 1440px) |
| `WrapperCentered` | Full-bleed centred section |
| `InnerWrapCentered` | Centred inner container (max 1440px) |
| `SplitWrap` | Two-column split layout, max-w-6xl |
| `Left` | Left panel in a split layout |
| `Right` | Right panel in a split layout |
| `GreyBlock` | Card-style grey background block |
| `HeaderWrap` | Page header / hero background |

---

### Brand Tokens

These Tailwind classes must be configured in `tailwind.config.ts`. Apply them via atoms, do not write raw hex values.

| Token | Typical use |
|---|---|
| `brand-licorice` | Primary text colour (near-black) |
| `brand-p2` | Brand primary (dark background colour) |
| `brand-light-blue` | CTA / accent colour |
| `brand-secondary` | Secondary text / muted foreground |

```typescript
// tailwind.config.ts, extend theme.colors
colors: {
  brand: {
    licorice:    "#1a1a2e",   // confirm exact value with designer
    p2:          "#16213e",   // confirm exact value
    "light-blue":"#e8f4f8",   // confirm exact value
    secondary:   "#4a4a6a",   // confirm exact value
  }
}
```

**Important:** confirm all hex values with the designer or the live site CSS before publishing. The token names are fixed; the values should match the live brand.

---

### Custom Fonts

The atoms reference `font-body` and `font-poppins`. Configure in `tailwind.config.ts` and load via `next/font`:

```typescript
// tailwind.config.ts
fontFamily: {
  body:    ["var(--font-body)", "sans-serif"],
  poppins: ["var(--font-poppins)", "sans-serif"],
}
```

```tsx
// src/app/[locale]/layout.tsx
import { Poppins } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
})

// Add --font-poppins to <html> className
```

---

### Standard Section Template

Use this as the starting point for every new section component:

```tsx
// src/components/landing/MySectionName.tsx
import { Wrapper, InnerWrap } from "@/app/components/atoms"
import { TitleBlock } from "@/app/components/TitleBlock"

export function MySectionName() {
  return (
    <Wrapper>
      <InnerWrap>
        <TitleBlock
          preheading="Eyebrow"
          heading="Section heading"
          subheading="Supporting line."
          orientation="center"
        />
        {/* Section-specific content below */}
      </InnerWrap>
    </Wrapper>
  )
}
```

---

### Footer

The footer is based on `FooterGutter.tsx` from `PT-Templates/`. It uses `Wrapper` directly and renders a three-column grid: copyright left, nav links centre, agency credit right. Legal nav links are fixed:

```
/legal/terms · /legal/refunds · /legal/privacy · /legal/gdpr · /legal/cookies
```

Note: `/legal/gdpr` is a required footer link. Ensure a GDPR information page exists at that route (see `05-legal.md`).

---

## Design System Constraints

These constraints apply to ALL documents in this collection and must not be overridden:

1. Use only shadcn/ui default components. No additional component libraries.
2. No custom CSS classes beyond Tailwind utility classes for layout and sizing (padding, margin, width, height, gap, flex, grid).
3. No inline `style` attributes.
4. No hardcoded colour values, use only Tailwind's semantic classes (`bg-background`, `text-foreground`, `border`, etc.) or shadcn/ui's CSS variables.
5. Typography: `font-mono` for all numbers and prices. `font-sans` (default) for text below `text-lg`.
6. Minimum font size: `text-xs` (12px). Never go smaller.
7. All designs are light mode (dark text on light background). No dark mode unless explicitly requested.
8. Use shadcn/ui's `cn()` utility for conditional class merging.
9. All interactive states (hover, focus, disabled) must be handled by shadcn component defaults.
10. Component sizing through Tailwind only (`w-full`, `max-w-4xl`, `h-12`, etc.).

---

## Localisation Structure

### src/i18n/messages/en.json (skeleton)

```json
{
  "nav": {
    "booking": "Book a consultation",
    "how": "How it works",
    "legal": "Legal"
  },
  "hero": {
    "headline": "Your calendar should be full in January too.",
    "sub": "Most tattoo artists lose 40% of their bookings every winter. Portugal Tattoo keeps your studio fully booked, year-round.",
    "cta_primary": "Book a free consultation",
    "cta_secondary": "See how it works"
  },
  "booking": {
    "title": "Book a consultation",
    "subtitle": "Pick a time that works for you. We'll confirm within minutes.",
    "success": "Booking confirmed",
    "cancel": "Cancel booking"
  },
  "chatbot": {
    "greeting": "Hi! I'm here to help you book a consultation or answer any questions.",
    "placeholder": "Ask me anything...",
    "send": "Send"
  },
  "cookie": {
    "message": "We use cookies to improve your experience and remember your language preference.",
    "accept": "Accept",
    "decline": "Decline",
    "manage": "Manage preferences"
  },
  "legal": {
    "privacy": "Privacy Policy",
    "terms": "Terms of Service",
    "cookies": "Cookie Policy",
    "refunds": "Refund Policy"
  }
}
```

Duplicate structure for `pt.json` and `es.json` with translated values.

---

## Summary

Each document in this collection is self-contained and agent-executable. Documents reference shared constraints defined here. Build order:

1. `00-overview.md`, this document (environment, structure, atomic design, constraints)
2. `01-landing-page.md`, landing page sections and components (uses atomic design)
3. `02-booking.md`, Cal.com integration and booking flow
4. `03-admin-backend.md`, admin dashboard and REST APIs
5. `04-chatbot.md`, AI chatbot with OpenAI
6. `05-legal.md`, legal pages for Portugal (includes /legal/gdpr)
7. `06-schema.md`, complete Supabase schema
8. `07-promotions-referrals.md`, promotions, discount codes, and referral system

*Last updated: April 2026*
