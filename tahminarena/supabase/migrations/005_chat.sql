create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.users(id)
    on delete cascade,

  match_id text
    references public.matches(id)
    on delete cascade,

  message text not null
    check (
      char_length(trim(message)) between 1 and 1000
    ),

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);

create index if not exists chat_messages_user_id_idx
  on public.chat_messages (user_id);

create index if not exists chat_messages_match_id_idx
  on public.chat_messages (match_id);

create index if not exists chat_messages_created_at_idx
  on public.chat_messages (created_at desc);

alter table public.chat_messages enable row level security;

create policy "chat_messages_authenticated_read"
on public.chat_messages
for select
to authenticated
using (true);

create or replace function public.set_chat_messages_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists chat_messages_set_updated_at
on public.chat_messages;

create trigger chat_messages_set_updated_at
before update on public.chat_messages
for each row
execute function public.set_chat_messages_updated_at();