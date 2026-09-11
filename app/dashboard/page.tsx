import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  ExternalLink,
  Link2,
  Palette,
  QrCode,
  UserRoundPen,
} from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ShareActions } from '@/components/dashboard/ShareActions';
import { getCurrentQard, requireUser } from '@/lib/qard/data';
import { getPublicProfileUrl } from '@/lib/qard/url';
import styles from './dashboard.module.css';

export default async function DashboardPage() {
  const data = await getCurrentQard();
  const { profile, links, appearance } = data;
  const { supabase } = await requireUser();
  const sinceDate = new Date();
  sinceDate.setUTCDate(sinceDate.getUTCDate() - 7);
  const since = sinceDate.toISOString();
  const [{ count: views }, { count: clicks }] = await Promise.all([
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
  ]);
  const url = getPublicProfileUrl(profile.slug);
  const nextStep = !profile.avatar_url
    ? {
        title: 'Ajoutez votre photo',
        text: 'Une Qard avec un visage inspire davantage confiance.',
        href: '/dashboard/editor',
        label: 'Ajouter ma photo',
        icon: UserRoundPen,
      }
    : links.length < 2
      ? {
          title: 'Ajoutez vos contacts',
          text: 'Rendez vos moyens de contact accessibles en un geste.',
          href: '/dashboard/links',
          label: 'Ajouter un contact',
          icon: Link2,
        }
      : appearance.theme === 'midnight-glass'
        ? {
            title: 'Choisissez votre style',
            text: 'Adaptez la Qard à votre identité en quelques secondes.',
            href: '/dashboard/appearance',
            label: 'Choisir un style',
            icon: Palette,
          }
        : {
            title: 'Votre Qard est prête',
            text: 'Téléchargez son QR code pour la partager partout.',
            href: '/dashboard/qr',
            label: 'Voir mon QR code',
            icon: QrCode,
          };
  const NextIcon = nextStep.icon;

  return (
    <>
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
            <Link className={styles.primary} href="/dashboard/editor" prefetch={false}>
              <UserRoundPen size={17} /> Modifier
            </Link>
            <Link
              className={styles.secondary}
              href={`/u/${profile.slug}`}
              target="_blank"
              prefetch={false}
            >
              Voir <ExternalLink size={16} />
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
            <Link className={styles.textLink} href={nextStep.href} prefetch={false}>
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
                <span>Actions</span>
              </div>
              <div className={styles.metric}>
                <strong>
                  {views ? Math.round(((clicks ?? 0) / views) * 100) : 0}%
                </strong>
                <span>Taux</span>
              </div>
            </div>
            <Link className={styles.textLink} href="/dashboard/analytics" prefetch={false}>
              <BarChart3 size={15} /> Voir les statistiques
            </Link>
          </article>
        </div>
      </div>
    </>
  );
}
