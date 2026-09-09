import { hasValidOrigin, reportServerError } from '@/lib/server/observability';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(request: Request) {
  if (!hasValidOrigin(request))
    return Response.json({ error: 'Origine invalide' }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (body?.confirmation !== 'SUPPRIMER')
    return Response.json({ error: 'Confirmation requise' }, { status: 400 });

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user)
      return Response.json({ error: 'Non autorisé' }, { status: 401 });
    const lastSignIn = data.user.last_sign_in_at
      ? Date.parse(data.user.last_sign_in_at)
      : 0;
    if (!lastSignIn || Date.now() - lastSignIn > 30 * 60_000) {
      return Response.json(
        { error: 'Reconnecte-toi avant cette opération sensible.' },
        { status: 403 },
      );
    }

    const admin = createAdminClient();
    for (const bucket of ['avatars', 'banners'] as const) {
      const paths: string[] = [];
      for (let offset = 0; ; offset += 100) {
        const { data: files, error: listError } = await admin.storage
          .from(bucket)
          .list(data.user.id, { limit: 100, offset });
        if (listError) throw listError;
        paths.push(
          ...(files ?? [])
            .filter((file) => file.id)
            .map((file) => `${data.user.id}/${file.name}`),
        );
        if (!files || files.length < 100) break;
      }
      for (let index = 0; index < paths.length; index += 100) {
        const { error: removeError } = await admin.storage
          .from(bucket)
          .remove(paths.slice(index, index + 100));
        if (removeError) throw removeError;
      }
    }
    const { error: deleteError } = await admin.auth.admin.deleteUser(
      data.user.id,
    );
    if (deleteError) throw deleteError;
    return new Response(null, { status: 204 });
  } catch (error) {
    const errorId = reportServerError('account.delete', error);
    return Response.json(
      { error: 'Suppression impossible', errorId },
      { status: 500 },
    );
  }
}
