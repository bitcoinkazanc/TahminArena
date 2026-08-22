create or replace function public.calculate_prediction_points(
  prediction_status text
)
returns integer
language plpgsql
immutable
as $$
begin
  if prediction_status = 'Doğru' then
    return 3;
  end if;

  if prediction_status = 'Yanlış' then
    return 0;
  end if;

  return 0;
end;
$$;


create or replace function public.refresh_user_leaderboard(
  target_user_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  daily_points integer := 0;
  weekly_points integer := 0;
  monthly_points integer := 0;
  all_points integer := 0;

  daily_predictions integer := 0;
  weekly_predictions integer := 0;
  monthly_predictions integer := 0;
  all_predictions integer := 0;

  daily_correct integer := 0;
  weekly_correct integer := 0;
  monthly_correct integer := 0;
  all_correct integer := 0;

  daily_incorrect integer := 0;
  weekly_incorrect integer := 0;
  monthly_incorrect integer := 0;
  all_incorrect integer := 0;
begin
  if target_user_id is null then
    return;
  end if;

  select
    coalesce(
      sum(
        calculate_prediction_points(
          status
        )
      ) filter (
        where created_at >= now() - interval '1 day'
      ),
      0
    ),
    count(*) filter (
      where created_at >= now() - interval '1 day'
    ),
    count(*) filter (
      where created_at >= now() - interval '1 day'
      and status = 'Doğru'
    ),
    count(*) filter (
      where created_at >= now() - interval '1 day'
      and status = 'Yanlış'
    )
  into
    daily_points,
    daily_predictions,
    daily_correct,
    daily_incorrect
  from public.predictions
  where user_id = target_user_id;


  select
    coalesce(
      sum(
        calculate_prediction_points(
          status
        )
      ) filter (
        where created_at >= now() - interval '7 days'
      ),
      0
    ),
    count(*) filter (
      where created_at >= now() - interval '7 days'
    ),
    count(*) filter (
      where created_at >= now() - interval '7 days'
      and status = 'Doğru'
    ),
    count(*) filter (
      where created_at >= now() - interval '7 days'
      and status = 'Yanlış'
    )
  into
    weekly_points,
    weekly_predictions,
    weekly_correct,
    weekly_incorrect
  from public.predictions
  where user_id = target_user_id;


  select
    coalesce(
      sum(
        calculate_prediction_points(
          status
        )
      ) filter (
        where created_at >= now() - interval '30 days'
      ),
      0
    ),
    count(*) filter (
      where created_at >= now() - interval '30 days'
    ),
    count(*) filter (
      where created_at >= now() - interval '30 days'
      and status = 'Doğru'
    ),
    count(*) filter (
      where created_at >= now() - interval '30 days'
      and status = 'Yanlış'
    )
  into
    monthly_points,
    monthly_predictions,
    monthly_correct,
    monthly_incorrect
  from public.predictions
  where user_id = target_user_id;


  select
    coalesce(
      sum(
        calculate_prediction_points(
          status
        )
      ),
      0
    ),
    count(*),
    count(*) filter (
      where status = 'Doğru'
    ),
    count(*) filter (
      where status = 'Yanlış'
    )
  into
    all_points,
    all_predictions,
    all_correct,
    all_incorrect
  from public.predictions
  where user_id = target_user_id;


  insert into public.leaderboard_scores (
    user_id,
    period,
    points,
    predictions_count,
    correct_predictions_count,
    incorrect_predictions_count,
    success_rate
  )
  values
    (
      target_user_id,
      'daily',
      daily_points,
      daily_predictions,
      daily_correct,
      daily_incorrect,
      case
        when daily_predictions = 0
          then 0
        else round(
          (
            daily_correct::numeric /
            daily_predictions::numeric
          ) * 100,
          2
        )
      end
    ),
    (
      target_user_id,
      'weekly',
      weekly_points,
      weekly_predictions,
      weekly_correct,
      weekly_incorrect,
      case
        when weekly_predictions = 0
          then 0
        else round(
          (
            weekly_correct::numeric /
            weekly_predictions::numeric
          ) * 100,
          2
        )
      end
    ),
    (
      target_user_id,
      'monthly',
      monthly_points,
      monthly_predictions,
      monthly_correct,
      monthly_incorrect,
      case
        when monthly_predictions = 0
          then 0
        else round(
          (
            monthly_correct::numeric /
            monthly_predictions::numeric
          ) * 100,
          2
        )
      end
    ),
    (
      target_user_id,
      'all',
      all_points,
      all_predictions,
      all_correct,
      all_incorrect,
      case
        when all_predictions = 0
          then 0
        else round(
          (
            all_correct::numeric /
            all_predictions::numeric
          ) * 100,
          2
        )
      end
    )
  on conflict (
    user_id,
    period
  )
  do update set
    points =
      excluded.points,
    predictions_count =
      excluded.predictions_count,
    correct_predictions_count =
      excluded.correct_predictions_count,
    incorrect_predictions_count =
      excluded.incorrect_predictions_count,
    success_rate =
      excluded.success_rate,
    updated_at =
      now();
end;
$$;


create or replace function public.refresh_all_leaderboards()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  user_record record;
begin
  for user_record in
    select id
    from public.users
  loop
    perform public.refresh_user_leaderboard(
      user_record.id
    );
  end loop;
end;
$$;