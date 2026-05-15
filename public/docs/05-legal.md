# Portugal Tattoo — Starter: Legal Pages

All legal pages are under the `/legal` route. They are static, server-rendered, and SEO-indexed (no `robots: noindex`). All content is in English by default with locale variants for PT and ES.

The boilerplate below is written for a Portugal-based business subject to Portuguese law and EU GDPR. It is not legal advice. Each client should have a qualified lawyer review before publishing.

---

## Route Structure

```
/legal                    → Index page (links to all policies)
/legal/privacy            → Privacy Policy
/legal/terms              → Terms of Service (includes refund terms)
/legal/cookies            → Cookie Policy
/legal/refunds            → Refund Policy (standalone)
```

---

## Legal Layout

**File:** `src/app/[locale]/legal/layout.tsx`

```tsx
// src/app/[locale]/legal/layout.tsx
import { Nav } from '@/components/landing/Nav'
import { Footer } from '@/components/landing/Footer'
import { Separator } from '@/components/ui/separator'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-4 py-16">
        {children}
      </main>
      <Separator />
      <Footer />
    </>
  )
}
```

---

## Legal Index

**File:** `src/app/[locale]/legal/page.tsx`

```tsx
// src/app/[locale]/legal/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Legal — Portugal Tattoo',
  description: 'Privacy policy, terms of service, cookie policy, and refund policy for Portugal Tattoo.',
}

const LEGAL_PAGES = [
  { href: '/legal/privacy', title: 'Privacy Policy', desc: 'How we collect, use, and protect your personal data.' },
  { href: '/legal/terms', title: 'Terms of Service', desc: 'The terms that govern your use of our platform and services.' },
  { href: '/legal/cookies', title: 'Cookie Policy', desc: 'What cookies we use, why, and how to manage them.' },
  { href: '/legal/refunds', title: 'Refund Policy', desc: '30-day money-back guarantee and refund conditions.' },
]

export default function LegalIndexPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Legal</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Our policies and terms of service. Last reviewed: April 2026.
        </p>
      </div>

      <div className="space-y-3">
        {LEGAL_PAGES.map((page) => (
          <Link key={page.href} href={page.href}>
            <Card className="hover:border-foreground/30 transition-colors">
              <CardContent className="py-4 px-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{page.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{page.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

---

## Legal Page Base Component

Shared wrapper for all legal content pages:

```tsx
// src/components/legal/LegalLayout.tsx
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { ChevronLeft } from 'lucide-react'

interface LegalLayoutProps {
  title: string
  lastUpdated: string
  children: React.ReactNode
}

export function LegalPageWrapper({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <article className="space-y-8">
      <div>
        <Link
          href="/legal"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronLeft className="h-3 w-3" />
          Legal
        </Link>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="text-xs text-muted-foreground mt-1 font-mono">
          Last updated: {lastUpdated}
        </p>
      </div>

      <Separator />

      <div className="prose prose-sm max-w-none text-foreground [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-sm [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:text-sm [&_ul]:text-muted-foreground [&_li]:mb-1 [&_a]:underline [&_a]:underline-offset-2">
        {children}
      </div>
    </article>
  )
}
```

---

## Privacy Policy

**File:** `src/app/[locale]/legal/privacy/page.tsx`

```tsx
// src/app/[locale]/legal/privacy/page.tsx
import type { Metadata } from 'next'
import { LegalPageWrapper } from '@/components/legal/LegalLayout'

