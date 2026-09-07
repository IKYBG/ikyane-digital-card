do $migration$
begin
  create table if not exists public.qard_slug_aliases (
    slug text primary key check (slug ~ '^[a-z0-9][a-z0-9_-]{2,29}$'),
    profile_id uuid not null references public.qard_profiles(id) on delete cascade,
    created_at timestamptz not null default now()
  );

  create index if not exists qard_slug_aliases_profile_id_idx
    on public.qard_slug_aliases(profile_id);

  alter table public.qard_slug_aliases enable row level security;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'qard_slug_aliases'
      and policyname = 'Published Qard aliases are public'
  ) then
    create policy "Published Qard aliases are public"
      on public.qard_slug_aliases for select
      to anon, authenticated
      using (
        exists (
          select 1
          from public.qard_profiles
          where qard_profiles.id = qard_slug_aliases.profile_id
            and (qard_profiles.published or qard_profiles.user_id = (select auth.uid()))
        )
      );
  end if;

  grant select on public.qard_slug_aliases to anon, authenticated;

  insert into public.qard_slug_aliases (slug, profile_id)
  select 'ikyane-mha-979e52', id
  from public.qard_profiles
  where slug = 'ikyane'
  on conflict (slug) do nothing;
end
$migration$;
