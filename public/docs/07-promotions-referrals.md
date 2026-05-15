# Portugal Tattoo — Starter: Promotions & Referrals

**Feature area:** Promotions, discount codes, and referral tracking  
**Routes:** `/api/promotions/*`, `/api/referrals/*`, `/admin/promotions`, `/admin/referrals`  
**Documents related:** `01-landing-page.md` (Promotions section), `06-schema.md` (migrations)

---

## Overview

The promotions and referrals system allows artists (via the admin dashboard) to create time-limited offers that appear on the public landing page. The chatbot can query active promotions and mention them during conversations. Referrals allow existing clients to generate a personal referral link; both the referrer and the new client receive a discount when the referred client books.

### Promotion Types

| Type | Description | Key fields |
|---|---|---|
| `seasonal` | Tied to a named season (e.g., "January Flash") | `title`, `discount_*`, date window |
| `calendar` | Active within a specific date/time window | `start_date`, `end_date` |
| `code` | Requires a code at checkout; not shown publicly unless explicitly enabled | `promo_code`, `max_uses`, `use_count` |
| `referral` | System-generated per-client referral code | `referral_source_id`, generated `promo_code` |

---

## Database Schema

### Migration: `20240007_promotions.sql`

```sql
-- Promotion type enum
CREATE TYPE promotion_type AS ENUM ('seasonal', 'calendar', 'code', 'referral');

-- Discount type enum
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');

-- Promotions table
CREATE TABLE promotions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  promotion_type promotion_type NOT NULL DEFAULT 'seasonal',
  discount_type  discount_type NOT NULL DEFAULT 'percentage',
  discount_value NUMERIC(8, 2) NOT NULL CHECK (discount_value > 0),
  promo_code    TEXT UNIQUE,
  max_uses      INTEGER,           -- NULL = unlimited
  use_count     INTEGER NOT NULL DEFAULT 0,
  start_date    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date      TIMESTAMPTZ,       -- NULL = no expiry
  is_active     BOOLEAN NOT NULL DEFAULT true,
  show_on_landing BOOLEAN NOT NULL DEFAULT true,
  created_by    UUID REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update timestamp
CREATE TRIGGER set_promotions_updated_at
  BEFORE UPDATE ON promotions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Referrals table — tracks who referred whom
CREATE TABLE referrals (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_name    TEXT NOT NULL,
  referrer_email   TEXT NOT NULL,
  referral_code    TEXT UNIQUE NOT NULL,
  promotion_id     UUID REFERENCES promotions(id) ON DELETE SET NULL,
  referred_bookings INTEGER NOT NULL DEFAULT 0,
  total_discount_given NUMERIC(10, 2) NOT NULL DEFAULT 0,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_referrals_updated_at
  BEFORE UPDATE ON referrals
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Promotion redemptions — audit trail
CREATE TABLE promotion_redemptions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id   UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  referral_id    UUID REFERENCES referrals(id) ON DELETE SET NULL,
  booking_id     UUID REFERENCES bookings(id) ON DELETE SET NULL,
  client_email   TEXT,
  discount_applied NUMERIC(8, 2) NOT NULL,
  redeemed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### RLS Policies

```sql
-- Promotions: public read for active, show_on_landing rows
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active promotions"
  ON promotions FOR SELECT
  USING (
    is_active = true
    AND show_on_landing = true
    AND start_date <= NOW()
    AND (end_date IS NULL OR end_date >= NOW())
    AND (max_uses IS NULL OR use_count < max_uses)
  );

CREATE POLICY "Admins manage promotions"
  ON promotions FOR ALL
  USING (auth.role() = 'authenticated');

-- Referrals: admin only
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage referrals"
  ON referrals FOR ALL
  USING (auth.role() = 'authenticated');

-- Redemptions: admin only
ALTER TABLE promotion_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage redemptions"
  ON promotion_redemptions FOR ALL
  USING (auth.role() = 'authenticated');

-- Service role can increment use_count
-- (called from API route using supabaseAdmin)
```

### Indexes

```sql
CREATE INDEX idx_promotions_active ON promotions (is_active, start_date, end_date)
  WHERE is_active = true;

CREATE INDEX idx_promotions_code ON promotions (promo_code)
  WHERE promo_code IS NOT NULL;

