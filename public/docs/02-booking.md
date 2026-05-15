# Portugal Tattoo — Starter: Booking Functionality

**All Starter customers use Cal.com as their booking calendar solution.**  
Cal.com is an open-source scheduling platform (MIT licensed) that can be self-hosted or used via Cal.com Cloud.

---

## Overview

The booking system allows clients to:

1. View available slots for a consultation or appointment
2. Book a slot directly from the website (no DMs, no WhatsApp back-and-forth)
3. Receive an automated confirmation email
4. Receive an automated reminder email (24h before)
5. Cancel or reschedule via a link in the confirmation email

The artist can:
1. Manage all bookings from the admin dashboard
2. Set and update their availability
3. Block time off
4. View upcoming, past, and cancelled bookings
5. Manually create or cancel bookings

---

## Cal.com Setup

### Option A: Cal.com Cloud (Recommended for Starter)

- Register at [cal.com](https://cal.com)
- Create an event type called `consultation` (15–30 min) and optionally `appointment` (60–120 min)
- Set availability schedule (weekly hours + time zone)
- Copy the username slug (e.g., `artist-porto`) for the embed

**Env vars:**
```env
NEXT_PUBLIC_CAL_USERNAME=artist-porto
NEXT_PUBLIC_CAL_EVENT_SLUG=consultation
CAL_API_KEY=cal_live_...
CAL_WEBHOOK_SECRET=whsec_...
```

### Option B: Self-hosted Cal.com

Deploy via Railway, Render, or a VPS. Point `NEXT_PUBLIC_CAL_URL` to the self-hosted instance.

```env
NEXT_PUBLIC_CAL_URL=https://cal.your-domain.com
NEXT_PUBLIC_CAL_USERNAME=artist-porto
NEXT_PUBLIC_CAL_EVENT_SLUG=consultation
CAL_API_KEY=cal_live_...
CAL_WEBHOOK_SECRET=whsec_...
```

The embed SDK handles both; pass `calOrigin` prop to `CalEmbed` when self-hosted.

---

## Booking Page

**Route:** `/booking`  
**File:** `src/app/[locale]/booking/page.tsx`

### Layout

```
┌─────────────────────────────────────────────────────┐
│  NAV                                                │
├─────────────────────────────────────────────────────┤
│  Book a consultation                                │
│  [subtitle]                                         │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  CAL.COM INLINE EMBED                       │   │
│  │  (month calendar + time slots + form)       │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Questions? Chat with us  [opens chatbot]           │
└─────────────────────────────────────────────────────┘
```

### Page Component

```tsx
// src/app/[locale]/booking/page.tsx
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Nav } from '@/components/landing/Nav'
import { Footer } from '@/components/landing/Footer'
import { CalEmbed } from '@/components/booking/CalEmbed'
import { Separator } from '@/components/ui/separator'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Book a consultation — Portugal Tattoo',
    description:
      'Pick a time that works for you. Consultations are free and take 15–30 minutes.',
    robots: { index: false },  // No-index booking pages
  }
}

interface BookingPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ cancelled?: string; reschedule?: string }>
}

export default async function BookingPage({ params, searchParams }: BookingPageProps) {
  const { locale } = await params
  const sp = await searchParams
  const t = await getTranslations({ locale, namespace: 'booking' })

  return (
    <>
      <Nav />
      <main className="min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground">
              {t('title')}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>

          {sp.cancelled && (
            <div className="mb-6 p-4 border border-border rounded-md bg-muted/40">
              <p className="text-sm text-foreground">
                Your booking has been cancelled. You can rebook below.
              </p>
            </div>
          )}

          <CalEmbed
            username={process.env.NEXT_PUBLIC_CAL_USERNAME!}
            eventSlug={process.env.NEXT_PUBLIC_CAL_EVENT_SLUG!}
            locale={locale}
          />

          <Separator className="my-10" />

          <p className="text-xs text-muted-foreground text-center">
            Have questions before booking?{' '}
            <button
              className="underline underline-offset-2 hover:text-foreground"
              onClick={() => {
                // Trigger chatbot open — emits custom event
                window.dispatchEvent(new CustomEvent('pt:chatbot:open'))
              }}
            >
              Chat with us
            </button>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
```

---

## Cal.com Embed Component

**File:** `src/components/booking/CalEmbed.tsx`

```tsx
// src/components/booking/CalEmbed.tsx
'use client'

import { useEffect } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'

interface CalEmbedProps {
  username: string
  eventSlug: string
  locale?: string
  calOrigin?: string  // For self-hosted instances
}

export function CalEmbed({ username, eventSlug, locale = 'en', calOrigin }: CalEmbedProps) {
  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi({ namespace: 'pt-booking' })
      cal('ui', {
        theme: 'light',
        hideEventTypeDetails: false,
        layout: 'month_view',
        locale: locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es' : 'en',
      })
    })()
  }, [locale])

  return (
    <Cal
      namespace="pt-booking"
      calLink={`${username}/${eventSlug}`}
      style={{ width: '100%', minHeight: '600px', overflow: 'scroll' }}
      config={{
        layout: 'month_view',
        theme: 'light',
        ...(calOrigin && { calOrigin }),
      }}
    />
  )
}
```

---

## Availability API Route

Used by the chatbot to check available slots.

**Route:** `GET /api/availability`  
**File:** `src/app/api/availability/route.ts`

### Query Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `date` | `YYYY-MM-DD` | No | Check availability for a specific date |
| `month` | `YYYY-MM` | No | Check availability for a whole month |
| `username` | `string` | No | Override Cal.com username |
| `event` | `string` | No | Override event slug |

### Response

```json
{
  "available": true,
  "slots": [
    {
      "time": "2024-01-15T10:00:00+00:00",
      "available": true
    },
    {
      "time": "2024-01-15T11:00:00+00:00",
      "available": true
    }
  ]
}
```

### Implementation

```typescript
// src/app/api/availability/route.ts
import { NextRequest, NextResponse } from 'next/server'

const CAL_API_BASE = 'https://api.cal.com/v1'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const month = searchParams.get('month')
  const username = searchParams.get('username') ?? process.env.NEXT_PUBLIC_CAL_USERNAME
  const eventSlug = searchParams.get('event') ?? process.env.NEXT_PUBLIC_CAL_EVENT_SLUG

  if (!username || !eventSlug) {
    return NextResponse.json({ error: 'Missing username or event slug' }, { status: 400 })
  }

  if (!date && !month) {
    // Default to today + 14 days
    const today = new Date().toISOString().split('T')[0]
    const twoWeeksOut = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]
    return fetchSlots(username, eventSlug, today, twoWeeksOut)
  }

  if (date) {
    return fetchSlots(username, eventSlug, date, date)
  }

  if (month) {
    const [year, mon] = month.split('-').map(Number)
    const start = `${month}-01`
    const lastDay = new Date(year, mon, 0).getDate()
    const end = `${month}-${lastDay.toString().padStart(2, '0')}`
    return fetchSlots(username, eventSlug, start, end)
  }

  return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
}

async function fetchSlots(
  username: string,
  eventSlug: string,
  startDate: string,
  endDate: string
): Promise<NextResponse> {
  try {
    const params = new URLSearchParams({
      apiKey: process.env.CAL_API_KEY!,
      username,
      eventTypeSlug: eventSlug,
      startTime: `${startDate}T00:00:00.000Z`,
      endTime: `${endDate}T23:59:59.000Z`,
      timeZone: 'Europe/Lisbon',
    })

    const res = await fetch(`${CAL_API_BASE}/slots?${params}`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 },  // Cache for 1 minute
    })

    if (!res.ok) {
      const error = await res.text()
      return NextResponse.json({ error: 'Cal.com API error', detail: error }, { status: 502 })
    }

    const data = await res.json()

    // Flatten the slots object into an array
    const slots = Object.entries(data.slots ?? {}).flatMap(([, times]) => times as { time: string }[])

    return NextResponse.json({
      available: slots.length > 0,
      slots,
      startDate,
      endDate,
    })
  } catch (err) {
    console.error('fetchSlots error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

---

## Cal.com Webhooks

Cal.com sends webhooks when bookings are created, cancelled, or rescheduled. This route handles those events and syncs them to Supabase.

**Route:** `POST /api/webhooks/cal`  
**File:** `src/app/api/webhooks/cal/route.ts`

### Supported Events

| Cal.com Event | Action |
|---|---|
| `BOOKING_CREATED` | Insert booking into Supabase, send confirmation email |
| `BOOKING_CANCELLED` | Update booking status to `cancelled` in Supabase |
| `BOOKING_RESCHEDULED` | Update booking times in Supabase |
| `BOOKING_PAID` | Update payment status (future use) |

### Implementation

```typescript
// src/app/api/webhooks/cal/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

// Use service role key for server-side writes
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.CAL_WEBHOOK_SECRET!
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(payload)
  const expected = hmac.digest('hex')
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-cal-signature-256') ?? ''

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(rawBody)
  const { triggerEvent, payload: booking } = payload

  try {
    switch (triggerEvent) {
      case 'BOOKING_CREATED': {
        await supabase.from('bookings').upsert({
          cal_booking_uid: booking.uid,
          client_name: booking.attendees?.[0]?.name ?? '',
          client_email: booking.attendees?.[0]?.email ?? '',
          client_phone: booking.attendees?.[0]?.phoneNumber ?? null,
          starts_at: booking.startTime,
          ends_at: booking.endTime,
          event_type: booking.eventType?.slug ?? 'consultation',
          status: 'confirmed',
          notes: booking.description ?? null,
          cal_payload: booking,
        })
        break
      }

      case 'BOOKING_CANCELLED': {
        await supabase
          .from('bookings')
          .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
          .eq('cal_booking_uid', booking.uid)
        break
      }

      case 'BOOKING_RESCHEDULED': {
        await supabase
          .from('bookings')
          .update({
            starts_at: booking.startTime,
            ends_at: booking.endTime,
            status: 'confirmed',
            rescheduled_at: new Date().toISOString(),
          })
          .eq('cal_booking_uid', booking.uid)
        break
      }

      default:
        // Unhandled event — return 200 so Cal.com doesn't retry
        break
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
```

---

## Bookings API (Admin)

**Route:** `GET /api/admin/bookings`  
**Auth:** Supabase session cookie (admin only)

```typescript
// src/app/api/admin/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  let query = supabase
    .from('bookings')
    .select('*')
    .order('starts_at', { ascending: true })

  if (status) query = query.eq('status', status)
  if (from) query = query.gte('starts_at', from)
  if (to) query = query.lte('starts_at', to)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ bookings: data })
}
```

---

## Supabase Bookings Schema

```sql
-- Booking status enum
create type booking_status as enum (
  'pending',
  'confirmed',
  'cancelled',
  'completed',
  'no_show'
);

