# Portugal Tattoo — Starter: Landing Page Specification

**Route:** `/` (locale-prefixed: `/pt`, `/es`, default `/`)  
**File:** `src/app/[locale]/page.tsx`  
**Type:** Next.js Server Component (static generation with ISR, `revalidate = 3600`)

---

## Design Constraints (Mandatory)

These rules apply to every component on this page and in this project. No exceptions.

1. **Atomic design system.** Every section MUST use `Wrapper > InnerWrap` (or `WrapperCentered > InnerWrapCentered`) from `@/components/atoms`. Never use raw `<section>` or `<div>` as page-level wrappers.
2. **TitleBlock for all headings.** Use the `TitleBlock` component for all section heading/subheading/body combos. Never write raw `<h2>` or `<p>` headings directly in section components.
3. **shadcn/ui only.** Use only default shadcn/ui components (`Button`, `Card`, `Badge`, `Separator`, `NavigationMenu`, etc.). No additional UI libraries.
4. **No custom CSS.** Tailwind utility classes for layout and sizing only. No arbitrary values except for well-justified spacing.
5. **No inline `style` attributes.** Forbidden.
6. **No hardcoded colours.** Use brand tokens (`text-brand-licorice`, `bg-brand-p2`, etc.) or Tailwind semantic classes (`bg-background`, `text-foreground`, `text-muted-foreground`, `border`). Never hardcode hex values.
7. **Typography:**
   - Body text: `font-body` (custom) or `font-sans` fallback
   - Numbers, prices, stats: `font-mono`
   - Headings `text-lg` and above: no font-family constraint
8. **Minimum font size:** `text-xs`. Never smaller.
9. **Light mode only.** Dark text on light backgrounds.
10. **No animations** beyond Tailwind's built-in `transition` and `hover:` variants.
11. **Images:** Always use `next/image` with explicit `width` and `height` or `fill`.
12. **Links:** Always use `next/link` or the locale-aware `Link` from `@/i18n/navigation`.

### Atom Imports

All section files must import atoms from `@/components/atoms`:

```tsx
import {
  Wrapper,
  InnerWrap,
  WrapperCentered,
  InnerWrapCentered,
} from '@/components/atoms'
import { TitleBlock } from '@/components/shared/TitleBlock'
```

---

## Page Structure (Wireframe)

```
┌──────────────────────────────────────────┐
│ NAV                                      │
├──────────────────────────────────────────┤
│ HERO                                     │
├──────────────────────────────────────────┤
│ SOCIAL PROOF BAR                         │
├──────────────────────────────────────────┤
│ PAIN POINTS                              │
├──────────────────────────────────────────┤
│ HOW IT WORKS                             │
├──────────────────────────────────────────┤
│ PROMOTIONS (conditional — renders only   │
│ when active promotions exist)            │
├──────────────────────────────────────────┤
│ PRICING                                  │
├──────────────────────────────────────────┤
│ TESTIMONIALS                             │
├──────────────────────────────────────────┤
│ FAQ                                      │
├──────────────────────────────────────────┤
│ CLOSING CTA                              │
├──────────────────────────────────────────┤
│ FOOTER GUTTER                            │
└──────────────────────────────────────────┘

[CHATBOT WIDGET — floating, bottom-right]
[GDPR COOKIE BANNER — bottom, Sonner toast]
```

---

## Section 1: Navigation (Nav)

**File:** `src/components/landing/Nav.tsx`  
**Component:** Client Component (`'use client'` — needed for Sheet state)

### Layout

```
[ Portugal Tattoo logo ]    [ How it works ]  [ Pricing ]  [ Language switcher ]    [ Book a consultation → ]
```

Mobile: logo left, hamburger right (Sheet component).

### Behaviour

- Sticky top (`sticky top-0 z-50`)
- Background: `bg-background/95 backdrop-blur` with `border-b`
- Active link: `text-foreground font-medium`
- Inactive links: `text-muted-foreground`
- Uses `max-w-[1440px]` to match `InnerWrap`

### Component Code

