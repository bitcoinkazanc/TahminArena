create or replace function public.update_follow_counters()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if TG_OP = 'INSERT' then
    update public.users
    set following_count =
      following_count + 1
    where id = new.follower_id;

    update public.users
    set followers_count =
      followers_count + 1
    where id = new.following_id;

    return new;
  end if;

  if TG_OP = 'DELETE' then
    update public.users
    set following_count =
      greatest(
        0,
        following_count - 1
      )
    where id = old.follower_id;

    update public.users
    set followers_count =
      greatest(
        0,
        followers_count - 1
      )
    where id = old.following_id;

    return old;
  end if;

  return null;
end;
$$;

drop trigger if exists follows_update_counters
on public.follows;

create trigger follows_update_counters
after insert or delete on public.follows
for each row
execute function public.update_follow_counters();


create or replace function public.update_reaction_counters()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if TG_OP = 'INSERT' then
    if new.type = 'like' then
      update public.predictions
      set likes_count =
        likes_count + 1
      where id = new.prediction_id;
    else
      update public.predictions
      set dislikes_count =
        dislikes_count + 1
      where id = new.prediction_id;
    end if;

    return new;
  end if;

  if TG_OP = 'UPDATE' then
    if old.type = new.type then
      return new;
    end if;

    if old.type = 'like' then
      update public.predictions
      set
        likes_count =
          greatest(
            0,
            likes_count - 1
          ),
        dislikes_count =
          dislikes_count + 1
      where id = new.prediction_id;
    else
      update public.predictions
      set
        dislikes_count =
          greatest(
            0,
            dislikes_count - 1
          ),
        likes_count =
          likes_count + 1
      where id = new.prediction_id;
    end if;

    return new;
  end if;

  if TG_OP = 'DELETE' then
    if old.type = 'like' then
      update public.predictions
      set likes_count =
        greatest(
          0,
          likes_count - 1
        )
      where id = old.prediction_id;
    else
      update public.predictions
      set dislikes_count =
        greatest(
          0,
          dislikes_count - 1
        )
      where id = old.prediction_id;
    end if;

    return old;
  end if;

  return null;
end;
$$;

drop trigger if exists reactions_update_counters
on public.reactions;

create trigger reactions_update_counters
after insert or update or delete
on public.reactions
for each row
execute function public.update_reaction_counters();


create or replace function public.update_comment_counter()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if TG_OP = 'INSERT' then
    update public.predictions
    set comments_count =
      comments_count + 1
    where id = new.prediction_id;

    return new;
  end if;

  if TG_OP = 'DELETE' then
    update public.predictions
    set comments_count =
      greatest(
        0,
        comments_count - 1
      )
    where id = old.prediction_id;

    return old;
  end if;

  return null;
end;
$$;

drop trigger if exists comments_update_counter
on public.comments;

create trigger comments_update_counter
after insert or delete
on public.comments
for each row
execute function public.update_comment_counter();


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
  );

  return new;
end;
$$;

drop trigger if exists follows_create_notification
on public.follows;

create trigger follows_create_notification
after insert on public.follows
for each row
execute function public.create_follow_notification();