# Portugal Tattoo — Starter: Complete Supabase Schema

This document contains the full Supabase (PostgreSQL) schema for the Starter project, including all tables, indexes, RLS policies, functions, and triggers. Run migrations in order.

---

## Extensions Required

```sql
-- 001_extensions.sql
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "vector";         -- For knowledge base embeddings
create extension if not exists "unaccent";       -- For accent-insensitive search
create extension if not exists "pg_trgm";        -- For trigram text search
```

---

## Migration 001: Shared Utilities

```sql
-- 001_utils.sql

-- Generic updated_at trigger function
create or replace function set_updated_at()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql;
```

---

## Migration 002: Enums

```sql
-- 002_enums.sql

create type booking_status as enum (
  'pending',
  'confirmed',
  'cancelled',
  'completed',
  'no_show'
);

create type knowledge_language as enum ('en', 'pt', 'es', 'all');
```

---

## Migration 003: Site Settings

```sql
-- 003_site_settings.sql

create table site_settings (
  id                     uuid primary key default gen_random_uuid(),
  studio_name            text not null default 'My Studio',
  contact_email          text,
  cal_username           text,
  cal_event_slug         text not null default 'consultation',
  notify_new_booking     boolean not null default true,
  notify_cancellation    boolean not null default true,
  chatbot_enabled        boolean not null default true,
  chatbot_welcome_en     text not null default 'Hi! I''m here to help you book a consultation or answer any questions.',
  chatbot_welcome_pt     text not null default 'Olá! Estou aqui para ajudar com marcações ou responder às tuas perguntas.',
  chatbot_welcome_es     text not null default '¡Hola! Estoy aquí para ayudarte a reservar una consulta o responder tus preguntas.',
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- Trigger
create trigger trg_site_settings_updated_at
  before update on site_settings
  for each row execute function set_updated_at();

-- RLS
alter table site_settings enable row level security;

create policy "Admin read settings"
  on site_settings for select
  using (auth.role() = 'authenticated');

create policy "Admin update settings"
  on site_settings for update
  using (auth.role() = 'authenticated');

-- Seed one row — the platform will always have exactly one row
insert into site_settings (studio_name) values ('My Studio');
```

---

## Migration 004: Bookings

```sql
-- 004_bookings.sql

create table bookings (
  id                  uuid primary key default gen_random_uuid(),

  -- Cal.com integration
  cal_booking_uid     text unique,                   -- Cal.com booking UID
  cal_payload         jsonb,                         -- Full Cal.com webhook payload

  -- Client info
  client_name         text not null,
  client_email        text not null,
  client_phone        text,

  -- Appointment details
  starts_at           timestamptz not null,
  ends_at             timestamptz not null,
  event_type          text not null default 'consultation',   -- 'consultation' | 'appointment'
  time_zone           text not null default 'Europe/Lisbon',

  -- Status
  status              booking_status not null default 'confirmed',
  cancelled_at        timestamptz,
  cancellation_reason text,
  rescheduled_at      timestamptz,

  -- Notes
  notes               text,                          -- Client-provided notes from booking form
  internal_notes      text,                          -- Admin-only notes (not visible to client)

  -- Deposit
  deposit_paid        boolean not null default false,
  deposit_amount      numeric(8,2),

  -- Email status
  confirmation_sent   boolean not null default false,
  reminder_sent       boolean not null default false,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Indexes
create index idx_bookings_email     on bookings(client_email);
create index idx_bookings_starts    on bookings(starts_at);
create index idx_bookings_status    on bookings(status);
create index idx_bookings_cal_uid   on bookings(cal_booking_uid) where cal_booking_uid is not null;
create index idx_bookings_upcoming  on bookings(starts_at)
  where status = 'confirmed' and starts_at > now();

-- Trigger
create trigger trg_bookings_updated_at
  before update on bookings
  for each row execute function set_updated_at();

-- RLS
alter table bookings enable row level security;

-- Only authenticated users (admin) can read bookings
create policy "Admin read bookings"
  on bookings for select
  using (auth.role() = 'authenticated');

create policy "Admin update bookings"
  on bookings for update
  using (auth.role() = 'authenticated');

-- Service role (webhooks) can insert and update — service role bypasses RLS by default
-- No public policy: bookings are never readable by anonymous users
```

---

## Migration 005: Knowledge Base

