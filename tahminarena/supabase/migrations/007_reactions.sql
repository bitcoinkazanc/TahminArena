create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.users(id)
    on delete cascade,

  prediction_id uuid not null
    references public.predictions(id)
    on delete cascade,

  type text not null
    check (
      type in ('like', 'dislike')
    ),

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  unique (user_id, prediction_id)
);

create index if not exists reactions_user_id_idx
  on public.reactions (user_id);

create index if not exists reactions_prediction_id_idx
  on public.reactions (prediction_id);

create index if not exists reactions_type_idx
  on public.reactions (type);

alter table public.reactions enable row level security;

create policy "reactions_authenticated_read"
on public.reactions
for select
to authenticated
using (true);

create or replace function public.set_reactions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reactions_set_updated_at
on public.reactions;

create trigger reactions_set_updated_at
before update on public.reactions
for each row
execute function public.set_reactions_updated_at();