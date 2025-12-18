-- Notifications table
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  message text not null,
  type text not null default 'info' check (type in ('info', 'success', 'warning', 'error')),
  read boolean not null default false,
  link text,
  created_at timestamptz default now()
);

-- RLS
alter table public.notifications enable row level security;

create policy "Users can view own notifications" on public.notifications
  for select using (auth.uid() = user_id);

create policy "Users can update own notifications" on public.notifications
  for update using (auth.uid() = user_id);

create policy "Users can delete own notifications" on public.notifications
  for delete using (auth.uid() = user_id);

-- Index for fast lookup
create index notifications_user_unread on public.notifications (user_id, read) where read = false;

-- Function to create notification
create or replace function create_notification(
  p_user_id uuid,
  p_title text,
  p_message text,
  p_type text default 'info',
  p_link text default null
)
returns uuid as $$
declare
  new_id uuid;
begin
  insert into public.notifications (user_id, title, message, type, link)
  values (p_user_id, p_title, p_message, p_type, p_link)
  returning id into new_id;
  
  return new_id;
end;
$$ language plpgsql security definer;
