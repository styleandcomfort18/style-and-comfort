-- ============================================================
-- Style & Comfort — Database Schema
-- Run this once in Supabase: Project → SQL Editor → New query
-- → paste this whole file → Run
-- ============================================================

-- Products, with all three price tiers built in
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,       -- men, women, kids, electronics, footwear, bags, socks, bedsheets
  sub text not null,             -- e.g. "Jeans", "Cricket Jersey"
  description text,
  images text[] default '{}',
  retail_price integer not null,     -- in GYD, whole dollars (no cents)
  wholesale_price integer not null,  -- applies at 3+ of same item
  reseller_price integer not null,   -- applies to reseller-tagged customers
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Sizes and stock per product
create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  size text not null,
  stock integer not null default 0
);

-- Delivery zones and charges (your delivery chart lives here)
create table if not exists delivery_zones (
  id uuid primary key default gen_random_uuid(),
  zone_name text not null,
  price integer not null,   -- in GYD
  is_active boolean default true
);

-- Customers, tagged by price tier (retail is default; wholesale/reseller set manually by you)
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text,
  email text,
  price_tier text not null default 'retail', -- retail | wholesale | reseller
  created_at timestamptz default now()
);

-- Orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  delivery_address text not null,
  delivery_zone text not null,
  delivery_fee integer not null,
  payment_method text not null,   -- 'COD' or 'MMG'
  payment_screenshot_url text,     -- for MMG orders
  subtotal integer not null,
  total integer not null,
  status text not null default 'pending', -- pending, confirmed, out_for_delivery, delivered, cancelled
  created_at timestamptz default now()
);

-- Order line items
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,
  size text not null,
  quantity integer not null,
  unit_price integer not null,
  line_total integer not null
);

-- ============================================================
-- Security: allow the store's public (browser) key to READ
-- products/zones, but NOT write to anything. Orders can be
-- INSERTED by anyone (that's a customer checking out) but not
-- read back or edited by the public key — only from the admin
-- dashboard using proper login, added in a later step.
-- ============================================================

alter table products enable row level security;
alter table product_variants enable row level security;
alter table delivery_zones enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "Public can read active products"
  on products for select
  using (is_active = true);

create policy "Public can read variants"
  on product_variants for select
  using (true);

create policy "Public can read delivery zones"
  on delivery_zones for select
  using (is_active = true);

create policy "Public can place orders"
  on orders for insert
  with check (true);

create policy "Public can add order items"
  on order_items for insert
  with check (true);

-- Seed your delivery zones (replace with your real chart any time
-- from Table Editor → delivery_zones, no code needed)
insert into delivery_zones (zone_name, price) values
  ('Georgetown', 500),
  ('East Bank Demerara', 800),
  ('East Coast Demerara', 800),
  ('West Demerara', 1000),
  ('Berbice', 1500),
  ('Essequibo', 1800);
