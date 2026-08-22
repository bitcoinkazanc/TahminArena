create or replace function public.resolve_prediction_status(
  prediction_option text,
  home_score_value integer,
  away_score_value integer
)
returns text
language plpgsql
immutable
as $$
declare
  result_option text;
begin
  if
    home_score_value is null
    or away_score_value is null
  then
    return 'Bekliyor';
  end if;

  if home_score_value > away_score_value then
    result_option := '1';
  elsif home_score_value = away_score_value then
    result_option := 'X';
  else
    result_option := '2';
  end if;

  if prediction_option = result_option then
    return 'Doğru';
  end if;

  return 'Yanlış';
end;
$$;


create or replace function public.resolve_match_predictions()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if
    new.status = 'Bitti'
    and new.home_score is not null
    and new.away_score is not null
    and (
      old.status is distinct from new.status
      or old.home_score is distinct from new.home_score
      or old.away_score is distinct from new.away_score
    )
  then
    update public.predictions
    set
      status = public.resolve_prediction_status(
        predictions.option,
        new.home_score,
        new.away_score
      ),
      updated_at = now()
    where match_id = new.id
      and status = 'Bekliyor';
  end if;

  return new;
end;
$$;


drop trigger if exists matches_resolve_predictions
on public.matches;

create trigger matches_resolve_predictions
after update of status, home_score, away_score
on public.matches
for each row
execute function public.resolve_match_predictions();