export const metadata: Metadata = {
  title: 'Privacy Policy — Portugal Tattoo',
  description: 'How Portugal Tattoo collects, uses, and protects your personal data.',
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPageWrapper title="Privacy Policy" lastUpdated="April 2026">
      <h2>1. Who We Are</h2>
      <p>
        This website is operated by [STUDIO_NAME], a business based in Portugal. We are the data
        controller for the personal data collected through this website. For questions about this
        policy, contact us at [CONTACT_EMAIL].
      </p>

      <h2>2. What Data We Collect</h2>
      <p>We collect the following personal data:</p>
      <ul>
        <li><strong>Booking data:</strong> name, email address, phone number (optional), and the details of your appointment as provided when you make a booking through Cal.com.</li>
        <li><strong>Communication data:</strong> messages you send through our chatbot or contact form.</li>
        <li><strong>Technical data:</strong> your IP address, browser type, and device information, collected automatically when you visit our site.</li>
        <li><strong>Cookie data:</strong> preferences stored in cookies, including your language preference and cookie consent status. See our Cookie Policy for details.</li>
      </ul>

      <h2>3. Why We Collect Your Data (Legal Basis)</h2>
      <p>We process your personal data on the following legal bases under the GDPR (Regulation (EU) 2016/679):</p>
      <ul>
        <li><strong>Contract performance (Art. 6(1)(b) GDPR):</strong> to fulfil bookings you make with us, including sending confirmation and reminder emails.</li>
        <li><strong>Legitimate interests (Art. 6(1)(f) GDPR):</strong> to operate our website securely, prevent abuse, and improve our services.</li>
        <li><strong>Consent (Art. 6(1)(a) GDPR):</strong> where you have given explicit consent, for example by accepting optional analytics cookies.</li>
        <li><strong>Legal obligation (Art. 6(1)(c) GDPR):</strong> where required by Portuguese or EU law.</li>
      </ul>

      <h2>4. How We Use Your Data</h2>
      <p>We use your data to:</p>
      <ul>
        <li>Process and confirm your booking.</li>
        <li>Send booking confirmation and reminder emails.</li>
        <li>Respond to enquiries submitted through the chatbot or contact form.</li>
        <li>Improve our website and booking system.</li>
        <li>Comply with our legal obligations.</li>
      </ul>

      <h2>5. Who We Share Your Data With</h2>
      <p>We share your data only with trusted service providers acting as data processors:</p>
      <ul>
        <li><strong>Cal.com</strong> — our booking calendar platform. Your booking details are stored and processed by Cal.com. See Cal.com's privacy policy at cal.com/privacy.</li>
        <li><strong>Supabase</strong> — our database provider. Data is stored in EU data centres. See supabase.com/privacy.</li>
        <li><strong>Resend</strong> — our email delivery service for confirmation and reminder emails.</li>
        <li><strong>Vercel</strong> — our hosting provider. See vercel.com/legal/privacy-policy.</li>
        <li><strong>OpenAI</strong> — our AI chatbot provider. Chatbot conversation messages may be processed by OpenAI. We do not send personally identifiable booking data to OpenAI. See openai.com/privacy.</li>
      </ul>
      <p>We do not sell your personal data to third parties.</p>

      <h2>6. International Transfers</h2>
      <p>
        Some of our service providers are based outside the European Economic Area. Where data is
        transferred internationally, we ensure appropriate safeguards are in place, including
        Standard Contractual Clauses approved by the European Commission.
      </p>

      <h2>7. How Long We Keep Your Data</h2>
      <ul>
        <li><strong>Booking records:</strong> retained for 3 years from the date of the appointment, as required for accounting and legal purposes under Portuguese law.</li>
        <li><strong>Chatbot conversations:</strong> not retained beyond the session. We do not log chatbot message history.</li>
        <li><strong>Cookie data:</strong> consent cookies expire after 365 days.</li>
        <li><strong>Technical logs:</strong> retained for up to 90 days for security and debugging purposes.</li>
      </ul>

      <h2>8. Your Rights Under GDPR</h2>
      <p>Under the GDPR, you have the following rights regarding your personal data:</p>
      <ul>
        <li><strong>Right of access:</strong> to receive a copy of the personal data we hold about you.</li>
        <li><strong>Right to rectification:</strong> to have inaccurate data corrected.</li>
        <li><strong>Right to erasure:</strong> to request deletion of your data, subject to legal retention requirements.</li>
        <li><strong>Right to restriction:</strong> to restrict processing in certain circumstances.</li>
        <li><strong>Right to data portability:</strong> to receive your data in a structured, machine-readable format.</li>
        <li><strong>Right to object:</strong> to processing based on legitimate interests.</li>
        <li><strong>Right to withdraw consent:</strong> where processing is based on consent, to withdraw it at any time without affecting the lawfulness of prior processing.</li>
      </ul>
      <p>
        To exercise any of these rights, contact us at [CONTACT_EMAIL]. We will respond within 30 days.
        If you believe your rights have been violated, you have the right to lodge a complaint with the
        Portuguese data protection authority, the{' '}
        <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer">
          Comissão Nacional de Proteção de Dados (CNPD)
        </a>.
      </p>

      <h2>9. Security</h2>
      <p>
        We implement appropriate technical and organisational measures to protect your personal data
        against unauthorised access, alteration, disclosure, or destruction. This includes encrypted
        data transmission (HTTPS), access controls, and regular security reviews.
      </p>

      <h2>10. Children</h2>
      <p>
        Our services are not directed at children under the age of 16. We do not knowingly collect
        personal data from children. If you believe we have collected data from a child, please
        contact us immediately.
      </p>

      <h2>11. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of material changes
        by posting the updated policy on this page with a new "last updated" date.
      </p>

      <h2>12. Contact</h2>
      <p>
        For any questions or requests regarding this Privacy Policy, contact us at{' '}
        <a href="mailto:[CONTACT_EMAIL]">[CONTACT_EMAIL]</a>.
      </p>
    </LegalPageWrapper>
  )
}
```

---

## Terms of Service

**File:** `src/app/[locale]/legal/terms/page.tsx`

```tsx
// src/app/[locale]/legal/terms/page.tsx
import type { Metadata } from 'next'
import { LegalPageWrapper } from '@/components/legal/LegalLayout'

