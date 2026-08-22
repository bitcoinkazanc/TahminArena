update public.users u
set
  followers_count = (
    select count(*)
    from public.follows f
    where f.following_id = u.id
  ),
  following_count = (
    select count(*)
    from public.follows f
    where f.follower_id = u.id
  ),
  predictions_count = (
    select count(*)
    from public.predictions p
    where p.user_id = u.id
  ),
  correct_predictions_count = (
    select count(*)
    from public.predictions p
    where p.user_id = u.id
      and p.status = 'Doğru'
  );


update public.predictions p
set
  likes_count = (
    select count(*)
    from public.reactions r
    where r.prediction_id = p.id
      and r.type = 'like'
  ),
  dislikes_count = (
    select count(*)
    from public.reactions r
    where r.prediction_id = p.id
      and r.type = 'dislike'
  ),
  comments_count = (
    select count(*)
    from public.comments c
    where c.prediction_id = p.id
  );


update public.leaderboard_scores ls
set
  points = coalesce(
    (
      select sum(
        public.calculate_prediction_points(
          p.status
        )
      )
      from public.predictions p
      where p.user_id = ls.user_id
        and (
          ls.period = 'all'
          or (
            ls.period = 'daily'
            and p.created_at >= now() - interval '1 day'
          )
          or (
            ls.period = 'weekly'
            and p.created_at >= now() - interval '7 days'
          )
          or (
            ls.period = 'monthly'
            and p.created_at >= now() - interval '30 days'
          )
        )
    ),
    0
  ),
  predictions_count = coalesce(
    (
      select count(*)
      from public.predictions p
      where p.user_id = ls.user_id
        and (
          ls.period = 'all'
          or (
            ls.period = 'daily'
            and p.created_at >= now() - interval '1 day'
          )
          or (
            ls.period = 'weekly'
            and p.created_at >= now() - interval '7 days'
          )
          or (
            ls.period = 'monthly'
            and p.created_at >= now() - interval '30 days'
          )
        )
    ),
    0
  ),
  correct_predictions_count = coalesce(
    (
      select count(*)
      from public.predictions p
      where p.user_id = ls.user_id
        and p.status = 'Doğru'
        and (
          ls.period = 'all'
          or (
            ls.period = 'daily'
            and p.created_at >= now() - interval '1 day'
          )
          or (
            ls.period = 'weekly'
            and p.created_at >= now() - interval '7 days'
          )
          or (
            ls.period = 'monthly'
            and p.created_at >= now() - interval '30 days'
          )
        )
    ),
    0
  ),
  incorrect_predictions_count = coalesce(
    (
      select count(*)
      from public.predictions p
      where p.user_id = ls.user_id
        and p.status = 'Yanlış'
        and (
          ls.period = 'all'
          or (
            ls.period = 'daily'
            and p.created_at >= now() - interval '1 day'
          )
          or (
            ls.period = 'weekly'
            and p.created_at >= now() - interval '7 days'
          )
          or (
            ls.period = 'monthly'
            and p.created_at >= now() - interval '30 days'
          )
        )
    ),
    0
  ),
  updated_at = now();


update public.leaderboard_scores
set success_rate =
  case
    when predictions_count = 0
      then 0
    else round(
      (
        correct_predictions_count::numeric /
        predictions_count::numeric
      ) * 100,
      2
    )
  end;