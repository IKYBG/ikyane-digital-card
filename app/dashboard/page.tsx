import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  ExternalLink,
  Link2,
  QrCode,
  UserRoundPen,
} from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ShareActions } from '@/components/dashboard/ShareActions';
import { getCurrentQard, requireUser } from '@/lib/qard/data';
import { getPublicProfileUrl } from '@/lib/qard/url';
import { getContactLinks } from '@/lib/qard/contacts';
import styles from './dashboard.module.css';

export default async function DashboardPage() {
  const data = await getCurrentQard();
  const { profile } = data;
  const { supabase } = await requireUser();
  const sinceDate = new Date();
  sinceDate.setUTCDate(sinceDate.getUTCDate() - 7);
  const since = sinceDate.toISOString();
  const [{ count: views }, { count: clicks }, { count: contacts }] =
    await Promise.all([
      supabase
        .from('qard_analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profile.id)
        .eq('event_type', 'profile_view')
        .gte('created_at', since),
      supabase
        .from('qard_analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profile.id)
        .eq('event_type', 'link_click')
        .gte('created_at', since),
      supabase
        .from('qard_analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profile.id)
        .eq('event_type', 'contact_download')
        .gte('created_at', since),
    ]);
  const url = getPublicProfileUrl(profile.slug);
  const nextStep = !profile.published
    ? {
        title: 'Votre carte est masquée',
        text: 'Publiez-la avant votre prochaine rencontre.',
        href: '/dashboard/editor',
        label: 'Publier ma carte',
        icon: UserRoundPen,
      }
    : getContactLinks(profile, data.links).length === 0
      ? {
          title: 'Ajoutez un moyen de contact',
          text: 'Une carte utile permet de vous joindre.',
          href: '/dashboard/links',
          label: 'Ajouter mes coordonnées',
          icon: Link2,
        }
      : {
          title: 'Prêt pour votre prochain échange',
          text: 'Montrez votre QR. La personne peut enregistrer votre contact sans compte.',
          href: '/dashboard/qr',
          label: 'Montrer mon QR',
          icon: QrCode,
        };
  const NextIcon = nextStep.icon;

  return (
    <div className={styles.overview}>
      <DashboardHeader
        eyebrow="Accueil"
        title={`Bonjour, ${profile.display_name.split(' ')[0]}.`}
        description="Votre identité numérique, prête à être partagée."
      />
      <div className={styles.grid}>
        <article className={styles.card}>
          <span className={styles.status}>
            {profile.published ? 'Qard en ligne' : 'Qard masquée'}
          </span>
          <div className={styles.identity}>
            {profile.avatar_url ? (
              <Image
                className={styles.avatar}
                src={profile.avatar_url}
                alt=""
                width={72}
                height={72}
                sizes="72px"
              />
            ) : (
              <span className={styles.avatarFallback} aria-hidden="true">
                {profile.display_name.charAt(0).toUpperCase()}
              </span>
            )}
            <div>
              <h2>{profile.display_name}</h2>
              <p>{profile.headline || 'Votre Qard personnelle'}</p>
            </div>
          </div>
          <p className={styles.url}>{url.replace(/^https?:\/\//, '')}</p>
          <div className={styles.actions}>
            <Link className={styles.primary} href="/dashboard/qr">
              <QrCode size={17} /> Montrer mon QR
            </Link>
            <Link
              className={styles.secondary}
              href={`/u/${profile.slug}`}
              target="_blank"
              rel="noreferrer"
              prefetch={false}
            >
              Voir <ExternalLink size={16} />
            </Link>
            <Link className={styles.secondary} href="/dashboard/editor">
              Modifier ma carte
            </Link>
            <ShareActions url={url} published={profile.published} />
          </div>
        </article>

        <div className={styles.side}>
          <article className={styles.sideCard}>
            <span className={styles.sideLabel}>Prochaine action</span>
            <div className={styles.nextAction}>
              <NextIcon size={21} />
              <div>
                <strong>{nextStep.title}</strong>
                <p>{nextStep.text}</p>
              </div>
            </div>
            <Link className={styles.textLink} href={nextStep.href}>
              {nextStep.label} <ArrowRight size={15} />
            </Link>
          </article>

          <article className={styles.sideCard}>
            <span className={styles.sideLabel}>7 derniers jours</span>
            <div className={styles.metrics}>
              <div className={styles.metric}>
                <strong>{views ?? 0}</strong>
                <span>Vues</span>
              </div>
              <div className={styles.metric}>
                <strong>{clicks ?? 0}</strong>
                <span>Clics sur les liens</span>
              </div>
              <div className={styles.metric}>
                <strong>{contacts ?? 0}</strong>
                <span>Demandes de contact</span>
              </div>
            </div>
            <p className="activation-note">
              Les demandes indiquent des clics sur « Enregistrer ». L’ajout au
              téléphone n’est pas confirmé.
            </p>
            <Link className={styles.textLink} href="/dashboard/analytics">
              <BarChart3 size={15} /> Voir les statistiques
            </Link>
          </article>
        </div>
      </div>
    </div>
  );
}
