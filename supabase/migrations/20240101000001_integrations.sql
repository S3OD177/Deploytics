-- Integrations Table
create table public.integrations (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  project_id uuid not null references public.projects(id) on delete cascade,
  provider text not null, -- 'github', 'vercel'
  config jsonb default '{}'::jsonb, -- Store sensitive tokens here (encrypted in app logic ideally, or assume secured env)
  status text default 'connected', -- 'connected', 'error'
  last_synced_at timestamp with time zone,
  primary key (id),
  unique(project_id, provider)
);

-- RLS: Integrations
alter table public.integrations enable row level security;

create policy "Users can view integrations of own projects" 
  on public.integrations for select 
  using (
    exists ( select 1 from public.projects where id = integrations.project_id and user_id = auth.uid() )
  );

create policy "Users can manage integrations of own projects" 
  on public.integrations for all
  using (
    exists ( select 1 from public.projects where id = integrations.project_id and user_id = auth.uid() )
  );