```tsx
// src/components/landing/Nav.tsx
'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { Menu } from 'lucide-react'

export function Nav() {
  const t = useTranslations('nav')

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-[1440px] mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-sm tracking-tight text-brand-licorice">
          Portugal Tattoo
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground px-3 py-2">
                {t('how')}
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#pricing" className="text-sm text-muted-foreground hover:text-foreground px-3 py-2">
                Pricing
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/booking">{t('booking')}</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="#how-it-works" className="text-sm text-muted-foreground">
                  {t('how')}
                </Link>
                <Link href="#pricing" className="text-sm text-muted-foreground">
                  Pricing
                </Link>
                <Button asChild size="sm" className="mt-4">
                  <Link href="/booking">{t('booking')}</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
```

---

## Section 2: Hero

**File:** `src/components/landing/Hero.tsx`  
**Component:** Server Component  
**Atoms:** `WrapperCentered` + `InnerWrapCentered` + `TitleBlock` (`isHero`)

### Layout (wireframe)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   [Badge: "Starting at €70/month"]                  │
│                                                     │
│   Your calendar should be full                      │
│   in January too.                                   │
│                                                     │
│   Most tattoo artists lose 40% of their bookings    │
│   every winter. Portugal Tattoo keeps your studio   │
│   fully booked — year-round.                        │
│                                                     │
│   [Book a free consultation]  [See how it works]    │
│                                                     │
│   30-day money-back guarantee. No credit card       │
│   required.                                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Component Code

```tsx
// src/components/landing/Hero.tsx
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { WrapperCentered, InnerWrapCentered } from '@/components/atoms'
import { TitleBlock } from '@/components/shared/TitleBlock'

export function Hero() {
  const t = useTranslations('hero')

  return (
    <WrapperCentered>
      <InnerWrapCentered>
        <Badge variant="secondary" className="mb-4 font-mono text-xs">
          Starting at €70/month
        </Badge>

        <TitleBlock
          isHero
          orientation="center"
          heading={t('headline')}
          subheading={t('sub')}
        />

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/booking">{t('cta_primary')}</Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="#how-it-works">{t('cta_secondary')}</Link>
          </Button>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          30-day money-back guarantee. No credit card required to enquire.
        </p>
      </InnerWrapCentered>
    </WrapperCentered>
  )
}
```

---

## Section 3: Social Proof Bar

**File:** `src/components/landing/SocialProof.tsx`  
**Component:** Server Component  
**Note:** Slim stats bar — uses a plain `border-y` div rather than full `Wrapper` to keep compact height.

### Layout

```
┌────────────────────────────────────────────────────────────────────────┐
│  50+ artists   ·   3 languages   ·   24/7 booking   ·   Portugal only  │
└────────────────────────────────────────────────────────────────────────┘
```

### Component Code

```tsx
// src/components/landing/SocialProof.tsx
import { Separator } from '@/components/ui/separator'

const STATS = [
  { value: '50+', label: 'artists on the platform' },
  { value: '3', label: 'languages supported' },
  { value: '24/7', label: 'booking availability' },
  { value: '100%', label: 'Portugal-focused' },
]

export function SocialProof() {
  return (
    <div className="border-y bg-muted/40 py-5 px-4 w-full">
      <div className="max-w-[1440px] mx-auto flex flex-wrap justify-center items-center gap-6 md:gap-10">
        {STATS.map((stat, i) => (
          <div key={stat.value} className="flex items-center gap-6">
            <div className="text-center">
              <p className="font-mono text-xl font-semibold text-brand-licorice">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {stat.label}
              </p>
            </div>
            {i < STATS.length - 1 && (
              <Separator orientation="vertical" className="h-8 hidden md:block" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## Section 4: Pain Points

**File:** `src/components/landing/PainPoints.tsx`  
**Component:** Server Component  
**Atoms:** `Wrapper` + `InnerWrap` + `TitleBlock` (`orientation="left"`)

### Layout

```
┌──────────────────────────────────────────────────────┐
│  The three things killing your studio.               │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  01          │  │  02          │  │  03        │ │
│  │  The January │  │  The DM trap │  │  Ads that  │ │
│  │  wall        │  │              │  │  cost you  │ │
│  │  [copy]      │  │  [copy]      │  │  [copy]    │ │
│  └──────────────┘  └──────────────┘  └────────────┘ │
└──────────────────────────────────────────────────────┘
```

### Component Code

```tsx
// src/components/landing/PainPoints.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Wrapper, InnerWrap, PreTitle } from '@/components/atoms'
import { TitleBlock } from '@/components/shared/TitleBlock'

