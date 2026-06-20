-- ============================================================
-- SOLVANTA SOLAR ENERGY — Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. ASSOCIATES TABLE
create table if not exists associates (
  id text primary key default ('SOL-' || extract(year from now())::text || '-' || lpad((nextval('associate_seq'))::text, 3, '0')),
  name text not null,
  email text unique not null,
  mobile text not null,
  aadhaar text,
  region text default 'Jaipur',
  tier text default 'starter' check (tier in ('starter','silver','gold','platinum')),
  kyc text default 'pending' check (kyc in ('pending','approved','rejected')),
  customers integer default 0,
  kwp_sold numeric default 0,
  revenue numeric default 0,
  commission_earned numeric default 0,
  commission_pending numeric default 0,
  joined_at date default current_date,
  bank_account text,
  ifsc text,
  created_at timestamptz default now()
);

-- sequence for associate IDs
create sequence if not exists associate_seq start 1;

-- 2. CUSTOMERS TABLE
create table if not exists customers (
  id text primary key default ('CUST-' || lpad((nextval('customer_seq'))::text, 3, '0')),
  associate_id text references associates(id) on delete set null,
  name text not null,
  mobile text not null,
  email text,
  address text,
  city text,
  discom text,
  system_kwp numeric not null default 1,
  phase text default 'Single Phase' check (phase in ('Single Phase','3 Phase')),
  system_type text default 'ON Grid' check (system_type in ('ON Grid','OFF Grid','Hybrid')),
  status text default 'new' check (status in ('new','docs_pending','in_progress','completed')),
  docs_uploaded integer default 0,
  docs_required integer default 7,
  gps_lat numeric,
  gps_lng numeric,
  created_at timestamptz default now()
);

create sequence if not exists customer_seq start 1;

-- 3. QUOTES TABLE
create table if not exists quotes (
  id text primary key default ('SOL-QT-' || extract(year from now())::text || '-' || lpad((nextval('quote_seq'))::text, 3, '0')),
  associate_id text references associates(id) on delete set null,
  customer_id text references customers(id) on delete set null,
  customer_name text not null,
  kwp numeric not null,
  phase text,
  panel_brand text,
  panel_desc text,
  total_cost numeric not null,
  subsidy numeric default 78000,
  net_amount numeric not null,
  status text default 'draft' check (status in ('draft','sent','accepted','rejected')),
  created_at timestamptz default now()
);

create sequence if not exists quote_seq start 87;

-- 4. COMMISSIONS TABLE
create table if not exists commissions (
  id uuid primary key default gen_random_uuid(),
  associate_id text references associates(id) on delete cascade,
  associate_name text,
  amount numeric not null,
  type text default 'sale' check (type in ('sale','bonus','referral')),
  status text default 'pending' check (status in ('pending','processing','paid')),
  description text,
  created_at timestamptz default now()
);

-- 5. OFFERS TABLE
create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  type text check (type in ('cash','trip','gift','referral')),
  bonus numeric default 0,
  target integer default 1,
  tier text default 'All Tiers',
  expires_at date,
  active boolean default true,
  tag text default 'NEW' check (tag in ('HOT','NEW','BONUS','SPECIAL')),
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
alter table associates enable row level security;
alter table customers enable row level security;
alter table quotes enable row level security;
alter table commissions enable row level security;
alter table offers enable row level security;

-- Allow all reads for now (tighten later with auth)
create policy "Public read associates" on associates for select using (true);
create policy "Public insert associates" on associates for insert with check (true);
create policy "Public update associates" on associates for update using (true);

create policy "Public read customers" on customers for select using (true);
create policy "Public insert customers" on customers for insert with check (true);
create policy "Public update customers" on customers for update using (true);

create policy "Public read quotes" on quotes for select using (true);
create policy "Public insert quotes" on quotes for insert with check (true);
create policy "Public update quotes" on quotes for update using (true);

create policy "Public read commissions" on commissions for select using (true);
create policy "Public insert commissions" on commissions for insert with check (true);
create policy "Public update commissions" on commissions for update using (true);

create policy "Public read offers" on offers for select using (true);
create policy "Public insert offers" on offers for insert with check (true);

-- ============================================================
-- SEED DATA — Offers
-- ============================================================
insert into offers (title, description, type, bonus, target, tier, expires_at, active, tag) values
('June Star Performer — ₹5,000 Bonus + Jaipur Trip', 'Complete 10 installations in June 2025 and win ₹5,000 cash bonus + all-expenses-paid family trip to Jaipur sponsored by Solvanta Solar Energy.', 'trip', 5000, 10, 'All Tiers', '2025-06-30', true, 'HOT'),
('Referral Bonus — ₹3,000 per Referral', 'Refer a friend as associate. Once they complete 3 installations, you earn ₹3,000. No limit on referrals.', 'referral', 3000, 3, 'All Tiers', '2099-12-31', true, 'BONUS'),
('Digital Champion — Smartphone Prize', 'Upload all customer documents within 48 hours of installation for 3 consecutive months. Win Redmi smartphone worth ₹15,000.', 'gift', 15000, 3, 'Silver & Above', '2025-09-30', true, 'NEW');
