-- ============================================================
-- CUTLAB — Supabase schema
-- Run this in your Supabase project → SQL Editor
-- ============================================================

-- Profiles table (one row per user)
create table if not exists public.profiles (
  id               uuid references auth.users on delete cascade primary key,
  first_name       text,
  last_name        text,
  avatar_url       text,
  languages        text[]   default '{}',
  availability     text     default 'Disponible',
  skills           text[]   default '{}',
  formats          text[]   default '{}',
  niches           text[]   default '{}',
  experience       text,
  software         text[]   default '{}',
  portfolio_links  text[]   default '{}',
  credited_channels text,
  revisions        text     default '2',
  capacity         text     default '2-3',
  hourly_rate      numeric,
  delivery_time    text,
  bio              text,
  mission_types    text[]   default '{}',
  response_time    text,
  social_links     jsonb    NOT NULL DEFAULT '{}'::jsonb,
  assigned_level   integer  default 2,
  status           text     default 'draft',   -- 'draft' | 'published'
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- Row Level Security
alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ============================================================
-- Storage buckets
-- ============================================================

-- Public bucket for profile avatars
insert into storage.buckets (id, name, public)
  values ('avatars', 'avatars', true)
  on conflict do nothing;

-- Public bucket for portfolio clips
insert into storage.buckets (id, name, public)
  values ('portfolio', 'portfolio', true)
  on conflict do nothing;

create policy "Anyone can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can upload their own portfolio clips"
  on storage.objects for insert
  with check (
    bucket_id = 'portfolio'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Anyone can view portfolio clips"
  on storage.objects for select
  using (bucket_id = 'portfolio');

-- Public bucket for presentation videos
insert into storage.buckets (id, name, public)
  values ('videos', 'videos', true)
  on conflict do nothing;

create policy "Anyone can view videos"
  on storage.objects for select
  using (bucket_id = 'videos');

create policy "Users can upload their own video"
  on storage.objects for insert
  with check (
    bucket_id = 'videos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- UPDATE policies (needed for upsert)
create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update their own video"
  on storage.objects for update
  using (
    bucket_id = 'videos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update their own portfolio clips"
  on storage.objects for update
  using (
    bucket_id = 'portfolio'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- MESSAGING SYSTEM — run these additions after the base schema
-- ============================================================

-- Role column on profiles (editor | creator)
alter table public.profiles add column if not exists role text default 'editor';

-- Certification status: 'draft' (no request) | 'pending' (request sent) | 'certified' | 'refused'
alter table public.profiles add column if not exists certification_status text default 'draft';

-- Allow anyone to read published editor profiles (needed for Catalog)
create policy "Anyone can read published profiles"
  on public.profiles for select
  using (status = 'published');

-- ── Contact requests ──────────────────────────────────────────
create table if not exists public.contact_requests (
  id              uuid default gen_random_uuid() primary key,
  creator_id      uuid references auth.users(id) on delete cascade,
  editor_id       uuid references auth.users(id) on delete cascade,
  status          text default 'pending',  -- pending | accepted | refused
  initial_message text,
  creator_name    text,
  editor_name     text,
  created_at      timestamptz default now()
);

alter table public.contact_requests enable row level security;

create policy "parties access contact_requests"
  on public.contact_requests
  using (auth.uid() = creator_id or auth.uid() = editor_id);

create policy "creator insert contact_request"
  on public.contact_requests for insert
  with check (auth.uid() = creator_id);

create policy "parties update contact_requests"
  on public.contact_requests for update
  using (auth.uid() = creator_id or auth.uid() = editor_id);

-- ── Messages ─────────────────────────────────────────────────
create table if not exists public.messages (
  id          uuid default gen_random_uuid() primary key,
  request_id  uuid references public.contact_requests(id) on delete cascade,
  sender_id   uuid references auth.users(id),
  content     text not null,
  created_at  timestamptz default now()
);

alter table public.messages enable row level security;

create policy "parties read messages"
  on public.messages for select
  using (exists (
    select 1 from public.contact_requests cr
    where cr.id = messages.request_id
    and (cr.creator_id = auth.uid() or cr.editor_id = auth.uid())
  ));

create policy "parties send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

-- ── Offers ────────────────────────────────────────────────────
create table if not exists public.offers (
  id           uuid default gen_random_uuid() primary key,
  request_id   uuid references public.contact_requests(id) on delete cascade,
  creator_id   uuid references auth.users(id),
  editor_id    uuid references auth.users(id),
  title        text not null,
  description  text,
  deliverables text,
  format       text,
  deadline     text,
  budget       numeric,
  revisions    integer default 2,
  status       text default 'pending',  -- pending | accepted | refused
  creator_name text,
  editor_name  text,
  created_at   timestamptz default now()
);

alter table public.offers enable row level security;

create policy "parties access offers"
  on public.offers
  using (auth.uid() = creator_id or auth.uid() = editor_id);

create policy "creator insert offer"
  on public.offers for insert
  with check (auth.uid() = creator_id);

create policy "editor update offer"
  on public.offers for update
  using (auth.uid() = editor_id or auth.uid() = creator_id);

-- ============================================================
-- PIPELINE — mission-tracking columns on offers
-- ============================================================
alter table public.offers add column if not exists mission_start date;
alter table public.offers add column if not exists mission_end date;
alter table public.offers add column if not exists validated_by_editor boolean default false;
alter table public.offers add column if not exists validated_by_creator boolean default false;
