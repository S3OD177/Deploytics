-- Create project_members table
create table public.project_members (
  id uuid not null default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null, -- Denormalized for display
  role text not null check (role in ('owner', 'admin', 'viewer')),
  created_at timestamp with time zone not null default now(),
  primary key (id),
  unique(project_id, user_id)
);

-- Enable RLS
alter table public.project_members enable row level security;

-- Policy: Users can view members of projects they belong to
create policy "View project members" on public.project_members
  for select using (
    exists (
      select 1 from public.projects
      where id = project_members.project_id
      and (created_by = auth.uid() or exists (select 1 from public.project_members pm where pm.project_id = id and pm.user_id = auth.uid()))
    )
  );

-- Policy: Only project owners (creators) can add/remove members
create policy "Manage project members" on public.project_members
  for all using (
    exists (
      select 1 from public.projects
      where id = project_members.project_id
      and created_by = auth.uid()
    )
  );

-- Update Projects Policy rule: handled by existing or new separate policy file if needed, but here logically.
create policy "Members can view projects" on public.projects
  for select using (
    exists (
      select 1 from public.project_members
      where project_id = id
      and user_id = auth.uid()
    )
  );
