-- ============================================================
-- CUTLAB — Supabase schema
-- Run this in your Supabase project → SQL Editor
-- ============================================================

-- Profiles table (one row per user)
create table if not exists public.profiles (
  id               uuid references auth.users on delete cascade primary key,
  first_name       text,
  last_name        text,
  username         text,
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
  social_links     text,
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

-- Private bucket for portfolio clips
insert into storage.buckets (id, name, public)
  values ('portfolio', 'portfolio', false)
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

create policy "Users can view their own portfolio clips"
  on storage.objects for select
  using (
    bucket_id = 'portfolio'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
