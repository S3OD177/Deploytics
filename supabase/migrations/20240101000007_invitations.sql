-- Project Invitations Table
create table public.project_invitations (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  project_id uuid not null references public.projects(id) on delete cascade,
  email text not null,
  role text not null default 'viewer',
  token text not null, -- Unique token for accepting
  invited_by uuid not null references auth.users(id),
  status text not null default 'pending', -- 'pending', 'accepted'
  primary key (id),
  unique(project_id, email)
);

-- RLS
alter table public.project_invitations enable row level security;

-- Policies
create policy "Project owners can view invitations" 
  on public.project_invitations for select 
  using (
    exists ( select 1 from public.projects where id = project_invitations.project_id and user_id = auth.uid() )
  );

create policy "Project owners can create invitations" 
  on public.project_invitations for insert 
  with check (
    exists ( select 1 from public.projects where id = project_invitations.project_id and user_id = auth.uid() )
  );

create policy "Project owners can delete invitations" 
  on public.project_invitations for delete 
  using (
    exists ( select 1 from public.projects where id = project_invitations.project_id and user_id = auth.uid() )
  );
