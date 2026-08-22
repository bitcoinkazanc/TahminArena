create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),

  telegram_id text not null unique,

  username text not null unique,

  display_name text not null,

  avatar_url text,

  bio text,

  privacy text not null default 'Açık'
    check (privacy in ('Açık', 'Gizli')),

  followers_count integer not null default 0
    check (followers_count >= 0),

  following_count integer not null default 0
    check (following_count >= 0),

  predictions_count integer not null default 0
    check (predictions_count >= 0),

  correct_predictions_count integer not null default 0
    check (correct_predictions_count >= 0),

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);

create index if not exists users_username_idx
  on public.users (username);

create index if not exists users_telegram_id_idx
  on public.users (telegram_id);

create index if not exists users_privacy_idx
  on public.users (privacy);

alter table public.users enable row level security;

create or replace function public.set_users_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at
on public.users;

create trigger users_set_updated_at
before update on public.users
for each row
execute function public.set_users_updated_at();