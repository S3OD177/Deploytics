-- Subscriptions table for plan management
create table public.subscriptions (
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

-- RLS
alter table public.subscriptions enable row level security;

create policy "Users can view own subscription" on public.subscriptions
  for select using (auth.uid() = user_id);

create policy "Users can update own subscription" on public.subscriptions
  for update using (auth.uid() = user_id);

-- Purchases table for one-time add-ons
create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  product_type text not null, -- 'extra_projects_5', 'extra_projects_10'
  polar_checkout_id text,
  amount_cents integer not null,
  created_at timestamptz default now()
);

alter table public.purchases enable row level security;

create policy "Users can view own purchases" on public.purchases
  for select using (auth.uid() = user_id);

-- Function to get user's max projects
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
    return 3; -- Free default
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
