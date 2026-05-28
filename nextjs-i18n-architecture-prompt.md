# Phase 2: Adding Multilingual Support to an Existing Next.js 16+ Project

This document describes how to add multilingual (i18n) support to a project already built according to the Next.js 16+ architecture document. Read that document first. This phase does not change any existing architecture decisions, it layers new files and conventions on top of what already exists.

Implement this phase in full, in the order described. Do not partially implement.

---

## What This Phase Adds

- A supported locale list and a cookie-based locale preference
- A `src/locales/` folder for shared content (nav, footer, common UI strings)
- A `_locales/` private folder inside each route containing one typed file per language
- A server-side `getLocale()` utility
- A `LocaleSwitcher` client component
- A pattern for loading and spreading locale content in `page.tsx` files
- TypeScript types that enforce translation completeness at compile time

Nothing in `src/components/`, `src/features/`, `src/hooks/`, or `src/lib/` (except one new file) is modified. Existing components do not change shape, they already accept strings as props.

---

## 1. Locale Configuration

Create the locale config file first. Everything else in this phase imports from it.

```ts
// src/locales/config.ts
export const LOCALES = ['en', 'pt'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_COOKIE = 'locale'
```

Add languages to the `LOCALES` array as needed. TypeScript will surface every location that needs updating when a new locale is added.

---

## 2. The Locale Loader

Add one server-only utility to `src/lib/`. This is the only place in the codebase that reads the locale cookie.

```ts
// src/lib/locale.ts
import { cookies } from 'next/headers'
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALES } from '@/locales/config'
import type { Locale } from '@/locales/config'

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const value = cookieStore.get(LOCALE_COOKIE)?.value
  if (value && (LOCALES as readonly string[]).includes(value)) {
    return value as Locale
  }
  return DEFAULT_LOCALE
}
```

---

## 3. Shared Locale Files

Shared content covers any string used by components that appear across multiple routes: nav labels, footer copy, common UI labels (Submit, Cancel, Save), error messages, and empty states.

Create one file per language plus a types file.

```
src/locales/
├── config.ts       (already created above)
├── types.ts
├── en.ts
└── pt.ts
```

Define the type first, then implement each language file against it. The type annotation on each language export (`const en: SharedLocale`) is required, it is what forces completeness.

```ts
// src/locales/types.ts
export interface SharedLocale {
  nav: {
    home: string
    about: string
    pricing: string
    signIn: string
    signOut: string
  }
  footer: {
    tagline: string
    privacyPolicy: string
    termsOfService: string
  }
  common: {
    submit: string
    cancel: string
    save: string
    loading: string
    error: string
    empty: string
  }
}
```

```ts
// src/locales/en.ts
import type { SharedLocale } from './types'

export const en: SharedLocale = {
  nav: {
    home: 'Home',
    about: 'About',
    pricing: 'Pricing',
    signIn: 'Sign in',
    signOut: 'Sign out',
  },
  footer: {
    tagline: 'Built for teams that move fast.',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
  },
  common: {
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save changes',
    loading: 'Loading...',
    error: 'Something went wrong. Please try again.',
    empty: 'Nothing here yet.',
  },
}
```

Implement `pt.ts` (and every other language in `LOCALES`) with the same structure and the same `: SharedLocale` annotation.

---

## 4. Route-Scoped Locale Files

Each `page.tsx` gets a `_locales/` sibling folder containing one file per language and a `types.ts`. This folder is private to the route, no other route imports from it.

```
src/app/(marketing)/
├── page.tsx
└── _locales/
    ├── types.ts    ← defines the page's locale shape and re-exports component prop types
    ├── en.ts
    └── pt.ts
```

### 4a. Define types first

The `_locales/types.ts` file defines the full shape of content for that page. Each section of the page gets its own named interface. These interfaces double as the prop types for the route's `_components/`.

```ts
// src/app/(marketing)/_locales/types.ts

export interface HeroSectionProps {
  headline: string
  subheadline: string
  ctaPrimary: string
  ctaSecondary: string
}

export interface FeaturesSectionProps {
  heading: string
  items: Array<{ title: string; body: string }>
}

export interface CtaSectionProps {
  heading: string
  body: string
  button: string
}

export interface MarketingHomeLocale {
  meta: {
    title: string
    description: string
  }
  hero: HeroSectionProps
  features: FeaturesSectionProps
  cta: CtaSectionProps
}
```

### 4b. Implement each language file

```ts
// src/app/(marketing)/_locales/en.ts
import type { MarketingHomeLocale } from './types'

export const en: MarketingHomeLocale = {
  meta: {
    title: 'Ship faster, Acme',
    description: 'The platform built for teams that need to move quickly without cutting corners.',
  },
  hero: {
    headline: 'Ship faster. Stay sane.',
    subheadline: 'The platform built for teams that need to move quickly without cutting corners.',
    ctaPrimary: 'Get started free',
    ctaSecondary: 'See how it works',
  },
  features: {
    heading: 'Everything you need',
    items: [
      { title: 'Fast deploys', body: 'Push to production in seconds, not minutes.' },
      { title: 'Type-safe', body: 'Every edge covered at compile time.' },
      { title: 'Scalable', body: 'Grows with your team from 1 to 1,000.' },
    ],
  },
  cta: {
    heading: 'Ready to start?',
    body: 'Join thousands of teams already using the platform.',
    button: 'Create your account',
  },
}
```

Implement the `pt.ts` (and every other locale in `LOCALES`) with identical structure and `: MarketingHomeLocale` annotation.

Repeat this pattern, `types.ts` then one file per language, for every route that has a `page.tsx`.

