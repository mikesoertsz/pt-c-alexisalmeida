# 05 — SEO and Meta

**Basic SEO is included in the Starter Package.** This document defines
exactly what that means and what must be in place before launch.

---

## What "Basic SEO" means for this package

- Correct page title and meta description
- Open Graph tags for social sharing
- Canonical URL
- Structured data (LocalBusiness / TattooParlor schema)
- Sitemap
- robots.txt
- Google Search Console verified
- Core Web Vitals passing
- Alt text on all images

It does not include keyword research, backlink building, blog content, or
ongoing optimisation. Those are Growth tier deliverables.

---

## Page title

**Template:**  
`[Studio Name] — Custom Tattoo Studio in [City], Portugal`

**Example (Aura):**  
`Aura Tattoo & Meaning — Custom Tattoo Studio in Albufeira, Portugal`

Rules:
- Maximum 60 characters
- Studio name first
- City name included (local SEO)
- "Portugal" included (search intent: tourists, expats)
- No keyword stuffing

**Current state:** Set correctly in `app/page.tsx` and `app/layout.tsx`.
Confirm it matches the client's actual name and location before launch.

---

## Meta description

**Template:**  
`Custom tattoo designs crafted with intention. Book your free consultation at [Studio Name] — a boutique studio in [City] specialising in [top 2–3 styles].`

**Rules:**
- 140–160 characters
- Includes city name
- Mentions the booking CTA ("Book your free consultation")
- Lists the studio's actual specialties — do not use generic terms
- No duplicate of the title

**Current state:** Set in `app/page.tsx` and `app/layout.tsx`. Update with
client-specific styles before launch.

---

## Open Graph

Required tags are already in `app/layout.tsx`:

```ts
openGraph: {
  title: "...",
  description: "...",
  images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
}
```

**Action required:**
- Create `/public/og-image.jpg` at exactly 1200×630px (issue F6)
- The OG image should show portfolio work or the studio, with the studio name
  as text overlay in the brand palette
- Test using the Facebook Sharing Debugger and LinkedIn post inspector after
  launch

---

## Canonical URL and hreflang

Set in `app/[locale]/page.tsx` via `generateMetadata`. All three locale routes
are implemented at launch — English at `/`, Portuguese at `/pt`, German at `/de`:

```ts
alternates: {
  canonical: locale === 'en' ? baseUrl : `${baseUrl}/${locale}`,
  languages: {
    'en': baseUrl,
    'pt': `${baseUrl}/pt`,
    'de': `${baseUrl}/de`,
    'x-default': baseUrl,   // x-default points to English root
  },
}
```

All three locale URLs must return HTTP 200 for the hreflang tags to be valid.
The `x-default` value tells Google which page to show when no locale matches
the user's language. See `10-i18n.md` for the full route structure and
`generateMetadata` implementation.

---

## Structured data

Structured data is already in `app/page.tsx` as a JSON-LD script. Current
schema type is `TattooParlor` (a subtype of `LocalBusiness`).

**Required fields to populate before launch:**

```json
{
  "@context": "https://schema.org",
  "@type": "TattooParlor",
  "name": "CLIENT STUDIO NAME",
  "description": "CLIENT DESCRIPTION",
  "url": "https://CLIENT-DOMAIN",
  "telephone": "CLIENT PHONE",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "CLIENT STREET ADDRESS",
    "addressLocality": "CLIENT CITY",
    "addressRegion": "CLIENT REGION",
    "postalCode": "CLIENT POSTAL CODE",
    "addressCountry": "PT"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "CLIENT LAT",
    "longitude": "CLIENT LNG"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "10:00",
      "closes": "18:00"
    }
  ],
  "image": "https://CLIENT-DOMAIN/og-image.jpg",
  "priceRange": "€€",
  "availableLanguage": ["English", "Portuguese", "German"],
  "areaServed": { "@type": "Country", "name": "Portugal" }
}
```

**What to fix in the current code:**
- `url`, `telephone`, `address.streetAddress`, `address.postalCode`, `geo`
  are all missing from the current structured data object in `page.tsx`
- These must be added before launch
- Validate the output at https://validator.schema.org after deployment

---

## Sitemap

Create `app/sitemap.ts` (Next.js 14+ built-in sitemap support):

```ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://CLIENT-DOMAIN";
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/legal/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
```

Add legal pages to the sitemap once they exist. Do not include `/legal/gdpr`
and `/legal/cookies` — these are supporting pages, not indexable content.

---

## robots.txt

Create `app/robots.ts`:

```ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://CLIENT-DOMAIN";
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

---

## Image alt text

Every image on the site must have a descriptive `alt` attribute.

| Image | Alt text pattern |
|---|---|
| Gallery images | Describe the tattoo: style, subject, placement — e.g. "Fine line botanical tattoo on inner forearm" |
| Artist photos | "[Artist name], tattoo artist at [Studio name]" |
| Studio photos | "[Studio name] interior, Albufeira, Portugal" |
| OG image | Not applicable (meta tag, not an `<img>`) |

Alt text on gallery images contributes to image search ranking for terms like
"fine line tattoo Portugal" and "tattoo artist Albufeira".

---

## Google Search Console

1. Add the site to Google Search Console after the domain is live
2. Verify ownership via the Vercel DNS TXT record method
3. Submit the sitemap URL: `https://CLIENT-DOMAIN/sitemap.xml`
4. Monitor for crawl errors and Core Web Vitals issues in the first 2 weeks
   after launch

---

## Core Web Vitals

The following must pass before launch (test at pagespeed.web.dev):

| Metric | Target |
|---|---|
| LCP (Largest Contentful Paint) | Under 2.5s |
| CLS (Cumulative Layout Shift) | Under 0.1 |
| INP (Interaction to Next Paint) | Under 200ms |

Common failure causes in this codebase:
- Gallery images without `sizes` prop on `<Image>` (already set correctly)
- Missing `width`/`height` on images causing layout shift
- Video section loading a large video without lazy loading
- Embla carousel importing JS that blocks the main thread

Use `next/image` for all images. Do not use `<img>` tags. Use
`loading="lazy"` on below-fold images (Next.js does this by default for
non-priority images).

---

## Local SEO notes

The most valuable search queries for a tattoo studio in Portugal are local:

- "tattoo artist [city]"
- "tattoo studio [city] Portugal"
- "fine line tattoo [city]"
- "[style] tattoo Portugal"

The page title, meta description, structured data address, and alt text on
portfolio images are the main on-page signals for these terms. The Google
Business Profile (claimed and verified) is the most important off-page signal
— this is not part of the site build but must be in place at launch.
