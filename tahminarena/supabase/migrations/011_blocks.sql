create table if not exists public.blocks (
  id uuid primary key default gen_random_uuid(),

  blocker_id uuid not null
    references public.users(id)
    on delete cascade,

  blocked_id uuid not null
    references public.users(id)
    on delete cascade,

  created_at timestamptz not null default now(),

  unique (blocker_id, blocked_id),

  check (
    blocker_id <> blocked_id
  )
);

create index if not exists blocks_blocker_id_idx
  on public.blocks (blocker_id);

create index if not exists blocks_blocked_id_idx
  on public.blocks (blocked_id);

alter table public.blocks enable row level security;

create policy "blocks_authenticated_read"
on public.blocks
for select
to authenticated
using (
  true
);