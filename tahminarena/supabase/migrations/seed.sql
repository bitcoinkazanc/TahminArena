insert into public.matches (
  id,
  home_team,
  away_team,
  date_time,
  status,
  home_score,
  away_score,
  league,
  country,
  source
)
values
  (
    'seed-match-1',
    'Galatasaray',
    'Fenerbahçe',
    '2026-08-22T20:00:00+03:00',
    'Yaklaşıyor',
    null,
    null,
    'Süper Lig',
    'Türkiye',
    'seed'
  ),
  (
    'seed-match-2',
    'Beşiktaş',
    'Trabzonspor',
    '2026-08-22T20:30:00+03:00',
    'Yaklaşıyor',
    null,
    null,
    'Süper Lig',
    'Türkiye',
    'seed'
  ),
  (
    'seed-match-3',
    'Başakşehir',
    'Konyaspor',
    '2026-08-22T21:00:00+03:00',
    'Yaklaşıyor',
    null,
    null,
    'Süper Lig',
    'Türkiye',
    'seed'
  )
on conflict (id) do nothing;