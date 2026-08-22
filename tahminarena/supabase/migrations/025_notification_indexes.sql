create index if not exists notifications_user_read_created_idx
on public.notifications (
  user_id,
  is_read,
  created_at desc
);

create index if not exists notifications_actor_idx
on public.notifications (
  actor_user_id,
  created_at desc
);

create index if not exists notifications_type_created_idx
on public.notifications (
  type,
  created_at desc
);