import { createClient } from '@/lib/supabase/server';

/** Only the signed-in owner's recent aggregate counts; no recipient identifiers. */
export async function GET(request: Request) {
  const parsed = new Date(new URL(request.url).searchParams.get('since') ?? '');
  if (!Number.isFinite(parsed.getTime()))
    return Response.json({ error: 'Date invalide' }, { status: 400 });
  const since = new Date(
    Math.min(Date.now(), Math.max(parsed.getTime(), Date.now() - 5 * 60_000)),
  ).toISOString();
  try {
    const supabase = await createClient();
    const { data: identity } = await supabase.auth.getClaims();
    if (!identity?.claims?.sub) return new Response(null, { status: 401 });
    const { data: profile, error: profileError } = await supabase
      .from('qard_profiles')
      .select('id')
      .eq('user_id', identity.claims.sub)
      .single();
    if (profileError || !profile) return new Response(null, { status: 404 });
    const counts = await Promise.all(
      ['profile_view', 'contact_download'].map((type) =>
        supabase
          .from('qard_analytics_events')
          .select('id', { count: 'exact', head: true })
          .eq('profile_id', profile.id)
          .eq('event_type', type)
          .eq('referrer', 'qard:qr')
          .gte('created_at', since),
      ),
    );
    if (counts.some((result) => result.error))
      return new Response(null, { status: 503 });
    return Response.json(
      { views: counts[0].count ?? 0, contactRequests: counts[1].count ?? 0 },
      { headers: { 'cache-control': 'private, no-store' } },
    );
  } catch {
    return new Response(null, { status: 503 });
  }
}
