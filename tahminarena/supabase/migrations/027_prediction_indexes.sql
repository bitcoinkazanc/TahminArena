create index if not exists predictions_match_status_idx
on public.predictions (
  match_id,
  status
);

create index if not exists predictions_user_status_idx
on public.predictions (
  user_id,
  status
);

create index if not exists predictions_created_at_idx
on public.predictions (
  created_at desc
);

create index if not exists predictions_option_idx
on public.predictions (
  option
);

create index if not exists predictions_match_created_idx
on public.predictions (
  match_id,
  created_at desc
);