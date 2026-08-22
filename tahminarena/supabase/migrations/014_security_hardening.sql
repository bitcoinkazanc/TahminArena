alter table public.users
enable row level security;

alter table public.follows
enable row level security;

alter table public.reactions
enable row level security;

alter table public.comments
enable row level security;

alter table public.notifications
enable row level security;

alter table public.blocks
enable row level security;

alter table public.reports
enable row level security;


drop policy if exists "follows_authenticated_read"
on public.follows;

create policy "follows_public_read"
on public.follows
for select
to anon, authenticated
using (true);


drop policy if exists "reactions_authenticated_read"
on public.reactions;

create policy "reactions_public_read"
on public.reactions
for select
to anon, authenticated
using (true);


drop policy if exists "comments_authenticated_read"
on public.comments;

create policy "comments_public_read"
on public.comments
for select
to anon, authenticated
using (true);


drop policy if exists "notifications_authenticated_read"
on public.notifications;

create policy "notifications_owner_read"
on public.notifications
for select
to authenticated
using (
  user_id = auth.uid()
);


drop policy if exists "blocks_authenticated_read"
on public.blocks;

create policy "blocks_owner_read"
on public.blocks
for select
to authenticated
using (
  blocker_id = auth.uid()
  or blocked_id = auth.uid()
);


drop policy if exists "reports_authenticated_read"
on public.reports;

create policy "reports_owner_read"
on public.reports
for select
to authenticated
using (
  reporter_id = auth.uid()
);


drop policy if exists "leaderboard_scores_public_read"
on public.leaderboard_scores;

create policy "leaderboard_scores_public_read"
on public.leaderboard_scores
for select
to anon, authenticated
using (true);


create or replace function public.prevent_user_counter_negative()
returns trigger
language plpgsql
as $$
begin
  new.followers_count =
    greatest(
      0,
      coalesce(
        new.followers_count,
        0
      )
    );

  new.following_count =
    greatest(
      0,
      coalesce(
        new.following_count,
        0
      )
    );

  new.predictions_count =
    greatest(
      0,
      coalesce(
        new.predictions_count,
        0
      )
    );

  new.correct_predictions_count =
    greatest(
      0,
      coalesce(
        new.correct_predictions_count,
        0
      )
    );

  return new;
end;
$$;


drop trigger if exists users_prevent_negative_counters
on public.users;

create trigger users_prevent_negative_counters
before insert or update
on public.users
for each row
execute function public.prevent_user_counter_negative();


create or replace function public.prevent_prediction_counter_negative()
returns trigger
language plpgsql
as $$
begin
  new.likes_count =
    greatest(
      0,
      coalesce(
        new.likes_count,
        0
      )
    );

  new.dislikes_count =
    greatest(
      0,
      coalesce(
        new.dislikes_count,
        0
      )
    );

  new.comments_count =
    greatest(
      0,
      coalesce(
        new.comments_count,
        0
      )
    );

  return new;
end;
$$;


drop trigger if exists predictions_prevent_negative_counters
on public.predictions;

create trigger predictions_prevent_negative_counters
before insert or update
on public.predictions
for each row
execute function public.prevent_prediction_counter_negative();