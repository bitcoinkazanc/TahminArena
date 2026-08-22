create or replace function public.remove_follow_relationship_on_block()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.follows
  where (
    follower_id = new.blocker_id
    and following_id = new.blocked_id
  )
  or (
    follower_id = new.blocked_id
    and following_id = new.blocker_id
  );

  return new;
end;
$$;


drop trigger if exists blocks_remove_follow_relationship
on public.blocks;

create trigger blocks_remove_follow_relationship
after insert on public.blocks
for each row
execute function public.remove_follow_relationship_on_block();


create index if not exists blocks_relationship_lookup_idx
on public.blocks (
  blocker_id,
  blocked_id
);


create index if not exists blocks_reverse_lookup_idx
on public.blocks (
  blocked_id,
  blocker_id
);