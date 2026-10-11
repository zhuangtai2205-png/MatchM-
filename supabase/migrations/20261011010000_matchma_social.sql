-- MatchMa social chat, public profiles, and customizable visitor spaces.
create table if not exists public.matchma_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9_]{3,24}$'),
  display_name text not null default 'Bạn mới' check (char_length(display_name) between 1 and 60),
  bio text not null default '' check (char_length(bio) <= 240),
  avatar_emoji text not null default '🌿' check (char_length(avatar_emoji) <= 12),
  space_public boolean not null default true,
  space_settings jsonb not null default '{"theme":"matchma","decorations":["leaf","flower"],"welcome":"Chào mừng ghé thăm không gian của mình!"}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists matchma_profiles_username_idx on public.matchma_profiles (username);
alter table public.matchma_profiles enable row level security;
grant select, insert, update on public.matchma_profiles to authenticated;
drop policy if exists matchma_profiles_select_public on public.matchma_profiles;
create policy matchma_profiles_select_public on public.matchma_profiles for select to authenticated
using (space_public = true or id = (select auth.uid()));
drop policy if exists matchma_profiles_insert_self on public.matchma_profiles;
create policy matchma_profiles_insert_self on public.matchma_profiles for insert to authenticated
with check (id = (select auth.uid()));
drop policy if exists matchma_profiles_update_self on public.matchma_profiles;
create policy matchma_profiles_update_self on public.matchma_profiles for update to authenticated
using (id = (select auth.uid())) with check (id = (select auth.uid()));

create table if not exists public.matchma_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now(),
  read_at timestamptz,
  constraint matchma_messages_no_self check (sender_id <> recipient_id)
);
create index if not exists matchma_messages_sender_created_idx on public.matchma_messages (sender_id, created_at desc);
create index if not exists matchma_messages_recipient_created_idx on public.matchma_messages (recipient_id, created_at desc);
alter table public.matchma_messages enable row level security;
grant select, insert, update on public.matchma_messages to authenticated;
drop policy if exists matchma_messages_read_participant on public.matchma_messages;
create policy matchma_messages_read_participant on public.matchma_messages for select to authenticated
using ((select auth.uid()) = sender_id or (select auth.uid()) = recipient_id);
drop policy if exists matchma_messages_send_self on public.matchma_messages;
create policy matchma_messages_send_self on public.matchma_messages for insert to authenticated
with check ((select auth.uid()) = sender_id and recipient_id <> (select auth.uid()));
drop policy if exists matchma_messages_mark_received on public.matchma_messages;
create policy matchma_messages_mark_received on public.matchma_messages for update to authenticated
using ((select auth.uid()) = recipient_id)
with check ((select auth.uid()) = recipient_id);
create or replace function public.matchma_protect_message_fields()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.id is distinct from old.id
     or new.sender_id is distinct from old.sender_id
     or new.recipient_id is distinct from old.recipient_id
     or new.body is distinct from old.body
     or new.created_at is distinct from old.created_at then
    raise exception 'Only read status can be updated';
  end if;
  return new;
end;
$$;
drop trigger if exists matchma_messages_protect_fields on public.matchma_messages;
create trigger matchma_messages_protect_fields before update on public.matchma_messages
for each row execute function public.matchma_protect_message_fields();

create table if not exists public.matchma_space_visits (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null references auth.users(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  visited_at timestamptz not null default now(),
  constraint matchma_space_visits_no_self check (visitor_id <> owner_id)
);
create index if not exists matchma_space_visits_owner_idx on public.matchma_space_visits (owner_id, visited_at desc);
alter table public.matchma_space_visits enable row level security;
grant select, insert on public.matchma_space_visits to authenticated;
drop policy if exists matchma_space_visits_read_participant on public.matchma_space_visits;
create policy matchma_space_visits_read_participant on public.matchma_space_visits for select to authenticated
using ((select auth.uid()) = owner_id or (select auth.uid()) = visitor_id);
drop policy if exists matchma_space_visits_insert_public_space on public.matchma_space_visits;
create policy matchma_space_visits_insert_public_space on public.matchma_space_visits for insert to authenticated
with check (
  visitor_id = (select auth.uid())
  and owner_id <> (select auth.uid())
  and exists (select 1 from public.matchma_profiles p where p.id = owner_id and p.space_public = true)
);
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'matchma_messages') then
    execute 'alter publication supabase_realtime add table public.matchma_messages';
  end if;
end $$;
