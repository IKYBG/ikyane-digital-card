import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
export async function DELETE() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user)
      return Response.json({ error: "Non autorisé" }, { status: 401 });
    const admin = createAdminClient();
    for (const bucket of ["avatars", "banners"] as const) {
      const { data: files } = await admin.storage.from(bucket).list(data.user.id, { limit: 1000 });
      if (files?.length) {
        await admin.storage.from(bucket).remove(files.map((file) => `${data.user.id}/${file.name}`));
      }
    }
    const { error: deleteError } = await admin.auth.admin.deleteUser(data.user.id);
    if (deleteError) throw deleteError;
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: "Suppression impossible" }, { status: 500 });
  }
}
