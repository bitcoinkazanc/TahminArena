create index if not exists follows_follower_created_idx
on public.follows (
  follower_id,
  created_at desc
);

create index if not exists follows_following_created_idx
on public.follows (
  following_id,
  created_at desc
);

create index if not exists blocks_blocker_created_idx
on public.blocks (
  blocker_id,
  created_at desc
);

create index if not exists blocks_blocked_created_idx
on public.blocks (
  blocked_id,
  created_at desc
);