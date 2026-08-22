create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.users(id)
    on delete cascade,

  actor_user_id uuid
    references public.users(id)
    on delete set null,

  type text not null
    check (
      type in (
        'follow',
        'like',
        'dislike',
        'comment',
        'prediction_result',
        'system'
      )
    ),

  title text not null
    check (
      char_length(trim(title)) between 1 and 200
    ),

  message text not null
    check (
      char_length(trim(message)) between 1 and 1000
    ),

  reference_id text,

  is_read boolean not null default false,

  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_idx
  on public.notifications (user_id);

create index if not exists notifications_actor_user_id_idx
  on public.notifications (actor_user_id);

create index if not exists notifications_is_read_idx
  on public.notifications (user_id, is_read);

create index if not exists notifications_created_at_idx
  on public.notifications (created_at desc);

alter table public.notifications enable row level security;

create policy "notifications_authenticated_read"
on public.notifications
for select
to authenticated
using (true);