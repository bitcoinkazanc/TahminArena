create unique index if not exists notifications_follow_unique_idx
on public.notifications (
  user_id,
  actor_user_id,
  type
)
where type = 'follow';


create index if not exists notifications_user_created_at_idx
on public.notifications (
  user_id,
  created_at desc
);


create index if not exists notifications_unread_user_idx
on public.notifications (
  user_id,
  is_read,
  created_at desc
);


create or replace function public.create_follow_notification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  follower_username text;
begin
  if TG_OP <> 'INSERT' then
    return new;
  end if;

  if new.follower_id = new.following_id then
    return new;
  end if;

  select username
  into follower_username
  from public.users
  where id = new.follower_id;

  insert into public.notifications (
    user_id,
    actor_user_id,
    type,
    title,
    message,
    reference_id
  )
  values (
    new.following_id,
    new.follower_id,
    'follow',
    'Yeni takipçi',
    coalesce(
      '@' || follower_username ||
      ' seni takip etmeye başladı.',
      'Yeni bir kullanıcı seni takip etmeye başladı.'
    ),
    new.follower_id::text
  )
  on conflict do nothing;

  return new;
end;
$$;


drop trigger if exists follows_create_notification
on public.follows;

create trigger follows_create_notification
after insert on public.follows
for each row
execute function public.create_follow_notification();