---

## 5. Updating Existing page.tsx Files

This is the only change made to existing route files. Each `page.tsx` gains a `getLocale()` call, imports the shared and route locale maps, and passes content as props to its components.

The components themselves do not change. They already accept strings as props.

```tsx
// src/app/(marketing)/page.tsx
import { getLocale } from '@/lib/locale'
import { en as sharedEn, pt as sharedPt } from '@/locales'
import { en as homeEn, pt as homePt } from './_locales'
import type { Locale } from '@/locales/config'
import { HeroSection } from './_components/HeroSection'
import { FeaturesSection } from './_components/FeaturesSection'
import { CtaSection } from './_components/CtaSection'
import { SiteHeader } from '@/components/organisms/SiteHeader/SiteHeader'
import type { Metadata } from 'next'

const shared = { en: sharedEn, pt: sharedPt } satisfies Record<Locale, typeof sharedEn>
const home = { en: homeEn, pt: homePt } satisfies Record<Locale, typeof homeEn>

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = home[locale]
  return {
    title: t.meta.title,
    description: t.meta.description,
  }
}

export default async function HomePage() {
  const locale = await getLocale()
  const s = shared[locale]
  const t = home[locale]

  return (
    <>
      <SiteHeader {...s.nav} locale={locale} />
      <HeroSection {...t.hero} />
      <FeaturesSection heading={t.features.heading} items={t.features.items} />
      <CtaSection {...t.cta} />
    </>
  )
}
```

The `satisfies Record<Locale, ...>` constraint on the locale maps means TypeScript will error if a language is missing from the map. This is the compile-time completeness check.

---

## 6. The Language Switcher Component

Add this to `src/components/molecules/LocaleSwitcher/`. It is a Client Component. It sets the cookie then calls `router.refresh()`, which re-runs all Server Components with the new cookie value. No page reload.

```tsx
// src/components/molecules/LocaleSwitcher/LocaleSwitcher.tsx
'use client'

import { useRouter } from 'next/navigation'
import { LOCALE_COOKIE, LOCALES } from '@/locales/config'
import type { Locale } from '@/locales/config'

interface LocaleSwitcherProps {
  current: Locale
}

export function LocaleSwitcher({ current }: LocaleSwitcherProps) {
  const router = useRouter()

  function handleChange(locale: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; SameSite=Lax`
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2">
      {LOCALES.map((locale) => (
        <button
          key={locale}
          onClick={() => handleChange(locale)}
          aria-current={locale === current ? 'true' : undefined}
          className="text-xs font-mono uppercase text-neutral-500 hover:text-neutral-900 aria-[current=true]:font-medium aria-[current=true]:text-neutral-900"
        >
          {locale}
        </button>
      ))}
    </div>
  )
}
```

The `SiteHeader` organism receives `locale` as a prop from the page and passes it to `LocaleSwitcher`. The header itself does not call `getLocale()`.

---

## 7. Client Components That Need the Locale

Most Client Components already receive translated strings as props and need nothing else. The one exception is a component that formats dynamic values using the `Intl` API, for example, dates, numbers, or relative times, where the locale string itself is required at runtime.

Pass the locale string as a prop from the nearest Server Component ancestor. Do not reach for a store or context.

```tsx
// src/components/atoms/RelativeTime/RelativeTime.tsx
'use client'

import type { Locale } from '@/locales/config'

interface RelativeTimeProps {
  date: Date
  locale: Locale
}

export function RelativeTime({ date, locale }: RelativeTimeProps) {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const diff = Math.round((date.getTime() - Date.now()) / 1000 / 60)
  return <time dateTime={date.toISOString()}>{rtf.format(diff, 'minute')}</time>
}
```

---

## 8. Rules for This Phase

- Every language in `LOCALES` must have a file in `src/locales/` and in every route's `_locales/` folder. Missing files are TypeScript errors.
- No locale type may use optional fields (`?`). Every string is required. A missing translation is a build error.
- Components never import locale files. They receive strings as props only.
- Shared strings (nav, footer, common UI) go in `src/locales/` only, never duplicated into route `_locales/` folders.
- Route `_locales/` files are private. No other route or shared component imports from them.
- `getLocale()` is the only function that reads the locale cookie. Nothing else touches it server-side.
- The `LocaleSwitcher` receives the current locale as a prop. It does not read the cookie on the client.
- Do not use Zustand or React Context to distribute locale content or the current locale string. Props are sufficient.

---

## 9. What the Finished File Tree Looks Like

Only new files and folders are shown. Nothing else changes.

```
src/
├── lib/
│   └── locale.ts                           # NEW
│
├── locales/                                # NEW folder
│   ├── config.ts
│   ├── types.ts
│   ├── en.ts
│   └── pt.ts
│
├── components/
│   └── molecules/
│       └── LocaleSwitcher/                 # NEW
│           └── LocaleSwitcher.tsx
│
└── app/
    ├── (marketing)/
    │   ├── page.tsx                        # UPDATED, getLocale + locale props
    │   ├── _locales/                       # NEW folder
    │   │   ├── types.ts
    │   │   ├── en.ts
    │   │   └── pt.ts
    │   └── about/
    │       ├── page.tsx                    # UPDATED
    │       └── _locales/                   # NEW folder
    │           ├── types.ts
    │           ├── en.ts
    │           └── pt.ts
    └── (app)/
        └── dashboard/
            ├── page.tsx                    # UPDATED
            └── _locales/                   # NEW folder
                ├── types.ts
                ├── en.ts
                └── pt.ts
```
