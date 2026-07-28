-- Server-side arrival counter.
-- Ground truth for "did the ad click actually reach the site", independent of
-- cookie consent, ad blockers and client-side JavaScript.

create table if not exists public.page_hits (
  id           bigserial primary key,
  created_at   timestamptz not null default now(),
  path         text not null,
  gclid        text,
  fbclid       text,
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  utm_content  text,
  utm_term     text,
  referrer     text,
  user_agent   text,
  country      text,
  is_paid      boolean not null default false
);

create index if not exists page_hits_created_at_idx on public.page_hits (created_at desc);
create index if not exists page_hits_is_paid_idx    on public.page_hits (is_paid, created_at desc);
create index if not exists page_hits_utm_source_idx on public.page_hits (utm_source, created_at desc);

alter table public.page_hits enable row level security;

-- Writes come from the edge middleware using the service role key only.
create policy "Service role full access" on public.page_hits
  for all using (auth.role() = 'service_role');
