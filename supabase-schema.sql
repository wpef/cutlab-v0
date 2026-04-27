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
  pricing          jsonb    not null default '{}'::jsonb,
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
  id                    uuid default gen_random_uuid() primary key,
  request_id            uuid references public.contact_requests(id) on delete cascade,
  creator_id            uuid references auth.users(id),
  editor_id             uuid references auth.users(id),
  title                 text not null,
  description           text,
  deliverables          text,
  content_format        text,
  deadline              text,
  budget                numeric,
  revisions             integer default 2,
  status                text default 'pending',  -- pending | accepted | refused
  creator_name          text,
  editor_name           text,
  budget_type           text check (budget_type in ('fixed', 'range')) default 'fixed',
  budget_min            numeric,
  budget_max            numeric,
  quality               text,
  video_count           integer,
  video_duration        text,
  thumbnail_included    boolean default false,
  niches                text[] default '{}',
  preferred_software    text[] default '{}',
  required_languages    text[] default '{}',
  experience_level      text,
  mission_type          text,
  rushes_info           text,
  created_at            timestamptz default now()
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

-- ============================================================
-- PROJECTS (spec: 002-short-name-creator)
-- ============================================================
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  content_format text,
  niches text[] default '{}',
  deliverables jsonb not null default '[]',
  budget_type text not null default 'fixed' check (budget_type in ('fixed', 'range')),
  budget_fixed numeric,
  budget_min numeric,
  budget_max numeric,
  start_date date,
  deadline date,
  quality text,
  thumbnail_included boolean not null default false,
  video_count integer,
  video_duration text,
  revision_count integer default 2,
  preferred_software text[] default '{}',
  required_languages text[] default '{}',
  experience_level text,
  mission_type text,
  rushes_info text,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'filled', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_projects_creator_id on public.projects(creator_id);
create index if not exists idx_projects_status on public.projects(status) where status = 'published';

alter table public.projects enable row level security;

create policy if not exists "Published projects visible to all auth users"
  on public.projects for select
  using (status = 'published' and auth.uid() is not null);

create policy if not exists "Creators view own projects"
  on public.projects for select
  using (creator_id = auth.uid());

create policy if not exists "Creators insert own projects"
  on public.projects for insert
  with check (creator_id = auth.uid());

create policy if not exists "Creators update own projects"
  on public.projects for update
  using (creator_id = auth.uid());

create policy if not exists "Creators delete own draft projects"
  on public.projects for delete
  using (creator_id = auth.uid() and status = 'draft');

-- ============================================================
-- NOTIFICATIONS (spec: 002-short-name-creator)
-- ============================================================
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  project_id uuid references public.projects(id) on delete cascade,
  request_id uuid references public.contact_requests(id) on delete cascade,
  actor_id uuid references auth.users(id),
  actor_name text,
  project_title text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user_id on public.notifications(user_id);
create index if not exists idx_notifications_user_unread on public.notifications(user_id) where read = false;

alter table public.notifications enable row level security;

create policy if not exists "Users view own notifications"
  on public.notifications for select
  using (user_id = auth.uid());

create policy if not exists "Auth users create notifications"
  on public.notifications for insert
  with check (auth.uid() is not null);

create policy if not exists "Users update own notifications"
  on public.notifications for update
  using (user_id = auth.uid());

create policy if not exists "Users delete own notifications"
  on public.notifications for delete
  using (user_id = auth.uid());

-- ============================================================
-- CONTACT REQUESTS — extra columns for collab tracking
-- ============================================================
alter table public.contact_requests add column if not exists project_id uuid references public.projects(id) on delete set null;
alter table public.contact_requests add column if not exists payment_sent_at timestamptz;
alter table public.contact_requests add column if not exists payment_received_at timestamptz;

-- ============================================================
-- DELIVERABLE ROUNDS — tracks each delivery iteration
-- ============================================================
create table if not exists public.deliverable_rounds (
  id           uuid default gen_random_uuid() primary key,
  request_id   uuid not null references public.contact_requests(id) on delete cascade,
  round_number int not null,
  editor_id    uuid not null references auth.users(id),
  delivery_link text,
  editor_note  text,
  status       text not null default 'pending_review'
    check (status in ('pending_review', 'revision_requested', 'validated')),
  creator_feedback text,
  created_at   timestamptz not null default now(),
  reviewed_at  timestamptz,
  unique (request_id, round_number)
);

create index if not exists idx_deliverable_rounds_request on public.deliverable_rounds(request_id);

alter table public.deliverable_rounds enable row level security;

create policy "parties access deliverable_rounds"
  on public.deliverable_rounds
  using (exists (
    select 1 from public.contact_requests cr
    where cr.id = deliverable_rounds.request_id
    and (cr.creator_id = auth.uid() or cr.editor_id = auth.uid())
  ));

create policy "editor insert deliverable_rounds"
  on public.deliverable_rounds for insert
  with check (auth.uid() = editor_id);

create policy "creator update deliverable_rounds"
  on public.deliverable_rounds for update
  using (exists (
    select 1 from public.contact_requests cr
    where cr.id = deliverable_rounds.request_id
    and cr.creator_id = auth.uid()
  ));

-- ============================================================
-- PROJECT REVIEWS — end-of-collaboration feedback
-- ============================================================
create table if not exists public.project_reviews (
  id          uuid default gen_random_uuid() primary key,
  request_id  uuid not null references public.contact_requests(id) on delete cascade,
  reviewer_id uuid not null references auth.users(id),
  reviewee_id uuid not null references auth.users(id),
  rating      int check (rating between 1 and 5),
  comment     text,
  type        text not null check (type in ('creator_to_editor', 'editor_to_creator')),
  created_at  timestamptz not null default now(),
  unique (request_id, type)
);

alter table public.project_reviews enable row level security;

create policy "parties access project_reviews"
  on public.project_reviews
  using (auth.uid() = reviewer_id or auth.uid() = reviewee_id);

create policy "parties insert project_reviews"
  on public.project_reviews for insert
  with check (auth.uid() = reviewer_id);
