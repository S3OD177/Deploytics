-- Usage Metrics Table
create table public.usage_metrics (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  project_id uuid not null references public.projects(id) on delete cascade,
  metric_name text not null, -- 'bandwidth_gb', 'storage_gb', 'build_minutes'
  value numeric not null default 0,
  recorded_at timestamp with time zone not null default now(),
  primary key (id)
);

-- RLS: Usage Metrics
alter table public.usage_metrics enable row level security;

create policy "Users can view usage of own projects" 
  on public.usage_metrics for select 
  using (
    exists ( select 1 from public.projects where id = usage_metrics.project_id and user_id = auth.uid() )
  );
