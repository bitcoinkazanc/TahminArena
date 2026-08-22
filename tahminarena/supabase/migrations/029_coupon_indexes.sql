create index if not exists coupons_user_created_idx
on public.coupons (
  user_id,
  created_at desc
);

create index if not exists coupons_status_created_idx
on public.coupons (
  status,
  created_at desc
);

create index if not exists coupon_selections_coupon_idx
on public.coupon_selections (
  coupon_id
);

create index if not exists coupon_selections_match_idx
on public.coupon_selections (
  match_id
);

create index if not exists coupon_selections_created_idx
on public.coupon_selections (
  created_at desc
);