const PAIN_POINTS = [
  {
    number: '01',
    title: 'The January wall',
    body: 'Every December, bookings fall off a cliff. Most artists shrug and wait for spring. The studios that stay full plan ahead — months in advance.',
  },
  {
    number: '02',
    title: 'The DM trap',
    body: 'Your Instagram is your portfolio, your booking system, your customer service desk, and your quote machine. All in one app. None of it working properly.',
  },
  {
    number: '03',
    title: 'Ads that cost you',
    body: "You tried Google Ads. Or Meta. Spent €200. Got three enquiries, zero deposits. Ads that aren't set up correctly don't work.",
  },
]

export function PainPoints() {
  return (
    <Wrapper>
      <InnerWrap className="items-start">
        <TitleBlock
          orientation="left"
          heading="The three things killing your studio."
        />

        <div className="grid md:grid-cols-3 gap-6 mt-12 w-full">
          {PAIN_POINTS.map((point) => (
            <Card key={point.number} className="border bg-muted/20">
              <CardHeader className="pb-2">
                <PreTitle>{point.number}</PreTitle>
                <h3 className="text-base font-semibold text-brand-licorice mt-1">
                  {point.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed font-body">
                  {point.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </InnerWrap>
    </Wrapper>
  )
}
```

---

## Section 5: How It Works

**File:** `src/components/landing/HowItWorks.tsx`  
**ID:** `how-it-works` (anchor link from nav)  
**Component:** Server Component  
**Atoms:** `Wrapper` + `InnerWrap` + `TitleBlock` (`orientation="left"`)

### Layout

```
┌─────────────────────────────────────────────────────┐
│  How it works.                                      │
│                                                     │
│  01 → We build your website                         │
│  02 → We connect your booking calendar              │
│  03 → The AI handles enquiries, 24/7                │
│  04 → You tattoo. We handle the rest.               │
└─────────────────────────────────────────────────────┘
```

### Component Code

```tsx
// src/components/landing/HowItWorks.tsx
import { Separator } from '@/components/ui/separator'
import { Wrapper, InnerWrap, PreTitle } from '@/components/atoms'
import { TitleBlock } from '@/components/shared/TitleBlock'

const STEPS = [
  {
    number: '01',
    title: 'We build your website',
    body: 'A professional portfolio site with your work, your style, and your story. Built to load fast and rank on Google.',
  },
  {
    number: '02',
    title: 'We connect your booking calendar',
    body: 'Clients can book consultations and appointments directly through your site — no DMs, no back-and-forth, no friction.',
  },
  {
    number: '03',
    title: 'The AI handles enquiries 24/7',
    body: 'Your AI assistant answers questions, checks availability, and guides clients to book — in Portuguese, English, or Spanish.',
  },
  {
    number: '04',
    title: 'You tattoo. We handle the rest.',
    body: 'Every booking, every follow-up, every reminder goes out automatically. Your calendar fills up. You stay at the chair.',
  },
]

export function HowItWorks() {
  return (
    <Wrapper id="how-it-works" className="bg-muted/20">
      <InnerWrap className="items-start">
        <TitleBlock orientation="left" heading="How it works." />

        <div className="space-y-0 w-full mt-12">
          {STEPS.map((step, i) => (
            <div key={step.number}>
              <div className="flex gap-6 py-8">
                <PreTitle className="w-6 shrink-0 mt-0.5">{step.number}</PreTitle>
                <div>
                  <h3 className="text-base font-semibold text-brand-licorice">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed font-body">
                    {step.body}
                  </p>
                </div>
              </div>
              {i < STEPS.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </InnerWrap>
    </Wrapper>
  )
}
```

---

## Section 6: Promotions (Conditional)

**File:** `src/components/landing/Promotions.tsx`  
**Component:** Server Component — async, fetches from Supabase  
**Atoms:** `Wrapper` + `InnerWrap` + `TitleBlock`  
**Visibility:** Only renders when at least one active promotion exists. Returns `null` otherwise.

### Data Source

Reads from the `promotions` table (defined in `07-promotions-referrals.md`). Filters:
- `is_active = true`
- `start_date <= now()`
- `end_date >= now()` (or `end_date IS NULL`)

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  Current promotions.                                    │
│                                                         │
│  ┌──────────────────────────────┐                       │
│  │  [Badge: SEASONAL]           │                       │
│  │  January Flash — 20% off     │                       │
│  │  Book before Jan 31st        │                       │
│  │  Code: JANUARY20 [copy icon] │                       │
│  │  [Badge: 12 days remaining]  │                       │
│  └──────────────────────────────┘                       │
└─────────────────────────────────────────────────────────┘
```

### Supabase Helper

```ts
// src/lib/promotions.ts
import { createServerClient } from '@/lib/supabase/server'

export type Promotion = {
  id: string
  title: string
  description: string | null
  promo_code: string | null
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  promotion_type: 'seasonal' | 'calendar' | 'code' | 'referral'
  start_date: string
  end_date: string | null
  is_active: boolean
}

export async function getActivePromotions(): Promise<Promotion[]> {
  const supabase = createServerClient()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('is_active', true)
    .lte('start_date', now)
    .or(`end_date.is.null,end_date.gte.${now}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[getActivePromotions]', error)
    return []
  }

  return data ?? []
}
```

### PromotionCard Sub-Component

```tsx
// src/components/landing/PromotionCard.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { PreTitle } from '@/components/atoms'
import type { Promotion } from '@/lib/promotions'

function daysRemaining(endDate: string | null): number | null {
  if (!endDate) return null
  const diff = new Date(endDate).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

const TYPE_LABELS: Record<Promotion['promotion_type'], string> = {
  seasonal: 'Seasonal',
  calendar: 'Limited time',
  code: 'Promo code',
  referral: 'Referral',
}

export function PromotionCard({ promo }: { promo: Promotion }) {
  const [copied, setCopied] = useState(false)
  const days = daysRemaining(promo.end_date)

  function copyCode() {
    if (!promo.promo_code) return
    navigator.clipboard.writeText(promo.promo_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const discountLabel =
    promo.discount_type === 'percentage'
      ? `${promo.discount_value}% off`
      : `€${promo.discount_value} off`

  return (
    <Card className="border bg-background">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {TYPE_LABELS[promo.promotion_type]}
          </Badge>
          <Badge variant="outline" className="font-mono text-xs">
            {discountLabel}
          </Badge>
        </div>
        <h3 className="text-base font-semibold text-brand-licorice mt-2">
          {promo.title}
        </h3>
      </CardHeader>
      <CardContent className="space-y-3">
        {promo.description && (
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            {promo.description}
          </p>
        )}

        {promo.promo_code && (
          <div className="flex items-center gap-2">
            <code className="font-mono text-sm bg-muted px-2 py-1 rounded border">
              {promo.promo_code}
            </code>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyCode}>
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        )}

        {days !== null && (
          <PreTitle>
            {days === 0 ? 'Ends today' : `${days} day${days === 1 ? '' : 's'} remaining`}
          </PreTitle>
        )}
      </CardContent>
    </Card>
  )
}
```

### Promotions Section Component

```tsx
// src/components/landing/Promotions.tsx
import { getActivePromotions } from '@/lib/promotions'
import { Wrapper, InnerWrap } from '@/components/atoms'
import { TitleBlock } from '@/components/shared/TitleBlock'
import { PromotionCard } from './PromotionCard'

export async function Promotions() {
  const promotions = await getActivePromotions()

  if (promotions.length === 0) return null

  return (
    <Wrapper className="bg-muted/10 border-y">
      <InnerWrap className="items-start">
        <TitleBlock
          orientation="left"
          preheading="Offers"
          heading="Current promotions."
          subheading="Limited-time offers for new clients."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10 w-full">
          {promotions.map((promo) => (
            <PromotionCard key={promo.id} promo={promo} />
          ))}
        </div>
      </InnerWrap>
    </Wrapper>
  )
}
```

---

## Section 7: Pricing

**File:** `src/components/landing/Pricing.tsx`  
**ID:** `pricing`  
**Component:** Server Component  
**Atoms:** `Wrapper` + `InnerWrap` + `TitleBlock` (`orientation="left"`, `body` as ReactNode)

### Layout

```
┌───────────────────────────────────────────────────────────────────┐
│  Simple pricing. Real results.                                    │
│  The average tattoo artist loses €2,400 in revenue every winter. │
│  The Starter plan costs €840 a year. The maths is clear.         │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  STARTER              [HIGHLIGHTED]                         │ │
│  │  €70 / month  (billed €840/year)                            │ │
│  │  [feature list with check icons]                            │ │
│  │  [Book a free consultation]                                 │ │
│  │  30-day money-back guarantee                                │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  Need full marketing management? Ask about the Growth plan.       │
└───────────────────────────────────────────────────────────────────┘
```

### Component Code

```tsx
// src/components/landing/Pricing.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Check } from 'lucide-react'
import { Wrapper, InnerWrap } from '@/components/atoms'
import { TitleBlock } from '@/components/shared/TitleBlock'

const FEATURES = [
  'Professional portfolio website',
  'AI booking assistant (EN/PT/ES)',
  'Cal.com booking calendar',
  '24/7 automated booking',
  'Automated confirmation & reminder emails',
  'Monthly performance summary',
  'GDPR-compliant',
  '30-day money-back guarantee',
]

const pricingBody = (
  <p className="text-sm text-muted-foreground leading-relaxed max-w-lg font-body">
    The average tattoo artist loses{' '}
    <span className="font-mono font-semibold text-brand-licorice">€2,400</span>
    {' '}in revenue every winter. The Starter plan costs{' '}
    <span className="font-mono font-semibold text-brand-licorice">€840</span>
    {' '}a year. The maths is clear.
  </p>
)

export function Pricing() {
  return (
    <Wrapper id="pricing">
      <InnerWrap className="items-start">
        <TitleBlock
          orientation="left"
          heading="Simple pricing. Real results."
          body={pricingBody}
        />

        <div className="w-full max-w-2xl mt-12">
          <Card className="border-2 border-brand-licorice">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="secondary" className="mb-3">Starter</Badge>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-4xl font-semibold text-brand-licorice">€70</span>
                    <span className="text-sm text-muted-foreground">/ month</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Billed annually —{' '}
                    <span className="font-mono">€840/year</span>
                  </p>
                </div>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6">
              <ul className="space-y-3">
                {FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-brand-licorice mt-0.5 shrink-0" />
                    <span className="text-sm text-brand-licorice">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="flex flex-col items-stretch gap-3">
              <Button asChild size="lg" className="w-full">
                <Link href="/booking">Book a free consultation</Link>
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                30-day money-back guarantee. No ad budget included.
                Minimum recommended ad spend:{' '}
                <span className="font-mono">€3/day</span>.
              </p>
            </CardFooter>
          </Card>

          <p className="mt-8 text-sm text-muted-foreground text-center">
            Need full marketing management (Google Ads, Meta, Instagram)?{' '}
            <Link href="/booking" className="text-brand-licorice underline underline-offset-4">
              Ask about the Growth plan.
            </Link>
          </p>
        </div>
      </InnerWrap>
    </Wrapper>
  )
}
```

---

## Section 8: Testimonials

**File:** `src/components/landing/Testimonials.tsx`  
**Component:** Server Component  
**Atoms:** `Wrapper` + `InnerWrap` (with `className="bg-muted/20"`)

### Component Code

```tsx
// src/components/landing/Testimonials.tsx
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Wrapper, InnerWrap } from '@/components/atoms'

export function Testimonials() {
  return (
    <Wrapper className="bg-muted/20">
      <InnerWrap>
        <Card className="border-0 bg-transparent shadow-none max-w-2xl">
          <CardContent className="pt-0">
            <blockquote className="text-xl md:text-2xl font-medium text-brand-licorice leading-snug">
              "Since switching to the platform, my January was fully booked for
              the first time in five years."
            </blockquote>

            <div className="flex items-center gap-3 mt-6">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/testimonials/sofia-t.jpg" alt="Sofia T." />
                <AvatarFallback>ST</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-brand-licorice">Sofia T.</p>
                <p className="text-xs text-muted-foreground">
                  Independent Artist, Porto
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </InnerWrap>
    </Wrapper>
  )
}
```

---

## Section 9: FAQ

**File:** `src/components/landing/FAQ.tsx`  
**Component:** `'use client'` (Accordion requires client interactivity)  
**Atoms:** `Wrapper` + `InnerWrap` + `TitleBlock` (`orientation="left"`)

### Component Code

```tsx
// src/components/landing/FAQ.tsx
'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Wrapper, InnerWrap } from '@/components/atoms'
import { TitleBlock } from '@/components/shared/TitleBlock'

const FAQS = [
  {
    q: 'What is included in the Starter plan?',
    a: 'A professionally designed multilingual website (EN/PT/ES), an AI booking assistant that handles enquiries 24/7, a Cal.com booking calendar, automated email confirmations and reminders, and a monthly performance summary.',
  },
  {
    q: 'Do I need to manage the booking system myself?',
    a: 'No. Once set up, the booking system runs automatically. Clients can book directly through your website. You manage appointments through the admin dashboard — adding availability, cancelling, or rescheduling takes seconds.',
  },
  {
    q: 'What is Cal.com?',
    a: 'Cal.com is an open-source scheduling platform similar to Calendly. It powers the booking calendar on your site. You connect your availability and clients book themselves in — no manual back-and-forth.',
  },
  {
    q: 'Can the AI chatbot handle bookings in Portuguese?',
    a: "Yes. The chatbot detects the language from the user's browser or their cookie preference and responds in Portuguese, English, or Spanish. It can check availability, answer FAQs, and guide clients through the booking process.",
  },
  {
    q: 'Does the Starter plan include advertising?',
    a: 'No. The Starter plan covers your website and booking system. Paid advertising (Google Ads, Meta, Instagram) is managed under the Growth plan. You can run your own ads independently.',
  },
  {
    q: 'What is the refund policy?',
    a: 'You have 30 days from the start of your subscription to request a full refund — no questions asked. See the full refund policy in our legal section.',
  },
  {
    q: 'How long does setup take?',
    a: 'Most Starter sites are live within 7 business days of receiving your content (photos, bio, social links). The booking calendar is configured during the onboarding call.',
  },
  {
    q: 'Can I use a promo code or referral discount?',
    a: 'Yes. Enter your promo code at checkout or during the consultation booking. Refer another artist and you both receive a discount — ask about the referral programme during your onboarding call.',
  },
]

export function FAQ() {
  return (
    <Wrapper>
      <InnerWrap className="items-start">
        <TitleBlock
          orientation="left"
          heading="Frequently asked questions."
        />

        <Accordion type="single" collapsible className="w-full mt-10 max-w-2xl">
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-sm text-left font-medium text-brand-licorice">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed font-body">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </InnerWrap>
    </Wrapper>
  )
}
```

---

## Section 10: Closing CTA

**File:** `src/components/landing/ClosingCTA.tsx`  
**Component:** Server Component  
**Atoms:** `WrapperCentered` + `InnerWrapCentered` + `TitleBlock` (`theme="dark"`, `orientation="center"`)

### Component Code

```tsx
// src/components/landing/ClosingCTA.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { WrapperCentered, InnerWrapCentered } from '@/components/atoms'
import { TitleBlock } from '@/components/shared/TitleBlock'

export function ClosingCTA() {
  return (
    <WrapperCentered className="bg-brand-p2">
      <InnerWrapCentered>
        <TitleBlock
          orientation="center"
          theme="dark"
          heading="Stop guessing. Start filling your calendar."
          subheading="Book a free 15-minute call. We'll look at your current setup, tell you what's costing you bookings, and show you exactly what changes. No pitch. No pressure. Just clarity."
        />

        <div className="mt-8">
          <Button asChild size="lg" variant="secondary">
            <Link href="/booking">Book your free call</Link>
          </Button>
        </div>

        <Separator className="my-10 bg-white/20 w-full max-w-xs" />

        <p className="text-xs text-white/50 text-center">
          30-day money-back guarantee. No ad spend included. Minimum recommended:{' '}
          <span className="font-mono">€3/day</span>.
        </p>
      </InnerWrapCentered>
    </WrapperCentered>
  )
}
```

---

## Section 11: Footer Gutter

**File:** `src/components/shared/FooterGutter.tsx`  
**Component:** Server Component  
**Source:** Matches `PT-Templates/FooterGutter.tsx` exactly.  
**Pattern:** Three-column grid — copyright left, legal nav centre, "A Drifter brand." right.

```tsx
// src/components/shared/FooterGutter.tsx
import { Wrapper } from '@/components/atoms'
import Link from 'next/link'

const FOOTER_LINKS = [
  { text: 'Terms', url: '/legal/terms' },
  { text: 'Refunds', url: '/legal/refunds' },
  { text: 'Privacy', url: '/legal/privacy' },
  { text: 'GDPR', url: '/legal/gdpr' },
  { text: 'Cookies', url: '/legal/cookies' },
]

export function FooterGutter() {
  return (
    <Wrapper className="py-0">
      <div className="grid w-full grid-cols-1 px-4 text-xs text-gray-400 md:grid-cols-3 h-[40px] items-center py-4 gap-4 lg:py-0">
        <div className="flex flex-row items-center justify-center w-full md:justify-start md:items-start">
          <span className="text-xs text-gray-500 sm:text-center mr-1">
            Portugal Tattoo &copy; {new Date().getFullYear()}.
          </span>
          <p>All rights reserved.</p>
        </div>

        <div className="items-center justify-center hidden w-full mx-auto md:flex">
          <ul className="flex flex-row items-center justify-center gap-1 my-2 md:my-0">
            {FOOTER_LINKS.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.url}
                  className="pl-1 no-underline transition duration-100 ease-in-out hover:text-gray-900 text-xs"
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="items-center justify-center hidden md:flex md:justify-end">
          <p>
            A{' '}
            <a
              href="http://www.drifter.agency"
              className="font-semibold text-gray-900"
              target="_blank"
              rel="noopener noreferrer"
            >
              Drifter
            </a>{' '}
            brand.
          </p>
        </div>
      </div>
    </Wrapper>
  )
}
```

**Required route:** `/legal/gdpr` must exist — see `05-legal.md`.

---

## GDPR Cookie Banner

**File:** `src/components/shared/CookieBanner.tsx`  
**Technology:** Sonner (shadcn/ui toast library)  
**Strategy:** Persistent consent stored in a first-party cookie named `pt_cookie_consent`

### Behaviour

- Shown on first visit or when no consent cookie exists
- Two actions: "Accept" (stores `pt_cookie_consent=accepted`) and "Decline" (stores `pt_cookie_consent=declined`)
- "Manage preferences" links to `/legal/cookies`
- Banner is a Sonner toast pinned to the bottom
- Cookie expiry: 365 days
- Consent state is checked in middleware for analytics

### Component Code

```tsx
// src/components/shared/CookieBanner.tsx
'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import Cookies from 'js-cookie'  // pnpm add js-cookie @types/js-cookie

const COOKIE_NAME = 'pt_cookie_consent'
const COOKIE_EXPIRY_DAYS = 365

export function CookieBanner() {
  const t = useTranslations('cookie')

  useEffect(() => {
    const existing = Cookies.get(COOKIE_NAME)
    if (existing) return

    toast(t('message'), {
      duration: Infinity,
      position: 'bottom-center',
      id: 'cookie-consent',
      action: {
        label: t('accept'),
        onClick: () => {
          Cookies.set(COOKIE_NAME, 'accepted', { expires: COOKIE_EXPIRY_DAYS, sameSite: 'lax' })
        },
      },
      cancel: {
        label: t('decline'),
        onClick: () => {
          Cookies.set(COOKIE_NAME, 'declined', { expires: COOKIE_EXPIRY_DAYS, sameSite: 'lax' })
        },
      },
      description: (
        <Link href="/legal/cookies" className="text-xs underline underline-offset-2">
          {t('manage')}
        </Link>
      ),
    })
  }, [t])

  return null
}
```

### Sonner Provider Setup

Add to `src/app/[locale]/layout.tsx`:

```tsx
import { Toaster } from '@/components/ui/sonner'
import { CookieBanner } from '@/components/shared/CookieBanner'

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={locale}>
      <body>
        {children}
        <CookieBanner />
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
```

### Cookie Consent Hook

```tsx
// src/hooks/useCookieConsent.ts
'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

type ConsentState = 'accepted' | 'declined' | 'unknown'

export function useCookieConsent(): ConsentState {
  const [consent, setConsent] = useState<ConsentState>('unknown')

  useEffect(() => {
    const value = Cookies.get('pt_cookie_consent')
    if (value === 'accepted') setConsent('accepted')
    else if (value === 'declined') setConsent('declined')
  }, [])

  return consent
}
```

---

## Language Switcher

**File:** `src/components/shared/LanguageSwitcher.tsx`

Language preference is stored in a cookie (`NEXT_LOCALE`) by next-intl automatically. The switcher reads the active locale and provides links to switch.

```tsx
// src/components/shared/LanguageSwitcher.tsx
'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
  { code: 'es', label: 'Español' },
]

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale })
  }

  const current = LOCALES.find((l) => l.code === locale)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 font-normal">
          <Globe className="h-3.5 w-3.5" />
          <span className="text-xs">{current?.label ?? locale.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => switchLocale(l.code)}
            className={l.code === locale ? 'font-medium' : ''}
          >
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

---

## Root Page Assembly

**File:** `src/app/[locale]/page.tsx`

ISR revalidation is set to 1 hour so the Promotions section reflects database changes without a full rebuild.

```tsx
// src/app/[locale]/page.tsx
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Nav } from '@/components/landing/Nav'
import { Hero } from '@/components/landing/Hero'
import { SocialProof } from '@/components/landing/SocialProof'
import { PainPoints } from '@/components/landing/PainPoints'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Promotions } from '@/components/landing/Promotions'
import { Pricing } from '@/components/landing/Pricing'
import { Testimonials } from '@/components/landing/Testimonials'
import { FAQ } from '@/components/landing/FAQ'
import { ClosingCTA } from '@/components/landing/ClosingCTA'
import { FooterGutter } from '@/components/shared/FooterGutter'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return {
    title: 'Portugal Tattoo — Professional website and AI booking for tattoo artists',
    description:
      'Keep your tattoo studio fully booked year-round. Professional website, AI booking assistant, and 24/7 automation. Starting at €70/month.',
    openGraph: {
      title: 'Portugal Tattoo — Fully booked, year-round.',
      description:
        'Professional website and AI booking platform for tattoo artists in Portugal. EN/PT/ES.',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    },
    alternates: {
      canonical: '/',
      languages: {
        'en': '/',
        'pt': '/pt',
        'es': '/es',
      },
    },
  }
}

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <SocialProof />
        <PainPoints />
        <HowItWorks />
        <Promotions />
        <Pricing />
        <Testimonials />
        <FAQ />
        <ClosingCTA />
      </main>
      <FooterGutter />
    </>
  )
}
```

---

## JSON-LD Structured Data

Add to `src/app/[locale]/page.tsx` inside the component return:

```tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Portugal Tattoo — Starter',
  provider: {
    '@type': 'Organization',
    name: 'Portugal Tattoo',
    url: 'https://www.portugaltattoo.com',
  },
  description: 'Professional website and AI booking system for tattoo artists in Portugal.',
  areaServed: { '@type': 'Country', name: 'Portugal' },
  offers: {
    '@type': 'Offer',
    price: '70',
    priceCurrency: 'EUR',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: '840',
      priceCurrency: 'EUR',
      unitText: 'year',
    },
  },
}

// Inside the JSX:
// <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
```

---

*Last updated: April 2026*
