create index if not exists predictions_user_match_idx
on public.predictions (
  user_id,
  match_id
);

create index if not exists comments_prediction_created_idx
on public.comments (
  prediction_id,
  created_at desc
);

create index if not exists chat_messages_match_created_idx
on public.chat_messages (
  match_id,
  created_at desc
);

create index if not exists reactions_prediction_type_idx
on public.reactions (
  prediction_id,
  type
);

create index if not exists follows_user_relationship_idx
on public.follows (
  follower_id,
  following_id
);

create index if not exists follows_reverse_relationship_idx
on public.follows (
  following_id,
  follower_id
);

create index if not exists notifications_reference_idx
on public.notifications (
  reference_id
);

create index if not exists reports_target_status_idx
on public.reports (
  target_type,
  target_id,
  status
);