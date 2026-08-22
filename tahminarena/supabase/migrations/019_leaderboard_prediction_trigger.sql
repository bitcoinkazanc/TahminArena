create or replace function public.refresh_prediction_user_leaderboard()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.refresh_user_leaderboard(
    new.user_id
  );

  return new;
end;
$$;


drop trigger if exists predictions_refresh_leaderboard
on public.predictions;

create trigger predictions_refresh_leaderboard
after insert or update of status or delete
on public.predictions
for each row
execute function public.refresh_prediction_user_leaderboard();