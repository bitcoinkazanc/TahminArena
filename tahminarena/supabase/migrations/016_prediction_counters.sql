create or replace function public.update_user_prediction_counters()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if TG_OP = 'INSERT' then
    update public.users
    set predictions_count =
      predictions_count + 1
    where id = new.user_id;

    if new.status = 'Doğru' then
      update public.users
      set correct_predictions_count =
        correct_predictions_count + 1
      where id = new.user_id;
    end if;

    return new;
  end if;

  if TG_OP = 'UPDATE' then
    if old.status is distinct from new.status then

      if old.status = 'Doğru' then
        update public.users
        set correct_predictions_count =
          greatest(
            0,
            correct_predictions_count - 1
          )
        where id = new.user_id;
      end if;

      if new.status = 'Doğru' then
        update public.users
        set correct_predictions_count =
          correct_predictions_count + 1
        where id = new.user_id;
      end if;

    end if;

    return new;
  end if;

  if TG_OP = 'DELETE' then
    update public.users
    set predictions_count =
      greatest(
        0,
        predictions_count - 1
      )
    where id = old.user_id;

    if old.status = 'Doğru' then
      update public.users
      set correct_predictions_count =
        greatest(
          0,
          correct_predictions_count - 1
        )
      where id = old.user_id;
    end if;

    return old;
  end if;

  return null;
end;
$$;


drop trigger if exists predictions_update_user_counters
on public.predictions;

create trigger predictions_update_user_counters
after insert or update or delete
on public.predictions
for each row
execute function public.update_user_prediction_counters();