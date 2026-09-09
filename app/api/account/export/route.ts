import { reportServerError } from '@/lib/server/observability';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth.user)
      return Response.json({ error: 'Non autorisé' }, { status: 401 });
    const { data: profile, error: profileError } = await supabase
      .from('qard_profiles')
      .select('*')
      .eq('user_id', auth.user.id)
      .single();
    if (profileError || !profile)
      return Response.json({ error: 'Profil introuvable' }, { status: 404 });
    const [
      { data: links, error: linksError },
      { data: appearance, error: appearanceError },
      { data: analytics, error: analyticsError },
    ] = await Promise.all([
      supabase
        .from('qard_social_links')
        .select('*')
        .eq('profile_id', profile.id)
        .order('position'),
      supabase
        .from('qard_appearance')
        .select('*')
        .eq('profile_id', profile.id)
        .single(),
      supabase
        .from('qard_analytics_events')
        .select('*')
        .eq('profile_id', profile.id)
        .order('created_at'),
    ]);
    if (linksError || appearanceError || analyticsError)
      throw linksError ?? appearanceError ?? analyticsError;
    return Response.json(
      {
        exportedAt: new Date().toISOString(),
        account: {
          id: auth.user.id,
          email: auth.user.email,
          createdAt: auth.user.created_at,
        },
        profile,
        links,
        appearance,
        analytics,
      },
      {
        headers: {
          'content-disposition': `attachment; filename="qard-${profile.slug}-export.json"`,
          'cache-control': 'private, no-store',
        },
      },
    );
  } catch (error) {
    const errorId = reportServerError('account.export', error);
    return Response.json(
      { error: 'Export impossible', errorId },
      { status: 500 },
    );
  }
}
