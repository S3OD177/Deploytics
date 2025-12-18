-- Public Status Pages support
alter table public.projects add column is_public boolean not null default false;

-- RLS Updates
create policy "Public projects are viewable by everyone" 
  on public.projects for select 
  using ( is_public = true );

create policy "Public project deployments are viewable by everyone" 
  on public.deployments for select 
  using (
    exists (
      select 1 from public.projects 
      where id = deployments.project_id 
      and is_public = true
    )
  );
