-- ============================================================
-- Aditya Wale Portfolio Database Schema
-- Run this file in: Supabase Dashboard > SQL Editor
-- ============================================================

-- ---------- Projects table ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  short_description text,
  full_description text,
  technologies text[] default '{}',
  github_url text,
  live_url text,
  image_url text,
  featured boolean default false,
  category text,
  created_at timestamptz default now()
);

-- ---------- Certificates table ----------
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text,
  issue_date date,
  credential_url text,
  certificate_file_url text,
  certificate_image_url text,
  category text,
  skills text[] default '{}',
  featured boolean default false,
  created_at timestamptz default now(),
  unique (issuer, title)
);

alter table public.certificates
  add column if not exists category text;

-- ---------- Site settings table ----------
create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

-- ============================================================
-- Row Level Security
-- Public users can only read. Admin writes happen through the Python backend.
-- ============================================================

alter table public.projects enable row level security;
alter table public.certificates enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Projects are publicly viewable" on public.projects;
create policy "Projects are publicly viewable"
  on public.projects
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Certificates are publicly viewable" on public.certificates;
create policy "Certificates are publicly viewable"
  on public.certificates
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Site settings are publicly viewable" on public.site_settings;
create policy "Site settings are publicly viewable"
  on public.site_settings
  for select
  to anon, authenticated
  using (true);

-- ============================================================
-- Storage buckets
-- ============================================================

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('certificate-files', 'certificate-files', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('certificate-images', 'certificate-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('resume-files', 'resume-files', true)
on conflict (id) do nothing;

insert into public.site_settings (key, value)
values ('resume_url', '/resume/aditya-wale-resume.pdf')
on conflict (key) do nothing;

-- ============================================================
-- Remove old predefined demo content
-- All projects and certificates should now be added manually from /admin.
-- ============================================================

delete from public.projects
where slug in (
  'hate-speech-detection',
  'media-recommendation-browser-extension'
);

delete from public.certificates
where (issuer, title) in (
  ('IBM', 'DevOps, Agile, and Design Thinking'),
  ('IBM', 'Predictive Modeling with IBM SPSS Modeler'),
  ('NPTEL', 'E-Business'),
  ('EXCELR', 'Certificate Program in Python Full Stack')
);
