-- ================================================================
-- SwachhApp 3D - Supabase PostgreSQL Schema & Storage Setup
-- Run this script in the Supabase SQL Editor (1-Click Run)
-- ================================================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. User Profiles Table
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id text unique not null,
  name text not null,
  email text unique not null,
  role text not null check (role in ('citizen', 'green_champion', 'ward_officer', 'admin')) default 'citizen',
  training_completed boolean default true,
  training_score integer default 100,
  reports_count integer default 0,
  civic_points integer default 150,
  badge text check (badge in ('none', 'reporter', 'champion', 'hero')) default 'champion',
  created_at timestamp with time zone default now()
);

-- 3. Incident Reports Table
create table if not exists public.reports (
  id text primary key,
  user_id text not null,
  user_name text not null,
  photo_url text not null,
  audio_url text,
  resolved_photo_url text,
  lat double precision not null,
  lng double precision not null,
  address text,
  accuracy double precision,
  description text not null,
  waste_category text not null check (waste_category in ('wet_organic', 'dry_recyclable', 'hazardous', 'e_waste', 'construction', 'mixed')),
  severity text not null check (severity in ('low', 'medium', 'high', 'critical')),
  status text not null check (status in ('pending', 'reviewed', 'resolved')) default 'pending',
  assigned_tipper text,
  eta_minutes integer,
  admin_notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 4. Facilities Table
create table if not exists public.facilities (
  id text primary key,
  name text not null,
  type text not null check (type in ('biomethanisation', 'waste-to-energy', 'recycling', 'scrap-collection')),
  lat double precision not null,
  lng double precision not null,
  address text not null,
  contact text not null,
  operating_hours text default '8:00 AM – 6:00 PM',
  capacity_utilization integer default 75,
  accepted_waste text[] default array['wet_organic', 'dry_recyclable']
);

-- 5. Scrap Rates Index
create table if not exists public.scrap_rates (
  id text primary key,
  material text not null,
  price_per_kg numeric not null,
  trend text check (trend in ('up', 'stable', 'down')) default 'stable',
  icon text default '📦'
);

-- 6. Row Level Security (RLS) Policies
alter table public.profiles enable row level security;
alter table public.reports enable row level security;
alter table public.facilities enable row level security;
alter table public.scrap_rates enable row level security;

-- Allow public read & insert for incident reporting
create policy "Allow public read on reports" on public.reports for select using (true);
create policy "Allow public insert on reports" on public.reports for insert with check (true);
create policy "Allow public update on reports" on public.reports for update using (true);

create policy "Allow public read on facilities" on public.facilities for select using (true);
create policy "Allow public read on scrap_rates" on public.scrap_rates for select using (true);
create policy "Allow public read on profiles" on public.profiles for select using (true);
create policy "Allow public insert on profiles" on public.profiles for insert with check (true);

-- 7. Seed Initial Municipal Facilities
insert into public.facilities (id, name, type, lat, lng, address, contact, operating_hours, capacity_utilization)
values
  ('1', 'Hyderabad Biomethanisation Plant', 'biomethanisation', 17.3850, 78.4867, 'Jawaharlal Nehru Road, Hyderabad', '+91-40-1234-5678', '8:00 AM – 6:00 PM', 68),
  ('2', 'Delhi Waste-to-Energy Facility', 'waste-to-energy', 28.6139, 77.2090, 'Okhla Phase III, New Delhi', '+91-11-9876-5432', '24/7', 84),
  ('3', 'Bangalore Recycling Centre', 'recycling', 12.9716, 77.5946, 'Koramangala, Bengaluru', '+91-80-5555-1234', '9:00 AM – 5:00 PM', 52),
  ('4', 'Mumbai Scrap Collection Hub', 'scrap-collection', 19.0760, 72.8777, 'Dharavi, Mumbai', '+91-22-4444-7890', '7:00 AM – 8:00 PM', 75)
on conflict (id) do nothing;

-- 8. Seed Scrap Rates
insert into public.scrap_rates (id, material, price_per_kg, trend, icon)
values
  ('1', 'Cardboard & Cartons', 14, 'up', '📦'),
  ('2', 'PET Plastic Bottles', 22, 'stable', '🧴'),
  ('3', 'Aluminum Cans', 95, 'up', '🥫'),
  ('4', 'Scrap Iron & Steel', 28, 'down', '🔩'),
  ('5', 'Newspaper / Mixed Paper', 11, 'stable', '📰'),
  ('6', 'E-Waste / Copper Wire', 180, 'up', '🔌')
on conflict (id) do nothing;

-- 9. Storage Bucket Setup
insert into storage.buckets (id, name, public)
values ('waste-evidence', 'waste-evidence', true)
on conflict (id) do nothing;

create policy "Public Access to Waste Evidence"
on storage.objects for select
using ( bucket_id = 'waste-evidence' );

create policy "Public Upload to Waste Evidence"
on storage.objects for insert
with check ( bucket_id = 'waste-evidence' );
