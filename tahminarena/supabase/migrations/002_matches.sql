create table if not exists public.matches (
  id text primary key,

  home_team text not null,

  away_team text not null,

  date_time timestamptz not null,

  status text not null default 'Yaklaşıyor'
    check (
      status in (
        'Yaklaşıyor',
        'Canlı',
        'Bitti'
      )
    ),

  home_score integer
    check (
      home_score is null
      or home_score >= 0
    ),

  away_score integer
    check (
      away_score is null
      or away_score >= 0
    ),

  league text,

  country text,

  source text not null default 'mackolik',

  source_updated_at timestamptz,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);

create index if not exists matches_date_time_idx
  on public.matches (date_time);

create index if not exists matches_status_idx
  on public.matches (status);

create index if not exists matches_league_idx
  on public.matches (league);

create index if not exists matches_source_idx
  on public.matches (source);

alter table public.matches enable row level security;

create policy "matches_public_read"
on public.matches
for select
to anon, authenticated
using (true);

create or replace function public.set_matches_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists matches_set_updated_at
on public.matches;

create trigger matches_set_updated_at
before update on public.matches
for each row
execute function public.set_matches_updated_at();