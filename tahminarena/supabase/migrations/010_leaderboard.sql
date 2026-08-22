create table if not exists public.leaderboard_scores (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.users(id)
    on delete cascade,

  period text not null
    check (
      period in (
        'daily',
        'weekly',
        'monthly',
        'all'
      )
    ),

  points integer not null default 0
    check (points >= 0),

  predictions_count integer not null default 0
    check (predictions_count >= 0),

  correct_predictions_count integer not null default 0
    check (correct_predictions_count >= 0),

  incorrect_predictions_count integer not null default 0
    check (incorrect_predictions_count >= 0),

  success_rate numeric(5,2) not null default 0
    check (
      success_rate >= 0
      and success_rate <= 100
    ),

  updated_at timestamptz not null default now(),

  unique (user_id, period)
);

create index if not exists leaderboard_scores_period_points_idx
  on public.leaderboard_scores (
    period,
    points desc
  );

create index if not exists leaderboard_scores_user_id_idx
  on public.leaderboard_scores (user_id);

alter table public.leaderboard_scores enable row level security;

create policy "leaderboard_scores_public_read"
on public.leaderboard_scores
for select
to anon, authenticated
using (true);

create or replace function public.set_leaderboard_scores_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leaderboard_scores_set_updated_at
on public.leaderboard_scores;

create trigger leaderboard_scores_set_updated_at
before update on public.leaderboard_scores
for each row
execute function public.set_leaderboard_scores_updated_at();