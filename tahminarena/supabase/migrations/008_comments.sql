create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.users(id)
    on delete cascade,

  prediction_id uuid not null
    references public.predictions(id)
    on delete cascade,

  comment text not null
    check (
      char_length(trim(comment)) between 1 and 1000
    ),

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);

create index if not exists comments_user_id_idx
  on public.comments (user_id);

create index if not exists comments_prediction_id_idx
  on public.comments (prediction_id);

create index if not exists comments_created_at_idx
  on public.comments (created_at desc);

alter table public.comments enable row level security;

create policy "comments_authenticated_read"
on public.comments
for select
to authenticated
using (true);

create or replace function public.set_comments_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists comments_set_updated_at
on public.comments;

create trigger comments_set_updated_at
before update on public.comments
for each row
execute function public.set_comments_updated_at();