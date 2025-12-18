-- Alert Rules Table
create table public.alert_rules (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  project_id uuid not null references public.projects(id) on delete cascade,
  channel_type text not null, -- 'email', 'slack', 'discord'
  config jsonb not null default '{}'::jsonb, -- { "webhook_url": "..." }
  events text[] not null default '{deployment.failed}', -- ['deployment.success', 'deployment.failed']
  enabled boolean not null default true,
  primary key (id)
);

-- RLS
alter table public.alert_rules enable row level security;

create policy "Users can manage alerts for their projects" 
  on public.alert_rules 
  using (
    exists ( select 1 from public.projects where id = alert_rules.project_id and user_id = auth.uid() )
  );
