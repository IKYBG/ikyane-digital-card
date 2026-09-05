import Link from "next/link";
import {
  BarChart3,
  Download,
  Eye,
  MousePointerClick,
  TrendingUp,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { getCurrentQard, requireUser } from "@/lib/qard/data";
import { platformLabels } from "@/lib/qard/social";

type Event = {
  id: number;
  event_type: string;
  social_link_id: string | null;
  created_at: string;
};
export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const rawPeriod = Number((await searchParams).period ?? 30);
  const period = [7, 30, 90].includes(rawPeriod) ? rawPeriod : 30;
  const { profile, links } = await getCurrentQard();
  const { supabase } = await requireUser();
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - period);
  const { data } = await supabase
    .from("analytics_events")
    .select("id,event_type,social_link_id,created_at")
    .eq("profile_id", profile.id)
    .gte("created_at", since.toISOString())
    .order("created_at");
  const events = (data ?? []) as Event[];
  const count = (type: string) =>
    events.filter((item) => item.event_type === type).length;
  const views = count("profile_view");
  const clicks = count("link_click");
  const downloads = count("contact_download");
  const qrDownloads = count("qr_download");
  const days = Array.from({ length: period }, (_, index) => {
    const date = new Date(since.getTime() + (index + 1) * 86400000);
    const key = date.toISOString().slice(0, 10);
    return {
      key,
      label: date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
      }),
      views: events.filter(
        (item) =>
          item.event_type === "profile_view" && item.created_at.startsWith(key),
      ).length,
      clicks: events.filter(
        (item) =>
          item.event_type === "link_click" && item.created_at.startsWith(key),
      ).length,
    };
  });
  const max = Math.max(1, ...days.map((day) => day.views));
  const popular = links
    .map((link) => ({
      ...link,
      clicks: events.filter(
        (event) =>
          event.event_type === "link_click" && event.social_link_id === link.id,
      ).length,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);
  return (
    <>
      <DashboardHeader
        eyebrow="Analytics"
        title="Ce qui crée le contact."
        description="Des mesures réelles, sans confondre automatiquement visite et scan QR."
        action={
          <div className="period-tabs">
            {[7, 30, 90].map((days) => (
              <Link
                className={days === period ? "active" : ""}
                href={`/dashboard/analytics?period=${days}`}
                key={days}
              >
                {days} j
              </Link>
            ))}
          </div>
        }
      />
      <div className="stat-grid">
        <article>
          <Eye />
          <span>Vues</span>
          <strong>{views}</strong>
        </article>
        <article>
          <MousePointerClick />
          <span>Clics</span>
          <strong>{clicks}</strong>
        </article>
        <article>
          <Download />
          <span>Contacts</span>
          <strong>{downloads}</strong>
        </article>
        <article>
          <Download />
          <span>QR téléchargés</span>
          <strong>{qrDownloads}</strong>
        </article>
        <article>
          <TrendingUp />
          <span>CTR</span>
          <strong>{views ? Math.round((clicks / views) * 100) : 0}%</strong>
        </article>
      </div>
      <section className="panel chart-panel">
        <div className="panel-title">
          <div>
            <h2>Activité</h2>
            <p>Vues et clics sur {period} jours</p>
          </div>
          <BarChart3 />
        </div>
        {events.length ? (
          <div className="bar-chart">
            {days.map((day) => (
              <div
                key={day.key}
                title={`${day.label}: ${day.views} vues, ${day.clicks} clics`}
              >
                <span
                  style={{ height: `${Math.max(3, (day.views / max) * 100)}%` }}
                />
                <i
                  style={{
                    height: `${Math.max(2, (day.clicks / max) * 100)}%`,
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-chart">
            <BarChart3 />
            <h3>Tes statistiques apparaîtront après tes premières visites.</h3>
            <p>Partage ta Qard pour commencer à mesurer les interactions.</p>
          </div>
        )}
      </section>
      <section className="panel popular-panel">
        <h2>Liens populaires</h2>
        {popular.length ? (
          popular.map((link) => (
            <div key={link.id}>
              <span>{platformLabels[link.platform] ?? link.label}</span>
              <strong>
                {link.clicks} clic{link.clicks === 1 ? "" : "s"}
              </strong>
            </div>
          ))
        ) : (
          <p>Aucun lien à analyser pour le moment.</p>
        )}
      </section>
    </>
  );
}