export const metadata: Metadata = {
  title: 'Terms of Service — Portugal Tattoo',
  description: 'Terms and conditions for using Portugal Tattoo services.',
}

export default function TermsPage() {
  return (
    <LegalPageWrapper title="Terms of Service" lastUpdated="April 2026">
      <p>
        These Terms of Service govern your use of the website and services operated by [STUDIO_NAME]
        ("we", "us", "our"), a business registered in Portugal. By using our website or making a
        booking, you agree to these terms.
      </p>

      <h2>1. Services</h2>
      <p>
        We provide professional tattoo services including consultations, custom tattoo design, and
        tattooing. All services are provided at our studio in Portugal. We reserve the right to
        refuse any service at our discretion.
      </p>

      <h2>2. Bookings</h2>
      <p>
        Bookings are made through our website via Cal.com, our scheduling platform. By making a
        booking you confirm that:
      </p>
      <ul>
        <li>You are at least 18 years of age. We do not tattoo minors under any circumstances.</li>
        <li>The information you provide is accurate and complete.</li>
        <li>You will attend the appointment at the confirmed time, or cancel with reasonable notice.</li>
      </ul>

      <h2>3. Deposits</h2>
      <p>
        A deposit may be required to confirm certain appointment types. The deposit amount will be
        communicated during the consultation. Deposits are:
      </p>
      <ul>
        <li>Non-refundable if you cancel with less than 48 hours' notice.</li>
        <li>Transferable to a rescheduled appointment if you cancel with at least 48 hours' notice.</li>
        <li>Returned in full if we cancel or reschedule your appointment.</li>
      </ul>

      <h2>4. Cancellation and Rescheduling</h2>
      <p>To cancel or reschedule a booking:</p>
      <ul>
        <li>Use the link in your booking confirmation email (sent via Cal.com).</li>
        <li>Contact us directly at [CONTACT_EMAIL].</li>
      </ul>
      <p>
        We ask for at least 48 hours' notice for cancellations and reschedules. Late cancellations
        or no-shows may result in loss of deposit and may affect future booking eligibility.
      </p>

      <h2>5. Health and Safety</h2>
      <p>
        By booking an appointment, you confirm that you are in good health and that none of the
        following conditions apply to you without prior medical clearance: pregnancy, blood-thinning
        medication, skin conditions at the tattoo site, compromised immune system. You accept
        responsibility for disclosing any relevant medical conditions before your appointment.
      </p>
      <p>
        We reserve the right to refuse to tattoo any client who appears to be under the influence
        of alcohol or drugs, or who presents a medical condition that in our professional judgement
        makes the procedure inadvisable.
      </p>

      <h2>6. Aftercare</h2>
      <p>
        We will provide aftercare instructions following your appointment. The quality of healing
        depends substantially on following these instructions. We are not liable for complications
        arising from failure to follow our aftercare guidance.
      </p>

      <h2>7. Intellectual Property</h2>
      <p>
        All original tattoo designs created by our artists remain the intellectual property of
        [STUDIO_NAME] until the tattoo is completed and payment is received in full. We may use
        photographs of completed work for our portfolio, social media, and marketing, unless you
        explicitly request otherwise before your appointment.
      </p>

      <h2>8. Liability</h2>
      <p>
        To the extent permitted by Portuguese law, our liability for any claim arising from our
        services is limited to the amount paid for the specific service giving rise to the claim.
        We are not liable for indirect, consequential, or punitive damages.
      </p>

      <h2>9. Refunds</h2>
      <p>
        Our full refund policy is set out in the{' '}
        <a href="/legal/refunds">Refund Policy</a>.
        The 30-day money-back guarantee applies only to platform subscription fees paid to Portugal
        Tattoo (the booking platform operator), not to individual tattoo services.
      </p>

      <h2>10. Governing Law</h2>
      <p>
        These Terms are governed by the law of Portugal. Any disputes arising from these Terms or
        our services shall be subject to the exclusive jurisdiction of the Portuguese courts,
        without prejudice to your rights as a consumer under EU law.
      </p>

      <h2>11. Consumer Rights</h2>
      <p>
        If you are a consumer resident in the EU, you have rights under applicable consumer
        protection legislation including the right to Alternative Dispute Resolution (ADR). The
        European Commission operates an online dispute resolution platform at{' '}
        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
          ec.europa.eu/consumers/odr
        </a>.
      </p>

      <h2>12. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of our services after changes
        are posted constitutes acceptance of the updated Terms.
      </p>

      <h2>13. Contact</h2>
      <p>
        For any questions about these Terms, contact us at{' '}
        <a href="mailto:[CONTACT_EMAIL]">[CONTACT_EMAIL]</a>.
      </p>
    </LegalPageWrapper>
  )
}
```

---

## Cookie Policy

**File:** `src/app/[locale]/legal/cookies/page.tsx`

```tsx
// src/app/[locale]/legal/cookies/page.tsx
import type { Metadata } from 'next'
import { LegalPageWrapper } from '@/components/legal/LegalLayout'

