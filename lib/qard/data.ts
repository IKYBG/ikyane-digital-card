import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Appearance, Profile, QardData, SocialLink } from '@/types/database';

export async function requireUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims?.sub) redirect('/login');
  return { supabase, userId: data.claims.sub as string, email: data.claims.email as string | undefined };
}

export async function getCurrentQard(): Promise<QardData> {
  const { supabase, userId } = await requireUser();
  const { data: profile, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
  if (error || !profile) throw new Error('Profil Qard introuvable. Applique la migration Supabase puis reconnecte-toi.');
  const currentProfile = profile as Profile;
  const [{ data: links }, { data: appearance }] = await Promise.all([
    supabase.from('social_links').select('*').eq('profile_id', currentProfile.id).order('position'),
    supabase.from('appearance').select('*').eq('profile_id', currentProfile.id).single(),
  ]);
  if (!appearance) throw new Error('Apparence Qard introuvable.');
  return { profile: currentProfile, links: (links ?? []) as SocialLink[], appearance: appearance as Appearance };
}

export async function getPublicQard(slug: string): Promise<QardData | null> {
  const supabase = await createClient();
  const { data: profile } = await supabase.from('profiles').select('id,slug,display_name,first_name,last_name,headline,bio,avatar_url,banner_url,company,job_title,location,email_public,phone_public,website,published,show_branding,created_at,updated_at').eq('slug', slug).eq('published', true).maybeSingle();
  if (!profile) return null;
  const publicProfile = profile as Profile;
  const [{ data: links }, { data: appearance }] = await Promise.all([
    supabase.from('social_links').select('*').eq('profile_id', publicProfile.id).eq('enabled', true).order('position'),
    supabase.from('appearance').select('*').eq('profile_id', publicProfile.id).single(),
  ]);
  if (!appearance) return null;
  return { profile: publicProfile, links: (links ?? []) as SocialLink[], appearance: appearance as Appearance };
}
