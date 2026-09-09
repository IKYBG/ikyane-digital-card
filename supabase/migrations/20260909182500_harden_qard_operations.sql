begin;

create index if not exists qard_analytics_events_social_link_id_idx
  on public.qard_analytics_events (social_link_id)
  where social_link_id is not null;

create index if not exists qard_analytics_events_created_at_idx
  on public.qard_analytics_events (created_at);

alter table public.qard_profiles
  add constraint qard_profiles_optional_text_lengths check (
    char_length(coalesce(first_name, '')) <= 60 and
    char_length(coalesce(last_name, '')) <= 60 and
    char_length(coalesce(headline, '')) <= 120 and
    char_length(coalesce(bio, '')) <= 420 and
    char_length(coalesce(company, '')) <= 100 and
    char_length(coalesce(job_title, '')) <= 100 and
    char_length(coalesce(location, '')) <= 100 and
    char_length(coalesce(email_public, '')) <= 254 and
    char_length(coalesce(phone_public, '')) <= 30 and
    char_length(coalesce(website, '')) <= 500
  ) not valid;

alter table public.qard_profiles
  add constraint qard_profiles_website_protocol check (
    website is null or website = '' or website ~* '^https?://'
  ) not valid;

alter table public.qard_social_links
  add constraint qard_social_links_lengths check (
    char_length(coalesce(label, '')) <= 40 and
    char_length(url) <= 500 and
    char_length(coalesce(username, '')) <= 80
  ) not valid;

alter table public.qard_social_links
  add constraint qard_social_links_safe_protocol check (
    url ~* '^(https?://|mailto:|tel:)'
  ) not valid;

alter table public.qard_appearance
  add constraint qard_appearance_colors check (
    accent_color ~ '^#[0-9A-Fa-f]{6}$' and text_color ~ '^#[0-9A-Fa-f]{6}$'
  ) not valid;

alter table public.qard_appearance
  add constraint qard_appearance_background_length check (char_length(background_value) <= 800) not valid;

create table if not exists public.qard_analytics_rate_limits (
  key_hash text not null,
  bucket timestamptz not null,
  request_count integer not null default 1 check (request_count > 0),
  primary key (key_hash, bucket)
);

create index if not exists qard_analytics_rate_limits_bucket_idx
  on public.qard_analytics_rate_limits (bucket);

alter table public.qard_analytics_rate_limits enable row level security;
revoke all on public.qard_analytics_rate_limits from public, anon, authenticated;

create or replace function public.qard_change_slug(p_user_id uuid, p_new_slug text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_slug text;
  target_profile_id uuid;
begin
  if p_new_slug !~ '^[a-z0-9][a-z0-9_-]{2,29}$' then
    raise exception 'invalid_slug';
  end if;

  select id, slug into target_profile_id, current_slug
  from public.qard_profiles
  where user_id = p_user_id
  for update;

  if target_profile_id is null then raise exception 'profile_not_found'; end if;
  if current_slug = p_new_slug then return current_slug; end if;
  if exists (select 1 from public.qard_profiles where slug = p_new_slug and id <> target_profile_id)
    or exists (select 1 from public.qard_slug_aliases where slug = p_new_slug and profile_id <> target_profile_id) then
    raise exception 'slug_unavailable';
  end if;

  delete from public.qard_slug_aliases where slug = p_new_slug and profile_id = target_profile_id;
  update public.qard_profiles set slug = p_new_slug where id = target_profile_id;
  insert into public.qard_slug_aliases (slug, profile_id)
  values (current_slug, target_profile_id)
  on conflict (slug) do update set profile_id = excluded.profile_id;
  return current_slug;
end;
$$;

revoke all on function public.qard_change_slug(uuid, text) from public, anon, authenticated;
grant execute on function public.qard_change_slug(uuid, text) to service_role;

create or replace function public.qard_record_analytics(
  p_key_hash text,
  p_slug text,
  p_event_type public.analytics_event_type,
  p_social_link_id uuid default null,
  p_referrer text default null,
  p_device_type text default null,
  p_browser text default null,
  p_country text default null
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  minute_bucket timestamptz := date_trunc('minute', now());
  requests integer;
  target_profile_id uuid;
begin
  insert into public.qard_analytics_rate_limits (key_hash, bucket, request_count)
  values (p_key_hash, minute_bucket, 1)
  on conflict (key_hash, bucket)
  do update set request_count = public.qard_analytics_rate_limits.request_count + 1
  returning request_count into requests;

  if requests > 60 then return false; end if;

  select id into target_profile_id
  from public.qard_profiles
  where slug = p_slug and published = true;
  if target_profile_id is null then return null; end if;

  if p_social_link_id is not null and not exists (
    select 1 from public.qard_social_links
    where id = p_social_link_id and profile_id = target_profile_id and enabled = true
  ) then return null; end if;

  insert into public.qard_analytics_events (
    profile_id, social_link_id, event_type, referrer, device_type, browser, country
  ) values (
    target_profile_id, p_social_link_id, p_event_type,
    left(p_referrer, 500), left(p_device_type, 30), left(p_browser, 40), left(p_country, 8)
  );

  delete from public.qard_analytics_rate_limits where bucket < now() - interval '10 minutes';
  return true;
end;
$$;

revoke all on function public.qard_record_analytics(text, text, public.analytics_event_type, uuid, text, text, text, text) from public, anon, authenticated;
grant execute on function public.qard_record_analytics(text, text, public.analytics_event_type, uuid, text, text, text, text) to service_role;

create or replace function public.qard_delete_expired_analytics()
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare deleted_count bigint;
begin
  delete from public.qard_analytics_events where created_at < now() - interval '13 months';
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on function public.qard_delete_expired_analytics() from public, anon, authenticated;
grant execute on function public.qard_delete_expired_analytics() to service_role;

create or replace function public.qard_analytics_rollup(p_profile_id uuid, p_since timestamptz)
returns table (
  event_day date,
  event_type public.analytics_event_type,
  social_link_id uuid,
  event_count bigint
)
language sql
security invoker
set search_path = ''
stable
as $$
  select created_at::date, event_type, social_link_id, count(*)
  from public.qard_analytics_events
  where profile_id = p_profile_id and created_at >= p_since
  group by created_at::date, event_type, social_link_id
  order by created_at::date;
$$;

revoke all on function public.qard_analytics_rollup(uuid, timestamptz) from public, anon;
grant execute on function public.qard_analytics_rollup(uuid, timestamptz) to authenticated;

commit;