CREATE INDEX idx_referrals_code ON referrals (referral_code);
```

---

## TypeScript Types

```ts
// src/types/promotions.ts

export type PromotionType = 'seasonal' | 'calendar' | 'code' | 'referral'
export type DiscountType = 'percentage' | 'fixed'

export interface Promotion {
  id: string
  title: string
  description: string | null
  promotion_type: PromotionType
  discount_type: DiscountType
  discount_value: number
  promo_code: string | null
  max_uses: number | null
  use_count: number
  start_date: string
  end_date: string | null
  is_active: boolean
  show_on_landing: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Referral {
  id: string
  referrer_name: string
  referrer_email: string
  referral_code: string
  promotion_id: string | null
  referred_bookings: number
  total_discount_given: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PromotionRedemption {
  id: string
  promotion_id: string
  referral_id: string | null
  booking_id: string | null
  client_email: string | null
  discount_applied: number
  redeemed_at: string
}

export interface ValidateCodeResult {
  valid: boolean
  promotion?: Promotion
  referral?: Referral
  discount_value?: number
  discount_type?: DiscountType
  error?: string
}
```

---

## Data Access Layer

```ts
// src/lib/promotions.ts
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Promotion, ValidateCodeResult } from '@/types/promotions'

/** Fetch promotions visible on the public landing page */
export async function getActivePromotions(): Promise<Promotion[]> {
  const supabase = createServerClient()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('is_active', true)
    .eq('show_on_landing', true)
    .lte('start_date', now)
    .or(`end_date.is.null,end_date.gte.${now}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[getActivePromotions]', error.message)
    return []
  }

  return (data ?? []).filter(
    (p) => p.max_uses === null || p.use_count < p.max_uses
  )
}

/** Validate a promo code or referral code entered by a user */
export async function validateCode(code: string): Promise<ValidateCodeResult> {
  const supabase = createServerClient()
  const now = new Date().toISOString()
  const upper = code.trim().toUpperCase()

  // Check promotions table first
  const { data: promo } = await supabase
    .from('promotions')
    .select('*')
    .eq('promo_code', upper)
    .eq('is_active', true)
    .lte('start_date', now)
    .or(`end_date.is.null,end_date.gte.${now}`)
    .maybeSingle()

  if (promo) {
    if (promo.max_uses !== null && promo.use_count >= promo.max_uses) {
      return { valid: false, error: 'This code has reached its usage limit.' }
    }
    return {
      valid: true,
      promotion: promo,
      discount_value: promo.discount_value,
      discount_type: promo.discount_type,
    }
  }

  // Check referrals table
  const { data: referral } = await supabase
    .from('referrals')
    .select('*, promotions(*)')
    .eq('referral_code', upper)
    .eq('is_active', true)
    .maybeSingle()

  if (referral) {
    const linkedPromo = referral.promotions as Promotion | null
    return {
      valid: true,
      referral,
      promotion: linkedPromo ?? undefined,
      discount_value: linkedPromo?.discount_value,
      discount_type: linkedPromo?.discount_type,
    }
  }

  return { valid: false, error: 'Code not found or expired.' }
}

/** Record a redemption and increment use_count — use service role client */
export async function redeemCode(params: {
  promotionId: string
  referralId?: string
  bookingId?: string
  clientEmail?: string
  discountApplied: number
}): Promise<void> {
  const admin = createAdminClient()

  await admin.from('promotion_redemptions').insert({
    promotion_id: params.promotionId,
    referral_id: params.referralId ?? null,
    booking_id: params.bookingId ?? null,
    client_email: params.clientEmail ?? null,
    discount_applied: params.discountApplied,
  })

  await admin.rpc('increment_promotion_use_count', {
    p_promotion_id: params.promotionId,
  })
}
```

### RPC: increment_promotion_use_count

Add to a migration file:

```sql
CREATE OR REPLACE FUNCTION increment_promotion_use_count(p_promotion_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE promotions
  SET use_count = use_count + 1
  WHERE id = p_promotion_id;
END;
$$;
```

---

## API Routes

### `GET /api/promotions` — Public: fetch active promotions

```ts
// src/app/api/promotions/route.ts
import { NextResponse } from 'next/server'
import { getActivePromotions } from '@/lib/promotions'

export const revalidate = 300 // 5-minute cache

export async function GET() {
  const promotions = await getActivePromotions()
  return NextResponse.json({ promotions })
}
```

### `POST /api/promotions/validate` — Public: validate a code

```ts
// src/app/api/promotions/validate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { validateCode } from '@/lib/promotions'
import { z } from 'zod'

const schema = z.object({ code: z.string().min(1).max(50) })

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ valid: false, error: 'Invalid request.' }, { status: 400 })
  }

  const result = await validateCode(parsed.data.code)
  return NextResponse.json(result)
}
```

### `GET /api/promotions/[id]` — Admin: single promotion

```ts
// src/app/api/promotions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin()
  const { id } = await params
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('promotions')
    .select('*, promotion_redemptions(count)')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin()
  const { id } = await params
  const supabase = createServerClient()
  const body = await req.json()

  const { data, error } = await supabase
    .from('promotions')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin()
  const { id } = await params
  const supabase = createServerClient()

  const { error } = await supabase.from('promotions').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
```

### `POST /api/promotions` — Admin: create promotion

```ts
// src/app/api/promotions/create/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { z } from 'zod'

const createSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  promotion_type: z.enum(['seasonal', 'calendar', 'code', 'referral']),
  discount_type: z.enum(['percentage', 'fixed']),
  discount_value: z.number().positive(),
  promo_code: z.string().max(30).toUpperCase().optional(),
  max_uses: z.number().int().positive().optional(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime().optional(),
  is_active: z.boolean().default(true),
  show_on_landing: z.boolean().default(true),
})

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  const body = await req.json()
  const parsed = createSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('promotions')
    .insert({ ...parsed.data, created_by: session.user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}
```

### `POST /api/referrals/generate` — Admin: generate a referral code

```ts
// src/app/api/referrals/generate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { z } from 'zod'
import { nanoid } from 'nanoid'

const schema = z.object({
  referrer_name: z.string().min(1),
  referrer_email: z.string().email(),
  promotion_id: z.string().uuid().optional(),
})

export async function POST(req: NextRequest) {
  await requireAdmin()
  const body = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const referral_code = `REF-${nanoid(8).toUpperCase()}`
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('referrals')
    .insert({ ...parsed.data, referral_code })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}
```

---

## Admin UI

### Route structure

```
src/app/admin/promotions/
  page.tsx              — list all promotions
  new/page.tsx          — create promotion form
  [id]/page.tsx         — edit promotion + redemption history

src/app/admin/referrals/
  page.tsx              — list all referral codes + stats
  new/page.tsx          — generate referral code form
```

### Promotions List Page

**File:** `src/app/admin/promotions/page.tsx`  
**Component:** Server Component

```tsx
// src/app/admin/promotions/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { Wrapper, InnerWrap } from '@/components/atoms'
import { TitleBlock } from '@/components/shared/TitleBlock'
import { PromotionsTable } from '@/components/admin/promotions/PromotionsTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function AdminPromotionsPage() {
  await requireAdmin()
  const supabase = createServerClient()

  const { data: promotions } = await supabase
    .from('promotions')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <Wrapper>
      <InnerWrap className="items-start">
        <div className="flex items-center justify-between w-full mb-8">
          <TitleBlock
            orientation="left"
            heading="Promotions"
            subheading="Manage discount codes and seasonal offers."
          />
          <Button asChild size="sm">
            <Link href="/admin/promotions/new">New promotion</Link>
          </Button>
        </div>

        <PromotionsTable promotions={promotions ?? []} />
      </InnerWrap>
    </Wrapper>
  )
}
```

### PromotionsTable Component

**File:** `src/components/admin/promotions/PromotionsTable.tsx`  
**Component:** `'use client'`

```tsx
// src/components/admin/promotions/PromotionsTable.tsx
'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Promotion } from '@/types/promotions'

function statusBadge(promo: Promotion) {
  const now = Date.now()
  const start = new Date(promo.start_date).getTime()
  const end = promo.end_date ? new Date(promo.end_date).getTime() : null

  if (!promo.is_active) return <Badge variant="secondary">Inactive</Badge>
  if (now < start) return <Badge variant="outline">Scheduled</Badge>
  if (end && now > end) return <Badge variant="destructive">Expired</Badge>
  if (promo.max_uses !== null && promo.use_count >= promo.max_uses)
    return <Badge variant="destructive">Limit reached</Badge>
  return <Badge>Active</Badge>
}

function discountLabel(promo: Promotion) {
  return promo.discount_type === 'percentage'
    ? `${promo.discount_value}%`
    : `€${promo.discount_value}`
}

type Props = { promotions: Promotion[] }

export function PromotionsTable({ promotions }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>Code</TableHead>
          <TableHead className="font-mono">Uses</TableHead>
          <TableHead>Ends</TableHead>
          <TableHead>Status</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {promotions.map((promo) => (
          <TableRow key={promo.id}>
            <TableCell className="font-medium text-sm">{promo.title}</TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize text-xs">
                {promo.promotion_type}
              </Badge>
            </TableCell>
            <TableCell className="font-mono text-sm">{discountLabel(promo)}</TableCell>
            <TableCell className="font-mono text-xs">
              {promo.promo_code ?? '—'}
            </TableCell>
            <TableCell className="font-mono text-xs">
              {promo.use_count}
              {promo.max_uses !== null && ` / ${promo.max_uses}`}
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {promo.end_date
                ? new Date(promo.end_date).toLocaleDateString('en-GB')
                : '—'}
            </TableCell>
            <TableCell>{statusBadge(promo)}</TableCell>
            <TableCell>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/admin/promotions/${promo.id}`}>Edit</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {promotions.length === 0 && (
          <TableRow>
            <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-10">
              No promotions yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
```

### Create Promotion Form

**File:** `src/components/admin/promotions/PromotionForm.tsx`  
**Component:** `'use client'`

```tsx
// src/components/admin/promotions/PromotionForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Promotion } from '@/types/promotions'

type Props = {
  initial?: Partial<Promotion>
  mode: 'create' | 'edit'
  promotionId?: string
}

export function PromotionForm({ initial, mode, promotionId }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    promotion_type: initial?.promotion_type ?? 'seasonal',
    discount_type: initial?.discount_type ?? 'percentage',
    discount_value: initial?.discount_value?.toString() ?? '',
    promo_code: initial?.promo_code ?? '',
    max_uses: initial?.max_uses?.toString() ?? '',
    start_date: initial?.start_date
      ? new Date(initial.start_date).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
    end_date: initial?.end_date
      ? new Date(initial.end_date).toISOString().slice(0, 16)
      : '',
    is_active: initial?.is_active ?? true,
    show_on_landing: initial?.show_on_landing ?? true,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      ...form,
      discount_value: parseFloat(form.discount_value),
      max_uses: form.max_uses ? parseInt(form.max_uses) : null,
      promo_code: form.promo_code.trim().toUpperCase() || null,
      end_date: form.end_date || null,
    }

    const url =
      mode === 'create'
        ? '/api/promotions/create'
        : `/api/promotions/${promotionId}`

    const res = await fetch(url, {
      method: mode === 'create' ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Something went wrong.')
      setSaving(false)
      return
    }

    router.push('/admin/promotions')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="January Flash Sale"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Book before Jan 31st and save."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={form.promotion_type}
                onValueChange={(v) => setForm({ ...form, promotion_type: v as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seasonal">Seasonal</SelectItem>
                  <SelectItem value="calendar">Calendar window</SelectItem>
                  <SelectItem value="code">Promo code</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Discount</Label>
              <div className="flex gap-2">
                <Select
                  value={form.discount_type}
                  onValueChange={(v) => setForm({ ...form, discount_type: v as any })}
                >
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">%</SelectItem>
                    <SelectItem value="fixed">€ fixed</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={form.discount_value}
                  onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                  placeholder="20"
                  min={0}
                  step={0.01}
                  required
                  className="font-mono"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Code & limits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="promo_code">Promo code (optional)</Label>
              <Input
                id="promo_code"
                value={form.promo_code}
                onChange={(e) =>
                  setForm({ ...form, promo_code: e.target.value.toUpperCase() })
                }
                placeholder="JANUARY20"
                className="font-mono uppercase"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="max_uses">Max uses (optional)</Label>
              <Input
                id="max_uses"
                type="number"
                value={form.max_uses}
                onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                placeholder="Unlimited"
                min={1}
                className="font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="start_date">Start date</Label>
              <Input
                id="start_date"
                type="datetime-local"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="end_date">End date (optional)</Label>
              <Input
                id="end_date"
                type="datetime-local"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Active</p>
              <p className="text-xs text-muted-foreground">
                Inactive promotions are hidden everywhere.
              </p>
            </div>
            <Switch
              checked={form.is_active}
              onCheckedChange={(v) => setForm({ ...form, is_active: v })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Show on landing page</p>
              <p className="text-xs text-muted-foreground">
                Code-only promotions can be hidden from the public page.
              </p>
            </div>
            <Switch
              checked={form.show_on_landing}
              onCheckedChange={(v) => setForm({ ...form, show_on_landing: v })}
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : mode === 'create' ? 'Create promotion' : 'Save changes'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push('/admin/promotions')}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
```

### Referrals List Page

**File:** `src/app/admin/referrals/page.tsx`

```tsx
// src/app/admin/referrals/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { Wrapper, InnerWrap } from '@/components/atoms'
import { TitleBlock } from '@/components/shared/TitleBlock'
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function AdminReferralsPage() {
  await requireAdmin()
  const supabase = createServerClient()

  const { data: referrals } = await supabase
    .from('referrals')
    .select('*, promotions(title, discount_value, discount_type)')
    .order('created_at', { ascending: false })

  return (
    <Wrapper>
      <InnerWrap className="items-start">
        <div className="flex items-center justify-between w-full mb-8">
          <TitleBlock
            orientation="left"
            heading="Referrals"
            subheading="Track referral codes and their performance."
          />
          <Button asChild size="sm">
            <Link href="/admin/referrals/new">Generate code</Link>
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Referrer</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Linked promotion</TableHead>
              <TableHead className="font-mono">Bookings</TableHead>
              <TableHead className="font-mono">Discount given</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(referrals ?? []).map((ref) => (
              <TableRow key={ref.id}>
                <TableCell>
                  <p className="text-sm font-medium">{ref.referrer_name}</p>
                  <p className="text-xs text-muted-foreground">{ref.referrer_email}</p>
                </TableCell>
                <TableCell>
                  <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                    {ref.referral_code}
                  </code>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {ref.promotions?.title ?? '—'}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {ref.referred_bookings}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  €{ref.total_discount_given.toFixed(2)}
                </TableCell>
                <TableCell>
                  {ref.is_active ? (
                    <Badge>Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {(referrals ?? []).length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-10">
                  No referral codes yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </InnerWrap>
    </Wrapper>
  )
}
```

---

## Chatbot Integration

The chatbot can query active promotions via a tool call and mention them in conversation. Add the following tool definition to the chatbot's OpenAI tool list (see `04-chatbot.md`).

### Tool Definition

```ts
// Add to tools array in src/app/api/chat/route.ts
{
  type: 'function',
  function: {
    name: 'get_active_promotions',
    description:
      'Returns any current discounts, promo codes, or seasonal offers available to the client. Call this when the user asks about pricing, discounts, or special offers.',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
}
```

### Tool Handler

```ts
// In the tool_calls handler inside /api/chat/route.ts
case 'get_active_promotions': {
  const promotions = await getActivePromotions()
  if (promotions.length === 0) {
    toolResults.push({
      tool_call_id: call.id,
      role: 'tool',
      content: 'No active promotions at this time.',
    })
  } else {
    const summary = promotions
      .map((p) => {
        const discount =
          p.discount_type === 'percentage'
            ? `${p.discount_value}% off`
            : `€${p.discount_value} off`
        const code = p.promo_code ? ` — use code ${p.promo_code}` : ''
        const expiry = p.end_date
          ? ` (until ${new Date(p.end_date).toLocaleDateString('en-GB')})`
          : ''
        return `${p.title}: ${discount}${code}${expiry}`
      })
      .join('\n')
    toolResults.push({
      tool_call_id: call.id,
      role: 'tool',
      content: summary,
    })
  }
  break
}
```

---

## Landing Page Integration

The `Promotions` server component (defined in `01-landing-page.md`) renders between `HowItWorks` and `Pricing`. It is fully self-contained:

- Calls `getActivePromotions()` at render time
- Returns `null` when no active promotions exist (section disappears entirely)
- ISR revalidation (`revalidate = 3600` on root page) means the section updates within 1 hour of a promotion being created or expired in the admin

### Booking Flow: Promo Code Entry

When a client selects a slot via the Cal.com embed, the booking confirmation page (`/booking/confirmed`) can display a code entry field to apply a discount to the next booking or store a redemption record.

```tsx
// src/components/booking/PromoCodeInput.tsx
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { ValidateCodeResult } from '@/types/promotions'

type Props = {
  onValidated: (result: ValidateCodeResult) => void
}

export function PromoCodeInput({ onValidated }: Props) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ValidateCodeResult | null>(null)

  async function handleApply() {
    if (!code.trim()) return
    setLoading(true)

    const res = await fetch('/api/promotions/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })

    const data: ValidateCodeResult = await res.json()
    setResult(data)
    if (data.valid) onValidated(data)
    setLoading(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="PROMO CODE"
          className="font-mono uppercase"
          maxLength={30}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleApply}
          disabled={loading || !code.trim()}
        >
          {loading ? 'Checking…' : 'Apply'}
        </Button>
      </div>

      {result && (
        <div>
          {result.valid ? (
            <Badge className="text-xs">
              {result.discount_type === 'percentage'
                ? `${result.discount_value}% discount applied`
                : `€${result.discount_value} discount applied`}
            </Badge>
          ) : (
            <p className="text-xs text-destructive">{result.error}</p>
          )}
        </div>
      )}
    </div>
  )
}
```

---

## Referral Link Generation

Referral links take the form:

```
https://www.portugaltattoo.com/en?ref=REF-XXXXXXXX
```

The landing page reads the `ref` query parameter and pre-fills the promo code field. This is handled in the root page's `searchParams`:

```tsx
// src/app/[locale]/page.tsx — add to component props
interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ ref?: string }>
}

export default async function HomePage({ searchParams }: PageProps) {
  const { ref } = await searchParams
  // Pass ref to a client boundary that pre-fills the promo code
  // e.g. <PromoCodeBanner referralCode={ref} />
}
```

### PromoCodeBanner

Shows a dismissable banner when a `ref` query parameter is present:

```tsx
// src/components/landing/PromoCodeBanner.tsx
'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

type Props = { referralCode?: string }

export function PromoCodeBanner({ referralCode }: Props) {
  const [dismissed, setDismissed] = useState(false)
  if (!referralCode || dismissed) return null

  return (
    <div className="w-full bg-brand-light-blue border-b px-4 py-2 flex items-center justify-between text-sm text-brand-licorice">
      <span>
        You were referred — use code{' '}
        <code className="font-mono font-semibold">{referralCode}</code>{' '}
        at booking for your discount.
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 ml-2"
        onClick={() => setDismissed(true)}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
```

---

## Redemption Audit Trail

Every time a promo or referral code is successfully applied to a booking, call `redeemCode()` from the booking confirmation webhook handler (see `02-booking.md`):

```ts
// Inside the Cal.com webhook handler — after booking is saved to Supabase
if (validCode && validCode.valid && validCode.promotion) {
  await redeemCode({
    promotionId: validCode.promotion.id,
    referralId: validCode.referral?.id,
    bookingId: savedBooking.id,
    clientEmail: payload.attendees?.[0]?.email,
    discountApplied: validCode.discount_value ?? 0,
  })
}
```

---

## Admin Navigation Update

Add "Promotions" and "Referrals" to the `AdminNav` links array (see `03-admin-backend.md`):

```ts
const NAV_LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/bookings', label: 'Bookings' },
  { href: '/admin/promotions', label: 'Promotions' },   // add
  { href: '/admin/referrals', label: 'Referrals' },     // add
  { href: '/admin/knowledge', label: 'Knowledge base' },
  { href: '/admin/settings', label: 'Settings' },
]
```

---

## Environment Variables

No additional env vars are required. The promotions system uses the existing Supabase connection. Ensure the service-role client (`SUPABASE_SERVICE_ROLE_KEY`) is set — it is needed by `createAdminClient()` for the `redeemCode` function.

---

## Migration Checklist

1. Run `20240007_promotions.sql` via Supabase CLI: `supabase db push`
2. Run type generation: `supabase gen types typescript --local > src/types/supabase.ts`
3. Install `nanoid` for referral code generation: `pnpm add nanoid`
4. Add `promotions` and `referrals` to the admin nav
5. Deploy and verify `/api/promotions` returns `{ promotions: [] }` with no active records

---

*Last updated: April 2026*
