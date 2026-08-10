-- ===========================================================================
-- Brightsmile Dental — schema, indexes and Row Level Security
-- Run this first (SQL Editor in the Supabase dashboard, or `supabase db push`).
-- ===========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'lead_status') then
    create type public.lead_status as enum (
      'new',
      'contacted',
      'appointment_scheduled',
      'completed'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'staff_role') then
    create type public.staff_role as enum ('admin', 'staff');
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles — one row per Supabase Auth user; drives admin access
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  full_name  text,
  role       public.staff_role not null default 'staff',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-provision a profile whenever a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- security definer so policies can read profiles without recursing into RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- services
-- ---------------------------------------------------------------------------
create table if not exists public.services (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  slug              text not null unique,
  short_description text,
  description       text,
  image_url         text,
  hero_image_url    text,
  icon              text default 'tooth',
  -- Small ribbon on the services grid, e.g. "Most popular".
  badge             text,
  price_from        numeric(10, 2),
  duration          text,
  benefits          text[] not null default '{}',
  is_featured       boolean not null default false,
  is_published      boolean not null default true,
  sort_order        integer not null default 0,
  meta_title        text,
  meta_description  text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- doctors
-- ---------------------------------------------------------------------------
create table if not exists public.doctors (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  slug             text not null unique,
  title            text,
  photo_url        text,
  bio              text,
  experience_years integer not null default 0,
  specialties      text[] not null default '{}',
  education        text[] not null default '{}',
  languages        text[] not null default '{}',
  is_published     boolean not null default true,
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------------
create table if not exists public.testimonials (
  id           uuid primary key default gen_random_uuid(),
  patient_name text not null,
  message      text not null,
  rating       smallint not null default 5 check (rating between 1 and 5),
  treatment    text,
  service_id   uuid references public.services (id) on delete set null,
  is_published boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- blogs
-- ---------------------------------------------------------------------------
create table if not exists public.blogs (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique,
  excerpt          text,
  content          text,
  cover_image_url  text,
  author_name      text,
  tags             text[] not null default '{}',
  read_minutes     integer not null default 4,
  is_published     boolean not null default false,
  published_at     timestamptz,
  meta_title       text,
  meta_description text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- faq
-- ---------------------------------------------------------------------------
create table if not exists public.faq (
  id           uuid primary key default gen_random_uuid(),
  question     text not null,
  answer       text not null,
  category     text default 'General',
  is_published boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- leads — the reason the site exists
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  phone          text not null,
  email          text,
  service        text,
  service_id     uuid references public.services (id) on delete set null,
  preferred_date date,
  preferred_time text,
  message        text,
  status         public.lead_status not null default 'new',
  source         text default 'website',
  page_path      text,
  internal_notes text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- subscribers — newsletter signups from the blog
-- ---------------------------------------------------------------------------
create table if not exists public.subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  source     text default 'blog',
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- site_settings — singleton row for NAP + default SEO
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id                    integer primary key default 1 check (id = 1),
  clinic_name           text not null default 'Brightsmile Dental Studio',
  tagline               text,
  phone                 text,
  whatsapp              text,
  email                 text,
  address_line          text,
  city                  text,
  state                 text,
  postal_code           text,
  map_embed_url         text,
  opening_hours         jsonb not null default '[]'::jsonb,
  emergency_note        text,
  default_meta_title    text,
  default_meta_description text,
  og_image_url          text,
  -- Optional hero photograph; falls back to illustrated artwork when null.
  hero_image_url        text,
  facebook_url          text,
  instagram_url         text,
  yelp_url              text,
  google_reviews_url    text,
  updated_at            timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'services', 'doctors', 'testimonials', 'blogs', 'faq', 'leads', 'site_settings'
  ]
  loop
    execute format('drop trigger if exists trg_%1$s_updated_at on public.%1$s', t);
    execute format(
      'create trigger trg_%1$s_updated_at before update on public.%1$s
         for each row execute function public.set_updated_at()', t);
  end loop;
end
$$;

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index if not exists idx_services_published on public.services (is_published, sort_order);
create index if not exists idx_services_featured  on public.services (is_featured) where is_featured;
create index if not exists idx_doctors_published  on public.doctors (is_published, sort_order);
create index if not exists idx_testimonials_pub   on public.testimonials (is_published, sort_order);
create index if not exists idx_testimonials_svc   on public.testimonials (service_id);
create index if not exists idx_blogs_published    on public.blogs (is_published, published_at desc);
create index if not exists idx_blogs_tags         on public.blogs using gin (tags);
create index if not exists idx_faq_published      on public.faq (is_published, sort_order);
create index if not exists idx_leads_status       on public.leads (status, created_at desc);
create index if not exists idx_leads_created_at   on public.leads (created_at desc);
create index if not exists idx_leads_service      on public.leads (service_id);
-- Case-insensitive uniqueness without needing the citext extension.
create unique index if not exists idx_subscribers_email on public.subscribers (lower(email));
create index if not exists idx_subscribers_created  on public.subscribers (created_at desc);

-- ===========================================================================
-- Row Level Security
--   * anonymous visitors: read published content, create leads
--   * admins:             full control over everything
-- ===========================================================================
alter table public.profiles      enable row level security;
alter table public.services      enable row level security;
alter table public.doctors       enable row level security;
alter table public.testimonials  enable row level security;
alter table public.blogs         enable row level security;
alter table public.faq           enable row level security;
alter table public.leads         enable row level security;
alter table public.subscribers   enable row level security;
alter table public.site_settings enable row level security;

-- profiles ------------------------------------------------------------------
drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- Users may edit their own name/email but never grant themselves a role.
-- Enforced in a trigger rather than a policy so the check cannot recurse
-- back into profiles' own RLS.
create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'only an admin may change a role';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_profiles_guard_role on public.profiles;
create trigger trg_profiles_guard_role
  before update on public.profiles
  for each row execute function public.guard_profile_role();

drop policy if exists "profiles: admin manage" on public.profiles;
create policy "profiles: admin manage" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- published-content tables --------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array['services', 'doctors', 'testimonials', 'faq']
  loop
    execute format($f$
      drop policy if exists "%1$s: public read published" on public.%1$s;
      create policy "%1$s: public read published" on public.%1$s
        for select using (is_published);

      drop policy if exists "%1$s: admin manage" on public.%1$s;
      create policy "%1$s: admin manage" on public.%1$s
        for all using (public.is_admin()) with check (public.is_admin());
    $f$, t);
  end loop;
end
$$;

-- blogs: only published *and* released posts are public ----------------------
drop policy if exists "blogs: public read published" on public.blogs;
create policy "blogs: public read published" on public.blogs
  for select using (is_published and (published_at is null or published_at <= now()));

drop policy if exists "blogs: admin manage" on public.blogs;
create policy "blogs: admin manage" on public.blogs
  for all using (public.is_admin()) with check (public.is_admin());

-- leads: write-only for the public, readable only by admins -----------------
drop policy if exists "leads: public create" on public.leads;
create policy "leads: public create" on public.leads
  for insert to anon, authenticated with check (true);

drop policy if exists "leads: admin read" on public.leads;
create policy "leads: admin read" on public.leads
  for select using (public.is_admin());

drop policy if exists "leads: admin update" on public.leads;
create policy "leads: admin update" on public.leads
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "leads: admin delete" on public.leads;
create policy "leads: admin delete" on public.leads
  for delete using (public.is_admin());

-- subscribers: same write-only shape as leads -------------------------------
drop policy if exists "subscribers: public create" on public.subscribers;
create policy "subscribers: public create" on public.subscribers
  for insert to anon, authenticated with check (true);

drop policy if exists "subscribers: admin read" on public.subscribers;
create policy "subscribers: admin read" on public.subscribers
  for select using (public.is_admin());

drop policy if exists "subscribers: admin manage" on public.subscribers;
create policy "subscribers: admin manage" on public.subscribers
  for all using (public.is_admin()) with check (public.is_admin());

-- site_settings -------------------------------------------------------------
drop policy if exists "site_settings: public read" on public.site_settings;
create policy "site_settings: public read" on public.site_settings
  for select using (true);

drop policy if exists "site_settings: admin manage" on public.site_settings;
create policy "site_settings: admin manage" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- ===========================================================================
-- Storage buckets: public read, admin write
-- ===========================================================================
insert into storage.buckets (id, name, public)
values ('doctors', 'doctors', true),
       ('services', 'services', true),
       ('blog', 'blog', true)
on conflict (id) do update set public = true;

drop policy if exists "media: public read" on storage.objects;
create policy "media: public read" on storage.objects
  for select using (bucket_id in ('doctors', 'services', 'blog'));

drop policy if exists "media: admin write" on storage.objects;
create policy "media: admin write" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('doctors', 'services', 'blog') and public.is_admin());

drop policy if exists "media: admin update" on storage.objects;
create policy "media: admin update" on storage.objects
  for update to authenticated
  using (bucket_id in ('doctors', 'services', 'blog') and public.is_admin());

drop policy if exists "media: admin delete" on storage.objects;
create policy "media: admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id in ('doctors', 'services', 'blog') and public.is_admin());

-- ===========================================================================
-- Reporting view used by the admin dashboard
-- ===========================================================================
create or replace view public.lead_stats
with (security_invoker = true) as
select
  count(*)                                                as total,
  count(*) filter (where status = 'new')                   as new_count,
  count(*) filter (where status = 'contacted')             as contacted_count,
  count(*) filter (where status = 'appointment_scheduled') as scheduled_count,
  count(*) filter (where status = 'completed')             as completed_count,
  count(*) filter (where created_at >= now() - interval '7 days')  as last_7_days,
  count(*) filter (where created_at >= now() - interval '30 days') as last_30_days
from public.leads;
