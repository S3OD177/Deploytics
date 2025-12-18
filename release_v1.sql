-- Release v1.0 Migration
-- Run this in your Supabase SQL Editor

-- 1. Subscriptions & Purchases
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null unique,
  plan text not null default 'free' check (plan in ('free', 'pro', 'enterprise')),
  status text not null default 'active' check (status in ('active', 'canceled', 'past_due')),
  polar_subscription_id text,
  polar_customer_id text,
  current_period_end timestamptz,
  extra_projects integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscription" on public.subscriptions
  for select using (auth.uid() = user_id);

create policy "Users can update own subscription" on public.subscriptions
  for update using (auth.uid() = user_id);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  product_type text not null,
  polar_checkout_id text,
  amount_cents integer not null,
  created_at timestamptz default now()
);

alter table public.purchases enable row level security;

create policy "Users can view own purchases" on public.purchases
  for select using (auth.uid() = user_id);

create or replace function get_user_max_projects(uid uuid)
returns integer as $$
declare
  base_limit integer;
  extra integer;
  user_plan text;
begin
  select plan, extra_projects into user_plan, extra
  from public.subscriptions
  where user_id = uid;
  
  if user_plan is null then
    return 3;
  end if;
  
  case user_plan
    when 'free' then base_limit := 3;
    when 'pro' then base_limit := 10;
    when 'enterprise' then base_limit := 25;
    else base_limit := 3;
  end case;
  
  return base_limit + coalesce(extra, 0);
end;
$$ language plpgsql security definer;

-- 2. Notifications
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  message text not null,
  type text not null default 'info' check (type in ('info', 'success', 'warning', 'error')),
  read boolean not null default false,
  link text,
  created_at timestamptz default now()
);

alter table public.notifications enable row level security;

create policy "Users can view own notifications" on public.notifications
  for select using (auth.uid() = user_id);

create policy "Users can update own notifications" on public.notifications
  for update using (auth.uid() = user_id);

create policy "Users can delete own notifications" on public.notifications
  for delete using (auth.uid() = user_id);

create index if not exists notifications_user_unread on public.notifications (user_id, read) where read = false;

create or replace function create_notification(
  p_user_id uuid,
  p_title text,
  p_message text,
  p_type text default 'info',
  p_link text default null
)
returns uuid as $$
declare
  new_id uuid;
begin
  insert into public.notifications (user_id, title, message, type, link)
  values (p_user_id, p_title, p_message, p_type, p_link)
  returning id into new_id;
  
  return new_id;
end;
$$ language plpgsql security definer;