```sql
-- 005_knowledge_base.sql

create table knowledge_base (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  content     text not null,
  language    knowledge_language not null default 'all',
  category    text,                                    -- 'pricing' | 'services' | 'policies' | 'faq' | 'location' | 'hours'
  embedding   vector(1536),                            -- OpenAI text-embedding-3-small output
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Indexes
create index idx_knowledge_active   on knowledge_base(is_active) where is_active = true;
create index idx_knowledge_language on knowledge_base(language);
create index idx_knowledge_category on knowledge_base(category) where category is not null;

-- Vector similarity index (requires ~100+ rows to be effective)
create index idx_knowledge_embedding on knowledge_base
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 50);

-- Full-text search index
create index idx_knowledge_fts on knowledge_base
  using gin(to_tsvector('english', title || ' ' || content));

-- Trigger
create trigger trg_knowledge_updated_at
  before update on knowledge_base
  for each row execute function set_updated_at();

-- RLS
alter table knowledge_base enable row level security;

-- Public read active entries (chatbot uses anon key)
create policy "Public read active knowledge"
  on knowledge_base for select
  using (is_active = true);

-- Admin full access
create policy "Admin insert knowledge"
  on knowledge_base for insert
  with check (auth.role() = 'authenticated');

create policy "Admin update knowledge"
  on knowledge_base for update
  using (auth.role() = 'authenticated');

create policy "Admin delete knowledge"
  on knowledge_base for delete
  using (auth.role() = 'authenticated');
```

---

## Migration 006: Knowledge Vector Search Function

```sql
-- 006_knowledge_search.sql

create or replace function search_knowledge(
  query_embedding   vector(1536),
  match_threshold   float    default 0.65,
  match_count       int      default 5,
  lang              text     default 'en'
)
returns table (
  id          uuid,
  title       text,
  content     text,
  category    text,
  similarity  float
)
language sql stable security definer
as $$
  select
    id,
    title,
    content,
    category,
    1 - (embedding <=> query_embedding) as similarity
  from knowledge_base
  where
    is_active = true
    and (language::text = lang or language::text = 'all')
    and embedding is not null
    and 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;
```

---

## Migration 007: Chat Session Logs (Optional)

Disabled by default. Enable if you need to review chatbot conversations for quality improvement. Do not store personally identifiable information.

```sql
-- 007_chat_logs.sql (optional — disabled in Starter by default)

create table chat_logs (
  id           uuid primary key default gen_random_uuid(),
  session_id   text not null,         -- Random client-generated session ID
  language     text not null,
  message_role text not null,         -- 'user' | 'assistant'
  message      text not null,
  tool_calls   jsonb,
  created_at   timestamptz not null default now()
);

-- Partition by month for easy cleanup
-- In production, add a pg_cron job to delete rows older than 30 days

create index idx_chat_logs_session on chat_logs(session_id);
create index idx_chat_logs_created on chat_logs(created_at);

-- RLS: admin read only
alter table chat_logs enable row level security;

create policy "Admin read chat logs"
  on chat_logs for select
  using (auth.role() = 'authenticated');

-- Service role inserts (no auth required for anon logging)
```

---

## Migration 008: Availability Cache (Optional)

Caches Cal.com availability responses to reduce API calls. TTL enforced by a cleanup function.

```sql
-- 008_availability_cache.sql (optional)

create table availability_cache (
  id          uuid primary key default gen_random_uuid(),
  cache_key   text not null unique,     -- e.g. 'username:event:2024-01-15'
  data        jsonb not null,
  expires_at  timestamptz not null,
  created_at  timestamptz not null default now()
);

create index idx_cache_key     on availability_cache(cache_key);
create index idx_cache_expires on availability_cache(expires_at);

-- Cleanup function — call via pg_cron or on each request
create or replace function clear_expired_cache()
returns void language sql as $$
  delete from availability_cache where expires_at < now();
$$;

-- RLS: service role only
alter table availability_cache enable row level security;
-- No public policy — accessed via service role only
```

---

## Full Schema Summary

| Table | Purpose | Public read | Admin read/write |
|---|---|---|---|
| `site_settings` | Studio config, chatbot settings | No | Yes |
| `bookings` | All bookings from Cal.com | No | Yes |
| `knowledge_base` | Chatbot knowledge entries | Active only | Yes |
| `chat_logs` | Optional chatbot session logs | No | Yes |
| `availability_cache` | Optional Cal.com cache | No | Service role |

