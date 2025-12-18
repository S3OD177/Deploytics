-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Projects Table
create table public.projects (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  name text not null,
  description text,
  tier text default 'free',
  status text not null default 'active',
  user_id uuid not null references auth.users(id) on delete cascade,
  primary key (id)
);

-- Deployments Table
create table public.deployments (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  project_id uuid not null references public.projects(id) on delete cascade,
  status text not null, -- 'success', 'failed', 'building', 'queued'
  commit_message text,
  commit_hash text,
  branch text,
  environment text default 'production',
  duration_seconds integer,
  primary key (id)
);

-- Alert Rules
create table public.alert_rules (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  project_id uuid not null references public.projects(id) on delete cascade,
  event_type text not null, -- 'deployment_failed', 'deployment_succeeded'
  channel text not null, -- 'email', 'slack'
  config jsonb default '{}'::jsonb, -- e.g. { "email": "..." }
  enabled boolean default true,
  primary key (id)
);

-- RLS Enable
alter table public.projects enable row level security;
alter table public.deployments enable row level security;
alter table public.alert_rules enable row level security;

-- Policies: Projects
create policy "Users can view own projects" 
  on public.projects for select 
  using (auth.uid() = user_id);

create policy "Users can create own projects" 
  on public.projects for insert 
  with check (auth.uid() = user_id);

create policy "Users can update own projects" 
  on public.projects for update 
  using (auth.uid() = user_id);

create policy "Users can delete own projects" 
  on public.projects for delete 
  using (auth.uid() = user_id);

-- Policies: Deployments
create policy "Users can view deployments of own projects" 
  on public.deployments for select 
  using (
    exists ( select 1 from public.projects where id = deployments.project_id and user_id = auth.uid() )
  );

create policy "Users can insert deployments for own projects" 
  on public.deployments for insert 
  with check (
    exists ( select 1 from public.projects where id = deployments.project_id and user_id = auth.uid() )
  );

-- Policies: Alert Rules
create policy "Users can view rules of own projects" 
  on public.alert_rules for select 
  using (
    exists ( select 1 from public.projects where id = alert_rules.project_id and user_id = auth.uid() )
  );

create policy "Users can manage rules of own projects" 
  on public.alert_rules for all
  using (
    exists ( select 1 from public.projects where id = alert_rules.project_id and user_id = auth.uid() )
  );
