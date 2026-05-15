# Portugal Tattoo — Starter: Admin Backend

The admin backend is a protected section of the Next.js app (not a separate service). It is accessible at `/admin` and requires Supabase Auth authentication. It is not indexed by search engines.

---

## Auth Strategy

- **Authentication provider:** Supabase Auth
- **Methods:** Email + password (magic link optional)
- **Session management:** Supabase SSR cookie-based sessions
- **Auth guard:** Middleware redirects unauthenticated requests from `/admin` to `/auth/login`
- **Roles:** Single admin user per Starter site (the artist or studio owner)

---

## Auth Guard Middleware

```typescript
// src/lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to login if accessing /admin without a session
  if (!user && request.nextUrl.pathname.startsWith('/admin')) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/auth/login'
    loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to admin if already logged in and hitting /auth/login
  if (user && request.nextUrl.pathname.startsWith('/auth/login')) {
    const adminUrl = request.nextUrl.clone()
    adminUrl.pathname = '/admin'
    return NextResponse.redirect(adminUrl)
  }

  return supabaseResponse
}
```

---

## Auth Pages

### Login Page

**File:** `src/app/auth/login/page.tsx`

```tsx
// src/app/auth/login/page.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <h1 className="text-base font-semibold text-foreground">Admin login</h1>
          <p className="text-xs text-muted-foreground">Portugal Tattoo — Starter</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="h-9 text-sm"
              />
            </div>

            <Button type="submit" className="w-full h-9 text-sm" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Auth Callback Route

**File:** `src/app/auth/callback/route.ts`

```typescript
// src/app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/admin'

  if (code) {
    const supabase = await createServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`)
}
```

---

## Admin Layout

**File:** `src/app/admin/layout.tsx`

```tsx
// src/app/admin/layout.tsx
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/admin/AdminNav'

export const metadata = {
  title: 'Admin — Portugal Tattoo',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <AdminNav userEmail={user.email ?? ''} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
```

---

## Admin Navigation

**File:** `src/components/admin/AdminNav.tsx`

```tsx
// src/components/admin/AdminNav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import {
  CalendarDays,
  BookOpen,
  Users,
  Settings,
  MessageSquare,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: BookOpen },
  { href: '/admin/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/chatbot', label: 'Chatbot', icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

interface AdminNavProps {
  userEmail: string
}

export function AdminNav({ userEmail }: AdminNavProps) {
  const pathname = usePathname()
  const supabase = createClient()
  const router = useRouter()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-xs font-semibold text-foreground">PT Admin</span>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors',
                    active
                      ? 'bg-muted text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
              <span className="hidden sm:inline">{userEmail}</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleSignOut} className="text-xs">
              <LogOut className="h-3.5 w-3.5 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
```

---

## Admin Dashboard

**File:** `src/app/admin/page.tsx`

```tsx
// src/app/admin/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createServerClient()
  const today = new Date().toISOString().split('T')[0]

  const [
    { count: totalBookings },
    { count: upcomingBookings },
    { count: todayBookings },
    { data: nextBookings },
  ] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('starts_at', new Date().toISOString())
      .eq('status', 'confirmed'),
    supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('starts_at', `${today}T00:00:00`)
      .lte('starts_at', `${today}T23:59:59`),
    supabase
      .from('bookings')
      .select('id, client_name, starts_at, event_type, status')
      .gte('starts_at', new Date().toISOString())
      .eq('status', 'confirmed')
      .order('starts_at', { ascending: true })
      .limit(5),
  ])

  const STATS = [
    { label: 'Total bookings', value: totalBookings ?? 0 },
    { label: 'Upcoming', value: upcomingBookings ?? 0 },
    { label: 'Today', value: todayBookings ?? 0 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-4 pb-4">
              <p className="font-mono text-2xl font-semibold text-foreground">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming bookings */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-foreground">Upcoming bookings</h2>
            <Link href="/admin/bookings" className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2">
              View all
            </Link>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-0">
          {!nextBookings?.length ? (
            <p className="text-xs text-muted-foreground py-4 text-center">
              No upcoming bookings.
            </p>
          ) : (
            <ul className="divide-y">
              {nextBookings.map((booking) => (
                <li key={booking.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-foreground font-medium">{booking.client_name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {booking.event_type}
                    </p>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground text-right shrink-0">
                    {new Date(booking.starts_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    })}{' '}
                    {new Date(booking.starts_at).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                      timeZone: 'Europe/Lisbon',
                    })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## Bookings Management

**File:** `src/app/admin/bookings/page.tsx`

### Features
- List all bookings with filters (status, date range)
- Search by client name or email
- View booking detail
- Cancel booking (calls Cal.com API + updates Supabase)
- Add internal notes

```tsx
// src/app/admin/bookings/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  confirmed: 'default',
  pending: 'secondary',
  cancelled: 'destructive',
  completed: 'outline',
  no_show: 'destructive',
}

