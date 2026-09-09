import { redirect } from 'next/navigation';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import type {
  Appearance,
  Profile,
  QardData,
  SocialLink,
} from '@/types/database';

export async function requireUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims?.sub) redirect('/login');
  return {
    supabase,
    userId: data.claims.sub as string,
    email: data.claims.email as string | undefined,
  };
}

export async function getCurrentQard(): Promise<QardData> {
  const { supabase, userId } = await requireUser();
  const { data: profile, error } = await supabase
    .from('qard_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error || !profile)
    throw new Error(
      'Profil Qard introuvable. Applique la migration Supabase puis reconnecte-toi.',
    );
  const currentProfile = profile as Profile;
  const [{ data: links }, { data: appearance }] = await Promise.all([
    supabase
      .from('qard_social_links')
      .select('*')
      .eq('profile_id', currentProfile.id)
      .order('position'),
    supabase
      .from('qard_appearance')
      .select('*')
      .eq('profile_id', currentProfile.id)
      .single(),
  ]);
  if (!appearance) throw new Error('Apparence Qard introuvable.');
  return {
    profile: currentProfile,
    links: (links ?? []) as SocialLink[],
    appearance: appearance as Appearance,
  };
}

export async function getPublicQard(slug: string): Promise<QardData | null> {
  const supabase = await createClient();
  // RLS is the source of truth here: visitors can only read published cards,
  // while an authenticated owner can also preview their unpublished card.
  const profileFields =
    'id,slug,display_name,first_name,last_name,headline,bio,avatar_url,banner_url,company,job_title,location,email_public,phone_public,website,published,show_branding,created_at,updated_at';
  const initialProfile = await supabase
    .from('qard_profiles')
    .select(profileFields)
    .eq('slug', slug)
    .maybeSingle();
  let profile = initialProfile.data;
  const profileError = initialProfile.error;
  if (profileError) throw profileError;
  if (!profile) {
    const { data: alias, error: aliasError } = await supabase
      .from('qard_slug_aliases')
      .select('profile_id')
      .eq('slug', slug)
      .maybeSingle();
    if (aliasError) throw aliasError;
    if (alias) {
      const resolved = await supabase
        .from('qard_profiles')
        .select(profileFields)
        .eq('id', alias.profile_id)
        .maybeSingle();
      if (resolved.error) throw resolved.error;
      profile = resolved.data;
    }
  }
  if (!profile) return null;
  const publicProfile = {
    ...profile,
    user_id: '',
    plan: 'free',
    onboarding_completed: true,
    qr_downloaded_at: null,
  } satisfies Profile;
  const [
    { data: links, error: linksError },
    { data: appearance, error: appearanceError },
  ] = await Promise.all([
    supabase
      .from('qard_social_links')
      .select('*')
      .eq('profile_id', publicProfile.id)
      .eq('enabled', true)
      .order('position'),
    supabase
      .from('qard_appearance')
      .select('*')
      .eq('profile_id', publicProfile.id)
      .single(),
  ]);
  if (linksError) throw linksError;
  if (appearanceError) throw appearanceError;
  if (!appearance) return null;
  return {
    profile: publicProfile,
    links: (links ?? []) as SocialLink[],
    appearance: appearance as Appearance,
  };
}

export const getPublicQardCached = cache(getPublicQard);
