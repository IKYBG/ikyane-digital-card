import Link from 'next/link';
import { BarChart3, Download, Eye, MousePointerClick } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { getCurrentQard, requireUser } from '@/lib/qard/data';
import { analyticsPeriod } from '@/lib/qard/plans';
import { platformLabels } from '@/lib/qard/social';

type Rollup = {
  event_day: string;
  event_type:
    | 'profile_view'
    | 'link_click'
    | 'contact_download'
    | 'qr_download';
  social_link_id: string | null;
  event_count: number;
};
export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { profile, links } = await getCurrentQard();
  const period = analyticsPeriod(
    profile.plan,
    Number((await searchParams).period ?? 7),
  );
  const { supabase } = await requireUser();
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - period);
  const { data, error } = await supabase.rpc('qard_analytics_rollup', {
    p_profile_id: profile.id,
    p_since: since.toISOString(),
  });
  if (error) throw error;
  const events = (data ?? []) as Rollup[];
  const count = (type: string) =>
    events
      .filter((item) => item.event_type === type)
      .reduce((total, item) => total + Number(item.event_count), 0);
  const views = count('profile_view');
  const clicks = count('link_click');
  const downloads = count('contact_download');
  const qrDownloads = count('qr_download');
  const days = Array.from({ length: period }, (_, index) => {
    const date = new Date(since.getTime() + (index + 1) * 86400000);
    const key = date.toISOString().slice(0, 10);
    return {
      key,
      label: date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
      }),
      views: events
        .filter(
          (item) =>
            item.event_type === 'profile_view' && item.event_day === key,
        )
        .reduce((total, item) => total + Number(item.event_count), 0),
      clicks: events
        .filter(
          (item) => item.event_type === 'link_click' && item.event_day === key,
        )
        .reduce((total, item) => total + Number(item.event_count), 0),
    };
  });
  const max = Math.max(1, ...days.map((day) => day.views));
  const popular = links
    .map((link) => ({
      ...link,
      clicks: events
        .filter(
          (event) =>
            event.event_type === 'link_click' &&
            event.social_link_id === link.id,
        )
        .reduce((total, event) => total + Number(event.event_count), 0),
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);
  return (
    <>
      <DashboardHeader
        eyebrow="Activité"
        title="Après vos rencontres"
        description="Vues, clics et demandes d’enregistrement. Ces compteurs ne confirment ni un contact ajouté ni un prospect."
        action={
          <div className="period-tabs">
            {(profile.plan === 'pro' ? [7, 30, 90] : [7]).map((days) => (
              <Link
                className={days === period ? 'active' : ''}
                href={`/dashboard/analytics?period=${days}`}
                key={days}
              >
                {days} j
              </Link>
            ))}
          </div>
        }
      />
      <p className="activation-note">
        Une demande correspond au clic sur « Enregistrer le contact ». La
        confirmation dans le téléphone reste privée. Plusieurs clics peuvent
        venir d’une même visite.
      </p>
      <Link className="button button-ghost" href="/dashboard/qr">
        Montrer mon QR pour ma prochaine rencontre →
      </Link>
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
          <span>Demandes de contact</span>
          <strong>{downloads}</strong>
        </article>
        <article>
          <Download />
          <span>Demandes de QR</span>
          <strong>{qrDownloads}</strong>
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
          <figure
            className="bar-chart"
            aria-label={`Évolution des vues et clics sur ${period} jours`}
          >
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
          </figure>
        ) : (
          <div className="empty-chart">
            <BarChart3 />
            <h3>Vos statistiques apparaîtront après les premières visites.</h3>
            <p>Partagez votre Qard pour mesurer les interactions.</p>
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
                {link.clicks} clic{link.clicks === 1 ? '' : 's'}
              </strong>
            </div>
          ))
        ) : (
          <div className="analytics-empty-links">
            <p>
              Ajoutez un contact puis partagez votre Qard pour voir les clics
              ici.
            </p>
            <Link className="button button-ghost" href="/dashboard/links">
              Ajouter un contact
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
