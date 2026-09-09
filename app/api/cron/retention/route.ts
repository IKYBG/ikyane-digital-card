import { reportServerError } from '@/lib/server/observability';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ error: 'Non autorisé' }, { status: 401 });
  }
  try {
    const { data: deleted, error } = await createAdminClient().rpc(
      'qard_delete_expired_analytics',
    );
    if (error) throw error;
    return Response.json({ deleted });
  } catch (error) {
    const errorId = reportServerError('analytics.retention', error);
    return Response.json(
      { error: 'Nettoyage impossible', errorId },
      { status: 500 },
    );
  }
}
