-- Travel periods table
-- Stores Lex's planned location schedule.
-- Managed via the /admin page on the site.

create table if not exists public.travel_periods (
  id          uuid primary key default gen_random_uuid(),
  city        text not null,
  country     text not null,          -- ISO 3166-1 alpha-2, e.g. "PT", "DE"
  from_date   date not null,
  to_date     date not null,
  note        text,
  cal_slug    text,                   -- Cal.com event slug for this location (optional)
  created_at  timestamptz not null default now(),

  constraint travel_periods_dates_check check (to_date >= from_date)
);

-- Allow public reads (server components and client pages)
alter table public.travel_periods enable row level security;

create policy "Public read" on public.travel_periods
  for select using (true);

create policy "Service role full access" on public.travel_periods
  for all using (auth.role() = 'service_role');
