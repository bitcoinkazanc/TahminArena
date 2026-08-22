create table if not exists public.predictions (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.users(id)
    on delete cascade,

  match_id text not null
    references public.matches(id)
    on delete cascade,

  option text not null
    check (
      option in ('1', 'X', '2')
    ),

  status text not null default 'Bekliyor'
    check (
      status in (
        'Bekliyor',
        'Doğru',
        'Yanlış',
        'İptal'
      )
    ),

  likes_count integer not null default 0
    check (likes_count >= 0),

  dislikes_count integer not null default 0
    check (dislikes_count >= 0),

  comments_count integer not null default 0
    check (comments_count >= 0),

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  unique (user_id, match_id)
);

create index if not exists predictions_user_id_idx
  on public.predictions (user_id);

create index if not exists predictions_match_id_idx
  on public.predictions (match_id);

create index if not exists predictions_status_idx
  on public.predictions (status);

create index if not exists predictions_created_at_idx
  on public.predictions (created_at desc);

alter table public.predictions enable row level security;

create policy "predictions_public_read"
on public.predictions
for select
to anon, authenticated
using (true);

create or replace function public.set_predictions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists predictions_set_updated_at
on public.predictions;

create trigger predictions_set_updated_at
before update on public.predictions
for each row
execute function public.set_predictions_updated_at();