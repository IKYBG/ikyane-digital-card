import { hasValidOrigin, reportServerError } from '@/lib/server/observability';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { slugSchema } from '@/lib/qard/validation';

export async function PATCH(request: Request) {
  if (!hasValidOrigin(request))
    return Response.json({ error: 'Origine invalide.' }, { status: 403 });
  const parsed = slugSchema.safeParse(
    (await request.json().catch(() => null))?.slug,
  );
  if (!parsed.success)
    return Response.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user)
    return Response.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const { data: previousSlug, error } = await createAdminClient().rpc(
      'qard_change_slug',
      {
        p_user_id: data.user.id,
        p_new_slug: parsed.data,
      },
    );
    if (error) {
      const unavailable =
        error.message.includes('slug_unavailable') || error.code === '23505';
      return Response.json(
        {
          error: unavailable
            ? 'Cet identifiant est déjà pris.'
            : 'Modification impossible.',
        },
        { status: unavailable ? 409 : 500 },
      );
    }
    return Response.json({ slug: parsed.data, previousSlug });
  } catch (error) {
    const errorId = reportServerError('profile.change_slug', error);
    return Response.json(
      { error: 'Modification impossible.', errorId },
      { status: 500 },
    );
  }
}
