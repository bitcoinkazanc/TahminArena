create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.users(id)
    on delete cascade,

  name text,

  status text not null default 'Bekliyor'
    check (
      status in (
        'Bekliyor',
        'Kazandı',
        'Kaybetti',
        'İptal'
      )
    ),

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);

create table if not exists public.coupon_selections (
  id uuid primary key default gen_random_uuid(),

  coupon_id uuid not null
    references public.coupons(id)
    on delete cascade,

  match_id text not null
    references public.matches(id)
    on delete cascade,

  option text not null
    check (
      option in ('1', 'X', '2')
    ),

  created_at timestamptz not null default now(),

  unique (coupon_id, match_id)
);

create index if not exists coupons_user_id_idx
  on public.coupons (user_id);

create index if not exists coupons_status_idx
  on public.coupons (status);

create index if not exists coupons_created_at_idx
  on public.coupons (created_at desc);

create index if not exists coupon_selections_coupon_id_idx
  on public.coupon_selections (coupon_id);

create index if not exists coupon_selections_match_id_idx
  on public.coupon_selections (match_id);

alter table public.coupons enable row level security;

alter table public.coupon_selections enable row level security;

create policy "coupons_public_read"
on public.coupons
for select
to authenticated
using (
  true
);

create policy "coupon_selections_public_read"
on public.coupon_selections
for select
to authenticated
using (
  true
);

create or replace function public.set_coupons_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists coupons_set_updated_at
on public.coupons;

create trigger coupons_set_updated_at
before update on public.coupons
for each row
execute function public.set_coupons_updated_at();