export const metadata: Metadata = {
  title: 'Cookie Policy — Portugal Tattoo',
  description: 'What cookies we use and how to manage them.',
}

export default function CookiePolicyPage() {
  return (
    <LegalPageWrapper title="Cookie Policy" lastUpdated="April 2026">
      <p>
        This Cookie Policy explains how [STUDIO_NAME] uses cookies and similar technologies on
        this website. This policy is provided in accordance with EU Directive 2002/58/EC (the
        ePrivacy Directive) as transposed into Portuguese law, and the GDPR.
      </p>

      <h2>1. What Are Cookies</h2>
      <p>
        Cookies are small text files placed on your device by a website you visit. They are used to
        remember information about you and your preferences. Cookies set by the website operator
        are called "first-party cookies". Cookies set by other parties are called "third-party
        cookies".
      </p>

      <h2>2. Cookies We Use</h2>
      <p>We use the following cookies on this website:</p>

      <h2>2.1 Strictly Necessary Cookies</h2>
      <p>
        These cookies are essential for the website to function and cannot be disabled. They do not
        require your consent under the ePrivacy Directive.
      </p>
      <ul>
        <li>
          <strong>pt_cookie_consent</strong> — Stores your cookie consent preference (accepted/declined).
          Expires: 365 days. First-party.
        </li>
        <li>
          <strong>NEXT_LOCALE</strong> — Stores your language preference (en/pt/es).
          Expires: Session or as set by browser. First-party.
        </li>
        <li>
          <strong>sb-*</strong> — Supabase authentication session cookies. Used only when you are
          logged in as an admin. First-party.
        </li>
      </ul>

      <h2>2.2 Functional Cookies</h2>
      <p>
        These cookies remember your preferences to personalise your experience. They require your
        consent.
      </p>
      <ul>
        <li>
          <strong>cal.com cookies</strong> — Set by the Cal.com booking embed. Used to maintain
          your booking session state. Third-party (Cal.com).
        </li>
      </ul>

      <h2>2.3 Analytics Cookies</h2>
      <p>
        We do not currently use analytics cookies. If we introduce them in future, we will update
        this policy and request your consent.
      </p>

      <h2>2.4 Marketing Cookies</h2>
      <p>We do not use marketing or advertising cookies on this website.</p>

      <h2>3. Your Choices</h2>
      <p>
        When you first visit our website, a cookie consent banner is displayed. You can accept or
        decline non-essential cookies. You can change your preference at any time by clearing your
        cookies in your browser settings, which will reset your consent on the next visit.
      </p>
      <p>You can also control cookies through your browser:</p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Chrome</a></li>
        <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer">Firefox</a></li>
        <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
        <li><a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">Edge</a></li>
      </ul>
      <p>
        Note that disabling strictly necessary cookies will affect the core functionality of the
        website, including the booking system.
      </p>

      <h2>4. Contact</h2>
      <p>
        For questions about this Cookie Policy, contact us at{' '}
        <a href="mailto:[CONTACT_EMAIL]">[CONTACT_EMAIL]</a>.
      </p>
    </LegalPageWrapper>
  )
}
```

---

## Refund Policy

**File:** `src/app/[locale]/legal/refunds/page.tsx`

```tsx
// src/app/[locale]/legal/refunds/page.tsx
import type { Metadata } from 'next'
import { LegalPageWrapper } from '@/components/legal/LegalLayout'

export const metadata: Metadata = {
  title: 'Refund Policy — Portugal Tattoo',
  description: '30-day money-back guarantee and refund conditions.',
}

