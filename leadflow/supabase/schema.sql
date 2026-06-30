-- Run this in the Supabase SQL editor

create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  company     text,
  role        text,
  is_duplicate boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Index for fast duplicate-email lookups
create index if not exists leads_email_idx on public.leads (email);

-- Enable RLS
alter table public.leads enable row level security;

-- Only authenticated users can SELECT
create policy "Authenticated users can read leads"
  on public.leads for select
  to authenticated
  using (true);

-- Anyone (anon) can INSERT — this is the public form
create policy "Anyone can insert a lead"
  on public.leads for insert
  to anon, authenticated
  with check (true);
