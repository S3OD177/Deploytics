-- Create API Keys table
create table public.api_keys (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  key_prefix text not null, -- Store first few chars for display (e.g. "dpt_123...")
  key_hash text not null, -- Store hashed key for verification
  last_used_at timestamp with time zone,
  expires_at timestamp with time zone,
  primary key (id)
);

-- Enable RLS
alter table public.api_keys enable row level security;

-- Policies
create policy "Users can view own api keys" 
  on public.api_keys for select 
  using (auth.uid() = user_id);

create policy "Users can create own api keys" 
  on public.api_keys for insert 
  with check (auth.uid() = user_id);

create policy "Users can delete own api keys" 
  on public.api_keys for delete 
  using (auth.uid() = user_id);