interface BookingsPageProps {
  searchParams: Promise<{
    status?: string
    q?: string
    from?: string
    to?: string
  }>
}

export default async function BookingsPage({ searchParams }: BookingsPageProps) {
  const sp = await searchParams
  const supabase = await createServerClient()

  let query = supabase
    .from('bookings')
    .select('*')
    .order('starts_at', { ascending: false })
    .limit(100)

  if (sp.status && sp.status !== 'all') {
    query = query.eq('status', sp.status)
  }

  if (sp.q) {
    query = query.or(`client_name.ilike.%${sp.q}%,client_email.ilike.%${sp.q}%`)
  }

  if (sp.from) query = query.gte('starts_at', sp.from)
  if (sp.to) query = query.lte('starts_at', sp.to)

  const { data: bookings } = await query

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Bookings</h1>
        <p className="font-mono text-xs text-muted-foreground">
          {bookings?.length ?? 0} results
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search name or email..."
          className="max-w-xs h-8 text-xs"
          defaultValue={sp.q}
          name="q"
        />
        <Select defaultValue={sp.status ?? 'all'}>
          <SelectTrigger className="w-36 h-8 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All statuses</SelectItem>
            <SelectItem value="confirmed" className="text-xs">Confirmed</SelectItem>
            <SelectItem value="cancelled" className="text-xs">Cancelled</SelectItem>
            <SelectItem value="completed" className="text-xs">Completed</SelectItem>
            <SelectItem value="no_show" className="text-xs">No show</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Client</TableHead>
              <TableHead className="text-xs">Date & Time</TableHead>
              <TableHead className="text-xs">Type</TableHead>
              <TableHead className="text-xs">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!bookings?.length ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-8">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <Link
                      href={`/admin/bookings/${booking.id}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {booking.client_name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{booking.client_email}</p>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {new Date(booking.starts_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                    {' '}
                    {new Date(booking.starts_at).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                      timeZone: 'Europe/Lisbon',
                    })}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground capitalize">
                    {booking.event_type}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[booking.status] ?? 'secondary'} className="text-xs capitalize">
                      {booking.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
```

---

## Calendar View

**File:** `src/app/admin/calendar/page.tsx`

This page embeds the Cal.com admin interface via iframe, or shows a month-view calendar built with shadcn Calendar component showing booked slots.

```tsx
// src/app/admin/calendar/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

export default async function CalendarPage() {
  const supabase = await createServerClient()
  const startOfMonth = new Date()
  startOfMonth.setDate(1)

  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, client_name, starts_at, ends_at, status, event_type')
    .gte('starts_at', startOfMonth.toISOString())
    .eq('status', 'confirmed')
    .order('starts_at', { ascending: true })

  // Group bookings by date
  const byDate: Record<string, typeof bookings> = {}
  for (const booking of bookings ?? []) {
    const dateKey = booking.starts_at.split('T')[0]
    if (!byDate[dateKey]) byDate[dateKey] = []
    byDate[dateKey]!.push(booking)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Calendar</h1>
        <a
          href={`https://cal.com/${process.env.NEXT_PUBLIC_CAL_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          Manage availability in Cal.com
        </a>
      </div>

      <Tabs defaultValue="list">
        <TabsList className="h-8">
          <TabsTrigger value="list" className="text-xs h-7">List view</TabsTrigger>
          <TabsTrigger value="cal" className="text-xs h-7">Cal.com</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4">
          {Object.keys(byDate).length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-xs text-muted-foreground">
                No confirmed bookings this month.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {Object.entries(byDate).map(([date, dayBookings]) => (
                <Card key={date}>
                  <CardHeader className="pb-2 pt-4">
                    <p className="font-mono text-xs text-muted-foreground">
                      {new Date(date).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      })}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {dayBookings?.map((b) => (
                        <li key={b.id} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-foreground">{b.client_name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{b.event_type}</p>
                          </div>
                          <p className="font-mono text-xs text-muted-foreground">
                            {new Date(b.starts_at).toLocaleTimeString('en-GB', {
                              hour: '2-digit',
                              minute: '2-digit',
                              timeZone: 'Europe/Lisbon',
                            })}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cal">
          <div className="rounded-md border overflow-hidden" style={{ height: '700px' }}>
            <iframe
              src={`https://cal.com/${process.env.NEXT_PUBLIC_CAL_USERNAME}`}
              className="w-full h-full"
              title="Cal.com calendar"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

---

## REST API Endpoints Summary

All API routes are under `src/app/api/`. All admin routes require a valid Supabase session.

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/availability` | Public | Get available booking slots from Cal.com |
| `POST` | `/api/webhooks/cal` | Signature | Cal.com webhook handler |
| `GET` | `/api/admin/bookings` | Admin | List bookings with filters |
| `PATCH` | `/api/admin/bookings/[id]` | Admin | Update booking (status, notes) |
| `DELETE` | `/api/admin/bookings/[id]` | Admin | Cancel booking (also calls Cal.com API) |
| `GET` | `/api/admin/calendar` | Admin | Get bookings for calendar view |
| `GET` | `/api/admin/customers` | Admin | List unique customers |
| `GET` | `/api/admin/knowledge` | Admin | List knowledge base entries |
| `POST` | `/api/admin/knowledge` | Admin | Create knowledge base entry |
| `PATCH` | `/api/admin/knowledge/[id]` | Admin | Update knowledge base entry |
| `DELETE` | `/api/admin/knowledge/[id]` | Admin | Delete knowledge base entry |
| `POST` | `/api/chat` | Public | Chatbot message stream (OpenAI) |

---

## Booking Detail + Cancellation

**File:** `src/app/api/admin/bookings/[id]/route.ts`

```typescript
// src/app/api/admin/bookings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const allowedFields = ['status', 'internal_notes', 'deposit_paid', 'deposit_amount']
  const update: Record<string, unknown> = {}
  for (const key of allowedFields) {
    if (key in body) update[key] = body[key]
  }

  if (body.status === 'cancelled') {
    update.cancelled_at = new Date().toISOString()
    update.cancellation_reason = body.cancellation_reason ?? 'Cancelled by admin'

    // Cancel on Cal.com
    const { data: booking } = await supabase
      .from('bookings')
      .select('cal_booking_uid')
      .eq('id', id)
      .single()

    if (booking?.cal_booking_uid) {
      await fetch(`https://api.cal.com/v1/bookings/${booking.cal_booking_uid}/cancel`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.CAL_API_KEY}`,
        },
        body: JSON.stringify({ reason: update.cancellation_reason }),
      })
    }
  }

  const { data, error } = await supabase
    .from('bookings')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ booking: data })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Soft delete — set status to cancelled
  return PATCH(_request, { params })
}
```

---

## Admin Settings Page

**File:** `src/app/admin/settings/page.tsx`

Allows the artist to update their studio name, contact email, and notification preferences.

```tsx
// src/app/admin/settings/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

export default async function SettingsPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .single()

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-lg font-semibold text-foreground">Settings</h1>

      <Card>
        <CardHeader>
          <h2 className="text-sm font-medium text-foreground">Studio details</h2>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Studio or artist name</Label>
            <Input
              defaultValue={settings?.studio_name ?? ''}
              className="h-9 text-sm"
              name="studio_name"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Contact email</Label>
            <Input
              defaultValue={settings?.contact_email ?? user?.email ?? ''}
              className="h-9 text-sm"
              type="email"
              name="contact_email"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Cal.com username</Label>
            <Input
              defaultValue={settings?.cal_username ?? ''}
              className="h-9 text-sm"
              name="cal_username"
            />
          </div>
          <Button size="sm" className="text-xs">Save changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-sm font-medium text-foreground">Notifications</h2>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">New booking alert</p>
              <p className="text-xs text-muted-foreground">Email when a client books</p>
            </div>
            <Switch defaultChecked={settings?.notify_new_booking ?? true} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Cancellation alert</p>
              <p className="text-xs text-muted-foreground">Email when a client cancels</p>
            </div>
            <Switch defaultChecked={settings?.notify_cancellation ?? true} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## Site Settings Schema

```sql
create table site_settings (
  id               uuid primary key default gen_random_uuid(),
  studio_name      text,
  contact_email    text,
  cal_username     text,
  cal_event_slug   text not null default 'consultation',
  notify_new_booking     boolean not null default true,
  notify_cancellation    boolean not null default true,
  chatbot_enabled        boolean not null default true,
  chatbot_welcome_en     text,
  chatbot_welcome_pt     text,
  chatbot_welcome_es     text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- RLS: only authenticated users
alter table site_settings enable row level security;

create policy "Admin read settings"
  on site_settings for select
  using (auth.role() = 'authenticated');

create policy "Admin update settings"
  on site_settings for update
  using (auth.role() = 'authenticated');

-- Seed one row on project creation
insert into site_settings (studio_name) values ('My Studio');
```

---

*Last updated: April 2026*
