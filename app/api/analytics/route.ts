import { analyticsSchema } from "@/lib/qard/validation";
import { createAdminClient } from "@/lib/supabase/admin";

const buckets = new Map<string, { count: number; reset: number }>();
export async function POST(request: Request) {
  const key =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "anonymous";
  const now = Date.now();
  const bucket = buckets.get(key);
  if (bucket && bucket.reset > now && bucket.count >= 60)
    return Response.json({ error: "Trop de requêtes" }, { status: 429 });
  buckets.set(
    key,
    bucket && bucket.reset > now
      ? { ...bucket, count: bucket.count + 1 }
      : { count: 1, reset: now + 60_000 },
  );
  const parsed = analyticsSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return Response.json({ error: "Événement invalide" }, { status: 400 });
  try {
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("id,published")
      .eq("slug", parsed.data.slug)
      .eq("published", true)
      .maybeSingle();
    if (!profile)
      return Response.json({ error: "Profil introuvable" }, { status: 404 });
    let socialLinkId: string | null = null;
    if (parsed.data.socialLinkId) {
      const { data: link } = await admin
        .from("social_links")
        .select("id")
        .eq("id", parsed.data.socialLinkId)
        .eq("profile_id", profile.id)
        .eq("enabled", true)
        .maybeSingle();
      if (!link) return Response.json({ error: "Lien invalide" }, { status: 400 });
      socialLinkId = link.id;
    }
    const ua = request.headers.get("user-agent") ?? "";
    const device = /Mobile|Android|iPhone/i.test(ua) ? "mobile" : "desktop";
    const browser = /Firefox/i.test(ua)
      ? "Firefox"
      : /Edg/i.test(ua)
        ? "Edge"
        : /Chrome/i.test(ua)
          ? "Chrome"
          : /Safari/i.test(ua)
            ? "Safari"
            : "Autre";
    await admin
      .from("analytics_events")
      .insert({
        profile_id: profile.id,
        social_link_id: socialLinkId,
        event_type: parsed.data.eventType,
        referrer: request.headers.get("referer"),
        device_type: device,
        browser,
        country: request.headers.get("x-vercel-ip-country"),
      });
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: "Analytics indisponibles" }, { status: 503 });
  }
}
