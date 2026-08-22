create or replace function public.set_generic_updated_at()
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
execute function public.set_generic_updated_at();


drop trigger if exists chat_messages_set_updated_at
on public.chat_messages;

create trigger chat_messages_set_updated_at
before update on public.chat_messages
for each row
execute function public.set_generic_updated_at();


drop trigger if exists reactions_set_updated_at
on public.reactions;

create trigger reactions_set_updated_at
before update on public.reactions
for each row
execute function public.set_generic_updated_at();


drop trigger if exists comments_set_updated_at
on public.comments;

create trigger comments_set_updated_at
before update on public.comments
for each row
execute function public.set_generic_updated_at();


drop trigger if exists reports_set_updated_at
on public.reports;

create trigger reports_set_updated_at
before update on public.reports
for each row
execute function public.set_generic_updated_at();