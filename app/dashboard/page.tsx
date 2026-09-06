import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Circle,
  Eye,
  Link2,
  QrCode,
  UserRoundPen,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ShareActions } from "@/components/dashboard/ShareActions";
import { getCurrentQard } from "@/lib/qard/data";
import { getPublicProfileUrl } from "@/lib/qard/url";

export default async function DashboardPage() {
  const data = await getCurrentQard();
  const { profile, links, appearance } = data;
  const { supabase } = await import("@/lib/qard/data").then((m) =>
    m.requireUser(),
  );
  const sinceDate = new Date();
  sinceDate.setUTCDate(sinceDate.getUTCDate() - 7);
  const since = sinceDate.toISOString();
  const [{ count: views }, { count: clicks }] = await Promise.all([
    supabase
      .from("qard_analytics_events")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", profile.id)
      .eq("event_type", "profile_view")
      .gte("created_at", since),
    supabase
      .from("qard_analytics_events")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", profile.id)
      .eq("event_type", "link_click")
      .gte("created_at", since),
  ]);
  const url = getPublicProfileUrl(profile.slug);
  const checklist = [
    { label: "Ajouter une photo", done: Boolean(profile.avatar_url) },
    { label: "Ajouter une bio", done: Boolean(profile.bio) },
    { label: "Ajouter 3 liens", done: links.length >= 3 },
    {
      label: "Personnaliser sa Qard",
      done: appearance.theme !== "midnight-glass",
    },
    { label: "Télécharger son QR", done: Boolean(profile.qr_downloaded_at) },
  ];
  return (
    <>
      <DashboardHeader
        eyebrow="Vue d’ensemble"
        title={`Bonjour, ${profile.display_name.split(" ")[0]}.`}
        description="Gère ta carte et partage-la quand tu veux."
      />
      <div className="dashboard-grid">
        <article className="panel qard-summary">
          <div className="panel-title">
            <span>Ma Qard</span>
            <i className={profile.published ? "online" : ""}>
              {profile.published ? "Publiée" : "Masquée"}
            </i>
          </div>
          <div>
            <div className="mini-avatar">{profile.display_name[0]}</div>
            <div>
              <strong>{profile.display_name}</strong>
              <p>{url.replace(/^https?:\/\//, "")}</p>
            </div>
          </div>
          <ShareActions url={url} published={profile.published} />
          <Link className="panel-link" href="/dashboard/editor">
            Modifier ma Qard <UserRoundPen size={16} />
          </Link>
        </article>
        <article className="panel qr-summary">
          <QrCode size={78} strokeWidth={1.1} />
          <div>
            <span>QR permanent</span>
            <strong>Prêt à partager</strong>
            <Link href="/dashboard/qr">
              Télécharger mon QR <ArrowUpRight size={15} />
            </Link>
          </div>
        </article>
        <article className="panel metrics-panel">
          <span>7 derniers jours</span>
          <div>
            <strong>
              {views ?? 0}
              <small>Vues</small>
            </strong>
            <strong>
              {clicks ?? 0}
              <small>Clics</small>
            </strong>
            <strong>
              {views ? Math.round(((clicks ?? 0) / views) * 100) : 0}%
              <small>CTR</small>
            </strong>
          </div>
          <Link href="/dashboard/analytics">
            Voir les analytics <Eye size={16} />
          </Link>
        </article>
        <article className="panel checklist-panel">
          <span>Progression</span>
          <div>
            {checklist.map((item) => (
              <p key={item.label} className={item.done ? "done" : ""}>
                {item.done ? <Check size={15} /> : <Circle size={15} />}
                {item.label}
              </p>
            ))}
          </div>
          <Link href="/dashboard/links">
            Continuer <Link2 size={16} />
          </Link>
        </article>
      </div>
    </>
  );
}
