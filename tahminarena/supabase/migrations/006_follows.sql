create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),

  follower_id uuid not null
    references public.users(id)
    on delete cascade,

  following_id uuid not null
    references public.users(id)
    on delete cascade,

  created_at timestamptz not null default now(),

  unique (follower_id, following_id),

  check (
    follower_id <> following_id
  )
);

create index if not exists follows_follower_id_idx
  on public.follows (follower_id);

create index if not exists follows_following_id_idx
  on public.follows (following_id);

create index if not exists follows_created_at_idx
  on public.follows (created_at desc);

alter table public.follows enable row level security;

create policy "follows_authenticated_read"
on public.follows
for select
to authenticated
using (true);