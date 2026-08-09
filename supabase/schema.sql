-- ============================================================
-- UnisoleAI - Full Supabase schema
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- ============================================================
-- 1. PROFILES
-- One row per signed-in user, auto-created on signup.
-- ============================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 2. TRANSACTIONS
-- Razorpay payments recorded from the payment-link success redirect.
-- ============================================================
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  email text,
  amount numeric,
  currency text default 'INR',
  plan text,
  razorpay_payment_id text,
  razorpay_payment_link_id text,
  status text default 'completed',
  created_at timestamptz default now()
);

alter table public.transactions enable row level security;

-- Users can read only their own transactions.
create policy "transactions_select_own" on public.transactions
  for select using (auth.uid() = user_id);

-- Transactions are inserted by the razorpay-webhook Edge Function using the
-- service-role key, which bypasses RLS. No anon/authenticated insert policy.

-- ============================================================
-- 3. SUBSCRIPTIONS
-- Tracks a user's active subscription plan and expiry.
-- ============================================================
create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  email text,
  plan text default 'unisoleai-subscription',
  status text default 'active', -- active | expired | cancelled
  started_at timestamptz default now(),
  expires_at timestamptz,
  created_at timestamptz default now()
);

alter table public.subscriptions enable row level security;

-- Users can read only their own subscription.
create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);

-- Subscriptions are created/updated by the razorpay-webhook Edge Function
-- using the service-role key, which bypasses RLS. No anon/authenticated
-- insert or update policies, so users cannot modify their own subscription.

-- ============================================================
-- 4. INDEXES
-- ============================================================
create index if not exists transactions_user_idx on public.transactions (user_id);
create index if not exists transactions_created_at_idx on public.transactions (created_at desc);
create index if not exists subscriptions_user_idx on public.subscriptions (user_id);