-- Bookings table
create table bookings (
  id                  uuid primary key default gen_random_uuid(),
  cal_booking_uid     text unique,                  -- Cal.com booking UID
  client_name         text not null,
  client_email        text not null,
  client_phone        text,
  starts_at           timestamptz not null,
  ends_at             timestamptz not null,
  event_type          text not null default 'consultation',
  status              booking_status not null default 'confirmed',
  notes               text,
  internal_notes      text,                          -- Admin-only notes
  deposit_paid        boolean not null default false,
  deposit_amount      numeric(8,2),
  cal_payload         jsonb,                         -- Full Cal.com payload
  confirmation_sent   boolean not null default false,
  reminder_sent       boolean not null default false,
  cancelled_at        timestamptz,
  cancellation_reason text,
  rescheduled_at      timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Indexes
create index idx_bookings_email on bookings(client_email);
create index idx_bookings_starts_at on bookings(starts_at);
create index idx_bookings_status on bookings(status);
create index idx_bookings_cal_uid on bookings(cal_booking_uid);

-- Updated-at trigger
create trigger trg_bookings_updated_at
  before update on bookings
  for each row execute function set_updated_at();

-- RLS
alter table bookings enable row level security;

-- Only authenticated users (admins) can read all bookings
create policy "Admin read bookings"
  on bookings for select
  using (auth.role() = 'authenticated');

create policy "Admin update bookings"
  on bookings for update
  using (auth.role() = 'authenticated');

-- Webhooks (service role) can insert and update
-- Service role bypasses RLS by default
```

---

## Booking Confirmation Email

**File:** `src/lib/email/resend.ts`

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendBookingConfirmation(booking: {
  clientName: string
  clientEmail: string
  startsAt: string
  endsAt: string
  calBookingUid: string
}) {
  const startDate = new Date(booking.startsAt)
  const formattedDate = startDate.toLocaleDateString('pt-PT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedTime = startDate.toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Lisbon',
  })

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: booking.clientEmail,
    subject: `Booking confirmed — ${formattedDate}`,
    html: `
      <p>Hi ${booking.clientName},</p>
      <p>Your consultation is confirmed for <strong>${formattedDate} at ${formattedTime} (Lisbon time)</strong>.</p>
      <p>You will receive a reminder 24 hours before your appointment.</p>
      <p>To cancel or reschedule, use the link in your Cal.com confirmation email.</p>
      <p>See you soon.</p>
    `,
  })
}

export async function sendBookingReminder(booking: {
  clientName: string
  clientEmail: string
  startsAt: string
}) {
  const startDate = new Date(booking.startsAt)
  const formattedTime = startDate.toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Lisbon',
  })

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: booking.clientEmail,
    subject: `Reminder: Your consultation is tomorrow at ${formattedTime}`,
    html: `
      <p>Hi ${booking.clientName},</p>
      <p>Just a reminder that your consultation is <strong>tomorrow at ${formattedTime} (Lisbon time)</strong>.</p>
      <p>Looking forward to seeing you.</p>
    `,
  })
}
```

---

## Booking Confirmation Page

After Cal.com completes a booking, it redirects to a confirmation URL. Set the redirect in your Cal.com event type settings:

```
https://yourdomain.com/booking/confirmed?uid={uid}
```

**File:** `src/app/[locale]/booking/confirmed/page.tsx`

```tsx
// src/app/[locale]/booking/confirmed/page.tsx
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Props {
  searchParams: Promise<{ uid?: string }>
}

export default async function BookingConfirmedPage({ searchParams }: Props) {
  const { uid } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-8 text-center">
          <CheckCircle className="h-10 w-10 text-foreground mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-foreground">
            Booking confirmed
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You will receive a confirmation email shortly. We look forward to speaking with you.
          </p>
          {uid && (
            <p className="mt-3 text-xs text-muted-foreground font-mono">
              Reference: {uid}
            </p>
          )}
          <div className="mt-8">
            <Button asChild variant="outline" size="sm">
              <Link href="/">Back to homepage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## Cal.com Event Type Configuration Checklist

When setting up Cal.com for each Starter customer, configure:

- [ ] Event type name: "Consultation" (or translated equivalent)
- [ ] Duration: 30 minutes
- [ ] Location: Zoom / Google Meet / In-person (configure per artist)
- [ ] Description: Brief explanation of what to expect
- [ ] Confirmation redirect URL: `https://yourdomain.com/{locale}/booking/confirmed`
- [ ] Cancellation URL: `https://yourdomain.com/{locale}/booking?cancelled=1`
- [ ] Reminder emails: 24h before (configured in Cal.com)
- [ ] Webhook: Point to `https://yourdomain.com/api/webhooks/cal`
- [ ] Webhook events: `BOOKING_CREATED`, `BOOKING_CANCELLED`, `BOOKING_RESCHEDULED`
- [ ] Time zone: `Europe/Lisbon`
- [ ] Minimum notice: 2 hours
- [ ] Future booking limit: 60 days
- [ ] Buffer time: 15 minutes between appointments (optional)

---

*Last updated: April 2026*
