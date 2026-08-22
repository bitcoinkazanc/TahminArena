create index if not exists matches_date_time_idx
on public.matches (
  date_time
);

create index if not exists matches_status_date_time_idx
on public.matches (
  status,
  date_time
);

create index if not exists matches_league_date_time_idx
on public.matches (
  league,
  date_time
);

create index if not exists matches_source_id_idx
on public.matches (
  source,
  id
);