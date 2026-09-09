import { createHash } from 'node:crypto';
import { analyticsSchema } from '@/lib/qard/validation';
import { reportServerError } from '@/lib/server/observability';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const parsed = analyticsSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return Response.json({ error: 'Événement invalide' }, { status: 400 });

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'anonymous';
  const keyHash = createHash('sha256')
    .update(`${ip}:${process.env.ANALYTICS_RATE_LIMIT_SALT ?? 'qard'}`)
    .digest('hex');

  try {
    const ua = request.headers.get('user-agent') ?? '';
    const device = /Mobile|Android|iPhone/i.test(ua) ? 'mobile' : 'desktop';
    const browser = /Firefox/i.test(ua)
      ? 'Firefox'
      : /Edg/i.test(ua)
        ? 'Edge'
        : /Chrome/i.test(ua)
          ? 'Chrome'
          : /Safari/i.test(ua)
            ? 'Safari'
            : 'Autre';
    const rawReferrer = request.headers.get('referer');
    let referrer: string | null = null;
    try {
      referrer = rawReferrer ? new URL(rawReferrer).origin : null;
    } catch {
      referrer = null;
    }

    const { data: accepted, error } = await createAdminClient().rpc(
      'qard_record_analytics',
      {
        p_key_hash: keyHash,
        p_slug: parsed.data.slug,
        p_event_type: parsed.data.eventType,
        p_social_link_id: parsed.data.socialLinkId ?? null,
        p_referrer: referrer,
        p_device_type: device,
        p_browser: browser,
        p_country: request.headers.get('x-vercel-ip-country'),
      },
    );
    if (error) throw error;
    if (accepted === false)
      return Response.json({ error: 'Trop de requêtes' }, { status: 429 });
    if (accepted === null)
      return Response.json({ error: 'Événement invalide' }, { status: 404 });
    return new Response(null, { status: 204 });
  } catch (error) {
    const errorId = reportServerError('analytics.record', error);
    return Response.json(
      { error: 'Analytics indisponibles', errorId },
      { status: 503 },
    );
  }
}
