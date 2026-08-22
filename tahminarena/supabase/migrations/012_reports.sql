create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),

  reporter_id uuid not null
    references public.users(id)
    on delete cascade,

  target_type text not null
    check (
      target_type in (
        'user',
        'prediction',
        'comment',
        'chat_message'
      )
    ),

  target_id text not null,

  reason text not null
    check (
      char_length(trim(reason)) between 1 and 500
    ),

  status text not null default 'pending'
    check (
      status in (
        'pending',
        'reviewing',
        'resolved',
        'rejected'
      )
    ),

  admin_note text,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);

create index if not exists reports_reporter_id_idx
  on public.reports (reporter_id);

create index if not exists reports_target_idx
  on public.reports (
    target_type,
    target_id
  );

create index if not exists reports_status_idx
  on public.reports (status);

create index if not exists reports_created_at_idx
  on public.reports (created_at desc);

alter table public.reports enable row level security;

create policy "reports_authenticated_read"
on public.reports
for select
to authenticated
using (
  reporter_id = auth.uid()
);

create or replace function public.set_reports_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reports_set_updated_at
on public.reports;

create trigger reports_set_updated_at
before update on public.reports
for each row
execute function public.set_reports_updated_at();