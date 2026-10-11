'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Download, MapPin } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { QardData } from '@/types/database';
import { resolveAppearance } from '@/lib/qard/appearance';
import { getContactLinks } from '@/lib/qard/contacts';
import { platformLabels } from '@/lib/qard/social';
import { SocialIcon } from './SocialIcon';
import styles from './QardPreview.module.css';

export function QardPreview({
  data,
  compact = false,
  analyticsAttributes = false,
  demo = false,
  embedded = false,
}: {
  data: QardData;
  compact?: boolean;
  analyticsAttributes?: boolean;
  demo?: boolean;
  embedded?: boolean;
}) {
  const { profile, appearance } = data;
  const theme = resolveAppearance(appearance);
  const links = getContactLinks(profile, data.links);
  const primary = links[0];
  const hasContact = links.length > 0;
  const contactHref = demo
    ? '/api/demo-contact'
    : `/api/vcard/${encodeURIComponent(profile.slug)}`;
  return (
    <article
      className={`${styles.root} qard-premium${compact ? ` ${styles.compact}` : ''}`}
      data-entry-animation={
        appearance.animation_enabled ? appearance.animation_style : 'none'
      }
      style={
        {
          '--card-bg': theme.background,
          '--card-accent': theme.accent,
          '--card-ink': theme.text,
          '--card-surface': `rgb(${theme.surfaceRgb})`,
          '--card-on-accent': theme.onAccent,
        } as CSSProperties
      }
    >
      <div className={styles.banner}>
        {appearance.show_banner && profile.banner_url && (
          <Image
            src={profile.banner_url}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 440px"
            priority={!compact}
          />
        )}
        {profile.show_branding && (
          <span className={styles.wordmark}>Qard.</span>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.avatar}>
          {profile.avatar_url ? (
            <Image src={profile.avatar_url} alt="" fill sizes="88px" />
          ) : (
            <span>{profile.display_name.slice(0, 1).toUpperCase()}</span>
          )}
        </div>
        <header className={styles.identity}>
          {compact || embedded ? (
            <h2>{profile.display_name}</h2>
          ) : (
            <h1>{profile.display_name}</h1>
          )}
          {(profile.job_title || profile.headline) && (
            <p>{profile.job_title || profile.headline}</p>
          )}
          {profile.company && <p>{profile.company}</p>}
          {profile.location && (
            <small>
              <MapPin size={13} /> {profile.location}
            </small>
          )}
        </header>
        {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
        {hasContact ? (
          <div className={styles.actions}>
            {compact ? (
              <button type="button" disabled className={styles.save}>
                Enregistrer le contact
              </button>
            ) : (
              <a
                className={styles.save}
                href={contactHref}
                download={demo ? 'exemple-qard.vcf' : undefined}
                data-qard-contact={analyticsAttributes ? 'true' : undefined}
              >
                <Download size={18} /> Enregistrer le contact
              </a>
            )}
            {primary && (
              <a
                className={styles.primary}
                href={primary.url}
                target={primary.url.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                data-qard-action={analyticsAttributes ? 'true' : undefined}
                data-qard-link-id={
                  analyticsAttributes && !primary.id.startsWith('profile-')
                    ? primary.id
                    : undefined
                }
              >
                <SocialIcon platform={primary.platform} />{' '}
                {primary.label || platformLabels[primary.platform]}{' '}
                <ArrowUpRight size={16} />
              </a>
            )}
            <small>Le téléphone vous proposera d’ajouter ce contact.</small>
          </div>
        ) : (
          <p className={styles.empty}>
            Les coordonnées seront bientôt disponibles.
          </p>
        )}
        {links.length > 1 && (
          <section className={styles.links} aria-label="Coordonnées et réseaux">
            <h2>Retrouvez-moi aussi</h2>
            {links.slice(1).map((link) => (
              <a
                key={link.id}
                href={link.url}
                target={link.url.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                data-qard-action={analyticsAttributes ? 'true' : undefined}
                data-qard-link-id={
                  analyticsAttributes && !link.id.startsWith('profile-')
                    ? link.id
                    : undefined
                }
              >
                <SocialIcon platform={link.platform} />
                <span>
                  {link.label || platformLabels[link.platform] || 'Lien'}
                </span>
                <ArrowUpRight size={16} />
              </a>
            ))}
          </section>
        )}
      </div>
      {profile.show_branding && (
        <footer className={styles.footer}>
          <span>Scanne. Une nouvelle façon de se présenter.</span>
          <Link href="/signup?from=qard">
            Créer ma Qard gratuitement <ArrowUpRight size={13} />
          </Link>
        </footer>
      )}
    </article>
  );
}