export default function RefundPolicyPage() {
  return (
    <LegalPageWrapper title="Refund Policy" lastUpdated="April 2026">
      <p>
        This Refund Policy applies to subscriptions to the Portugal Tattoo platform (the "Service"),
        operated on behalf of [STUDIO_NAME]. It does not apply to individual tattoo appointments —
        appointment cancellation terms are set out in the Terms of Service.
      </p>

      <h2>1. 30-Day Money-Back Guarantee</h2>
      <p>
        We offer a <strong>30-day money-back guarantee</strong> on all new Starter plan subscriptions.
        If you are not satisfied with the Service for any reason, you may request a full refund
        within <strong>30 calendar days</strong> of the start date of your subscription.
      </p>
      <p>
        To request a refund under the 30-day guarantee, contact us at{' '}
        <a href="mailto:[CONTACT_EMAIL]">[CONTACT_EMAIL]</a> with the subject line "Refund Request"
        and include your subscription details. Refunds are processed within 10 business days.
      </p>

      <h2>2. Refunds After 30 Days</h2>
      <p>
        Refunds are not available after the 30-day guarantee period has elapsed, except in the
        following circumstances:
      </p>
      <ul>
        <li>
          <strong>Service unavailability:</strong> if the Service has been unavailable for more than
          72 consecutive hours in a calendar month due to causes within our control, you are entitled
          to a proportional credit or refund for that month.
        </li>
        <li>
          <strong>Billing error:</strong> if you have been charged incorrectly, we will refund the
          difference promptly.
        </li>
        <li>
          <strong>Legal cancellation right:</strong> if you are a consumer in the EU, you have a
          statutory 14-day right of withdrawal from distance contracts under Directive 2011/83/EU
          as transposed into Portuguese law (Decree-Law No. 24/2014). This right applies to the
          initial purchase only and is subject to the exception for digital services that have
          already commenced with your consent.
        </li>
      </ul>

      <h2>3. Annual Subscriptions</h2>
      <p>
        Annual subscriptions are paid in full upfront. Aside from the 30-day guarantee period,
        annual subscriptions are not refundable on a pro-rata basis if you cancel mid-term. Your
        subscription will remain active until the end of the paid period.
      </p>

      <h2>4. How to Cancel</h2>
      <p>
        To cancel your subscription at the end of the current billing period, contact us at{' '}
        <a href="mailto:[CONTACT_EMAIL]">[CONTACT_EMAIL]</a>. Cancellations take effect at the
        end of the current billing period. You will not be charged again after cancellation, and
        your Service will remain active until the period ends.
      </p>

      <h2>5. Tattoo Appointment Deposits</h2>
      <p>
        Tattoo appointment deposits (paid to the artist directly, not to the platform) are governed
        by the deposit terms set out in the Terms of Service, not by this Refund Policy.
      </p>

      <h2>6. How Refunds Are Processed</h2>
      <p>
        Refunds are returned to the original payment method. Processing times depend on your payment
        provider but are typically within 5–10 business days after we approve the refund.
      </p>

      <h2>7. Contact</h2>
      <p>
        For all refund requests or questions about this policy, contact us at{' '}
        <a href="mailto:[CONTACT_EMAIL]">[CONTACT_EMAIL]</a>.
      </p>
    </LegalPageWrapper>
  )
}
```

---

## Template Variables

Before deploying, replace the following placeholders across all legal pages:

| Placeholder | Replace with |
|---|---|
| `[STUDIO_NAME]` | The artist or studio's legal trading name |
| `[CONTACT_EMAIL]` | The contact email address for legal enquiries |

These values should ideally be pulled from `site_settings` dynamically, rather than hardcoded.

### Dynamic Legal Pages (Optional Enhancement)

To pull studio name and email from Supabase dynamically:

```tsx
// In each legal page component, add at the top:
import { createServerClient } from '@/lib/supabase/server'

// Inside the component:
const supabase = await createServerClient()
const { data: settings } = await supabase
  .from('site_settings')
  .select('studio_name, contact_email')
  .single()

const studioName = settings?.studio_name ?? 'Portugal Tattoo'
const contactEmail = settings?.contact_email ?? 'hello@portugaltattoo.com'

// Then replace [STUDIO_NAME] and [CONTACT_EMAIL] in the JSX with variables.
// Add export const revalidate = 3600  // Revalidate every hour
```

---

## robots.txt Considerations

Legal pages should be indexed. Ensure the following in `public/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /auth
Disallow: /api/

Sitemap: https://yourdomain.com/sitemap.xml
```

---

## Sitemap

Add legal pages to the sitemap:

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourdomain.com'

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/booking`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/legal`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/legal/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/legal/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/legal/cookies`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/legal/refunds`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]
}
```

---

*Last updated: April 2026*
