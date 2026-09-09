begin;
select plan(8);

select policies_are('public', 'qard_profiles', array['Qard published profiles are public', 'Qard users insert their profile', 'Qard users update their profile', 'Qard users delete their profile']);
select policies_are('public', 'qard_social_links', array['Qard published links are public', 'Qard users insert own links', 'Qard users update own links', 'Qard users delete own links']);
select policies_are('public', 'qard_appearance', array['Qard published appearance is public', 'Qard users update own appearance']);
select policies_are('public', 'qard_analytics_events', array['Qard users read own analytics', 'Qard users record own QR downloads']);
select policies_are('public', 'qard_subscriptions', array['Qard users read own subscription']);
select policies_are('public', 'qard_slug_aliases', array['Published Qard aliases are public']);
select is((select relrowsecurity from pg_class where oid = 'public.qard_profiles'::regclass), true, 'RLS active sur les profils');
select is((select relrowsecurity from pg_class where oid = 'public.qard_analytics_events'::regclass), true, 'RLS active sur les analytics');

select * from finish();
rollback;
