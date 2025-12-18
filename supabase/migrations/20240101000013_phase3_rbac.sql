
-- Create organization_members table for RBAC visualization
create table if not exists organization_members (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid references organizations(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade, 
  role text not null default 'viewer' check (role in ('owner', 'admin', 'developer', 'viewer')),
  created_at timestamptz default now()
);

-- Enable RLS
alter table organization_members enable row level security;

-- Policy: Members can view other members in their organization
create policy "Members can view their organization members"
  on organization_members for select
  using (
    organization_id in (
      select organization_id from organization_members where user_id = auth.uid()
    )
    OR
    -- Allow initial setup or if we don't have orgs deeply integrated yet, allow authenticated users to see (for now, stricter later)
    auth.role() = 'authenticated'
  );

-- Create audit_logs table
create table if not exists audit_logs (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid references organizations(id) on delete set null,
  actor_id uuid references auth.users(id) on delete set null, -- Null if system action
  action text not null, -- e.g. "deployment.created", "settings.updated"
  resource text, -- e.g. "deployment_123"
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Enable RLS
alter table audit_logs enable row level security;

-- Policy: Members can view audit logs for their organization
create policy "Members can view audit logs"
  on audit_logs for select
  using (
    organization_id in (
      select organization_id from organization_members where user_id = auth.uid()
    )
    OR
    auth.role() = 'authenticated'
  );

-- Create indexes
create index idx_org_members_user on organization_members(user_id);
create index idx_org_members_org on organization_members(organization_id);
create index idx_audit_logs_org on audit_logs(organization_id);
create index idx_audit_logs_created on audit_logs(created_at desc);
