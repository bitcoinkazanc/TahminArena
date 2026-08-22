create index if not exists comments_user_created_idx
on public.comments (
  user_id,
  created_at desc
);

create index if not exists comments_created_at_idx
on public.comments (
  created_at desc
);

create index if not exists chat_messages_user_created_idx
on public.chat_messages (
  user_id,
  created_at desc
);

create index if not exists chat_messages_created_at_idx
on public.chat_messages (
  created_at desc
);

create index if not exists chat_messages_match_created_idx
on public.chat_messages (
  match_id,
  created_at desc
);