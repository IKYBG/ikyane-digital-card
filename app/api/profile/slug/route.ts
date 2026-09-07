import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { slugSchema } from '@/lib/qard/validation';

export async function PATCH(request: Request) {
  const parsed = slugSchema.safeParse((await request.json().catch(() => null))?.slug);
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return Response.json({ error: 'Non autorisé' }, { status: 401 });

  const { data: profile, error: profileError } = await supabase.from('qard_profiles').select('id,slug').eq('user_id', data.user.id).single();
  if (profileError || !profile) return Response.json({ error: 'Profil introuvable.' }, { status: 404 });
  if (profile.slug === parsed.data) return Response.json({ slug: parsed.data });

  const admin = createAdminClient();
  const { data: reserved } = await admin.from('qard_slug_aliases').select('profile_id').eq('slug', parsed.data).maybeSingle();
  if (reserved && reserved.profile_id !== profile.id) return Response.json({ error: 'Cet identifiant est déjà pris.' }, { status: 409 });
  if (reserved?.profile_id === profile.id) await admin.from('qard_slug_aliases').delete().eq('slug', parsed.data);

  const { error } = await supabase.from('qard_profiles').update({ slug: parsed.data }).eq('id', profile.id);
  if (error) return Response.json({ error: error.code === '23505' ? 'Cet identifiant est déjà pris.' : error.message }, { status: 409 });

  const { error: aliasError } = await admin.from('qard_slug_aliases').upsert({ slug: profile.slug, profile_id: profile.id });
  if (aliasError) return Response.json({ error: 'Identifiant modifié, mais l’ancienne adresse n’a pas pu être conservée.' }, { status: 500 });
  return Response.json({ slug: parsed.data });
}
