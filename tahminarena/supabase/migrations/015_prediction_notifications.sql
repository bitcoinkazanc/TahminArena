create or replace function public.create_prediction_reaction_notification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_username text;
  prediction_owner_id uuid;
begin
  select
    p.user_id
  into
    prediction_owner_id
  from public.predictions p
  where p.id = new.prediction_id;

  if prediction_owner_id is null
     or prediction_owner_id = new.user_id then
    return new;
  end if;

  select username
  into actor_username
  from public.users
  where id = new.user_id;

  insert into public.notifications (
    user_id,
    actor_user_id,
    type,
    title,
    message,
    reference_id
  )
  values (
    prediction_owner_id,
    new.user_id,
    new.type,
    case
      when new.type = 'like'
        then 'Tahminin beğenildi'
      else
        'Tahminin beğenilmedi'
    end,
    case
      when new.type = 'like'
        then coalesce(
          '@' || actor_username ||
          ' tahminini beğendi.',
          'Bir kullanıcı tahminini beğendi.'
        )
      else
        coalesce(
          '@' || actor_username ||
          ' tahminini beğenmedi.',
          'Bir kullanıcı tahminini beğenmedi.'
        )
    end,
    new.prediction_id::text
  );

  return new;
end;
$$;


drop trigger if exists reactions_create_notification
on public.reactions;

create trigger reactions_create_notification
after insert on public.reactions
for each row
execute function public.create_prediction_reaction_notification();


create or replace function public.create_comment_notification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_username text;
  prediction_owner_id uuid;
begin
  select
    p.user_id
  into
    prediction_owner_id
  from public.predictions p
  where p.id = new.prediction_id;

  if prediction_owner_id is null
     or prediction_owner_id = new.user_id then
    return new;
  end if;

  select username
  into actor_username
  from public.users
  where id = new.user_id;

  insert into public.notifications (
    user_id,
    actor_user_id,
    type,
    title,
    message,
    reference_id
  )
  values (
    prediction_owner_id,
    new.user_id,
    'comment',
    'Yeni yorum',
    coalesce(
      '@' || actor_username ||
      ' tahminine yorum yaptı.',
      'Bir kullanıcı tahminine yorum yaptı.'
    ),
    new.prediction_id::text
  );

  return new;
end;
$$;


drop trigger if exists comments_create_notification
on public.comments;

create trigger comments_create_notification
after insert on public.comments
for each row
execute function public.create_comment_notification();


create or replace function public.update_prediction_result()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status is distinct from new.status
     and new.status in (
       'Doğru',
       'Yanlış',
       'İptal'
     ) then

    insert into public.notifications (
      user_id,
      actor_user_id,
      type,
      title,
      message,
      reference_id
    )
    values (
      new.user_id,
      null,
      'prediction_result',
      'Tahmin sonucu',
      case
        when new.status = 'Doğru'
          then 'Tahminin doğru sonuçlandı.'
        when new.status = 'Yanlış'
          then 'Tahminin yanlış sonuçlandı.'
        else
          'Tahminin iptal edildi.'
      end,
      new.id::text
    );
  end if;

  return new;
end;
$$;


drop trigger if exists predictions_create_result_notification
on public.predictions;

create trigger predictions_create_result_notification
after update of status
on public.predictions
for each row
execute function public.update_prediction_result();