---

## Row-Level Security Summary

| Table | Policy | Condition |
|---|---|---|
| `site_settings` | Read | `auth.role() = 'authenticated'` |
| `site_settings` | Update | `auth.role() = 'authenticated'` |
| `bookings` | Read | `auth.role() = 'authenticated'` |
| `bookings` | Update | `auth.role() = 'authenticated'` |
| `bookings` | Insert | Service role only (webhooks) |
| `knowledge_base` | Read | `is_active = true` (public) |
| `knowledge_base` | Insert/Update/Delete | `auth.role() = 'authenticated'` |
| `chat_logs` | Read | `auth.role() = 'authenticated'` |
| `chat_logs` | Insert | Service role only |

---

## Supabase CLI Setup

```bash
# Install Supabase CLI
pnpm add -D supabase

# Login
bunx supabase login

# Initialise (creates supabase/ folder)
bunx supabase init

# Link to your project
bunx supabase link --project-ref YOUR_PROJECT_REF

# Apply migrations
bunx supabase db push

# Generate TypeScript types
bunx supabase gen types typescript --linked > src/types/database.types.ts
```

---

## supabase/config.toml

```toml
[api]
enabled = true
port = 54321
schemas = ["public", "storage", "graphql_public"]
extra_search_path = ["public", "extensions"]
max_rows = 1000

[db]
port = 54322
shadow_port = 54320
major_version = 15

[studio]
enabled = true
port = 54323

[inbucket]
enabled = true
port = 54324

[storage]
enabled = true

[auth]
enabled = true
# Site URL — set to your Vercel deployment URL in production
site_url = "http://localhost:3000"
additional_redirect_urls = ["https://yourdomain.com"]
jwt_expiry = 3600
enable_refresh_token_rotation = true
refresh_token_reuse_interval = 10

[auth.email]
enable_signup = false   # Only admin — no public sign-ups
double_confirm_changes = true
enable_confirmations = true
```

---

## Type Generation

After running migrations, regenerate types:

```bash
bun run db:generate
# or
bunx supabase gen types typescript --linked > src/types/database.types.ts
```

This gives you full TypeScript type safety across the app. The generated file is imported as:

```typescript
import type { Database } from '@/types/database.types'
```

---

## Seed Data for Development

```sql
-- supabase/seed.sql

-- Insert sample knowledge base entries
insert into knowledge_base (title, content, language, category) values
  (
    'Pricing overview',
    'Consultations are free. All tattoos start at a minimum of €100. Custom designs are priced by size and complexity — we provide a quote after the consultation.',
    'en',
    'pricing'
  ),
  (
    'Preço e orçamentos',
    'As consultas são gratuitas. Todas as tatuagens têm um preço mínimo de €100. Os designs personalizados têm preço conforme o tamanho e complexidade — fornecemos um orçamento após a consulta.',
    'pt',
    'pricing'
  ),
  (
    'Booking policy',
    'We require 48 hours notice to cancel or reschedule an appointment. Late cancellations may result in loss of deposit. We take a deposit to confirm appointments for larger pieces.',
    'all',
    'policies'
  ),
  (
    'Tattoo styles',
    'We specialise in blackwork, fine line, geometric, and realism. We are happy to discuss other styles during the consultation.',
    'en',
    'services'
  );
```

---

## Vercel Environment Variables Checklist

Before deploying, verify the following are set in your Vercel project:

| Variable | Where to find |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard > Settings > API (keep secret) |
| `OPENAI_API_KEY` | platform.openai.com > API keys |
| `OPENAI_MODEL` | Set to `gpt-4o` |
| `NEXT_PUBLIC_CAL_USERNAME` | Your Cal.com username slug |
| `NEXT_PUBLIC_CAL_EVENT_SLUG` | Your Cal.com event type slug |
| `CAL_API_KEY` | Cal.com dashboard > Settings > API Keys |
| `CAL_WEBHOOK_SECRET` | Cal.com dashboard > Webhooks > Secret |
| `RESEND_API_KEY` | resend.com > API Keys |
| `RESEND_FROM_EMAIL` | Your verified sending email |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel deployment URL |
| `ADMIN_EMAIL` | Admin email for notifications |

---

*Last updated: April 2026*
