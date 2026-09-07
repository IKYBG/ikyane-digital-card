import { createAdminClient } from '@/lib/supabase/admin';
import { slugSchema } from '@/lib/qard/validation';

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const parsed = slugSchema.safeParse((await params).slug);
  if (!parsed.success) return Response.json({ available: false, error: parsed.error.issues[0].message }, { status: 400 });
  try {
    const admin = createAdminClient();
    const [{ data: profile, error: profileError }, { data: alias, error: aliasError }] = await Promise.all([
      admin.from('qard_profiles').select('id').eq('slug', parsed.data).maybeSingle(),
      admin.from('qard_slug_aliases').select('profile_id').eq('slug', parsed.data).maybeSingle(),
    ]);
    if (profileError || aliasError) throw profileError ?? aliasError;
    return Response.json({ available: !profile && !alias });
  } catch {
    return Response.json({ available: false, error: 'Vérification indisponible' }, { status: 503 });
  }
}
