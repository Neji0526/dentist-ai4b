-- ===========================================================================
-- Additions for the richer page designs.
--
-- Idempotent, and already folded into 0001_init.sql — run this only if you
-- created your database before these columns existed.
-- ===========================================================================

-- Card ribbon on the services grid, e.g. "Most popular", "Same-day".
alter table public.services
  add column if not exists badge text;

-- Optional hero photograph per page section. When null, the site falls back to
-- its illustrated artwork.
alter table public.services
  add column if not exists hero_image_url text;

alter table public.site_settings
  add column if not exists hero_image_url text;

-- Team photograph at the top of the Our Dentists page.
alter table public.site_settings
  add column if not exists team_image_url text;

alter table public.site_settings
  add column if not exists yelp_url text;

-- ---------------------------------------------------------------------------
-- Newsletter signups from the blog page
-- ---------------------------------------------------------------------------
create table if not exists public.subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  source     text default 'blog',
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- Case-insensitive uniqueness without needing the citext extension.
create unique index if not exists idx_subscribers_email
  on public.subscribers (lower(email));

create index if not exists idx_subscribers_created_at
  on public.subscribers (created_at desc);

alter table public.subscribers enable row level security;

-- Write-only for the public, exactly like leads: anyone may subscribe, only
-- admins may read the list back.
drop policy if exists "subscribers: public create" on public.subscribers;
create policy "subscribers: public create" on public.subscribers
  for insert to anon, authenticated with check (true);

drop policy if exists "subscribers: admin read" on public.subscribers;
create policy "subscribers: admin read" on public.subscribers
  for select using (public.is_admin());

drop policy if exists "subscribers: admin manage" on public.subscribers;
create policy "subscribers: admin manage" on public.subscribers
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Seed the two badges shown in the design
-- ---------------------------------------------------------------------------
update public.services set badge = 'Most popular' where slug = 'clear-aligners' and badge is null;
update public.services set badge = 'Same-day'     where slug = 'emergency-dentist' and badge is null;
