'use client';

/* oxlint-disable jsx-a11y/prefer-tag-over-role, next/no-html-link-for-pages -- the card contains nested controls and the vCard endpoint is a download */
import Image from 'next/image';
import { useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import styles from './QardPreview.module.css';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  MapPin,
  Monitor,
  RotateCcw,
  Share2,
  UserPlus,
} from 'lucide-react';
import type { QardData, SocialLink } from '@/types/database';
import { isSafePublicUrl, platformLabels } from '@/lib/qard/social';
import { SocialIcon } from './SocialIcon';

const dragSpring = {
  type: 'spring',
  stiffness: 420,
  damping: 38,
  mass: 0.65,
} as const;
const directPlatforms = new Set(['email', 'phone', 'website']);

type DisplayLink = Pick<
  SocialLink,
  'id' | 'platform' | 'label' | 'url' | 'username'
>;

export function QardPreview({
  data,
  compact = false,
  analyticsAttributes = false,
  contactHref,
  contactLabel = 'Enregistrer',
}: {
  data: QardData;
  compact?: boolean;
  analyticsAttributes?: boolean;
  contactHref?: string;
  contactLabel?: string;
}) {
  const { profile, appearance } = data;
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltFrameRef = useRef<number | null>(null);
  const dragFlippedRef = useRef(false);
  const gestureRef = useRef<{ x: number; time: number } | null>(null);
  const reducedMotion = useReducedMotion();
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [isFlipping, setIsFlipping] = useState(false);
  const [shared, setShared] = useState(false);
  const enabledLinks = data.links.filter(
    (link) => link.enabled && isSafePublicUrl(link.platform, link.url),
  );
  const networkLinks = enabledLinks.filter(
    (link) => !directPlatforms.has(link.platform),
  );
  const configuredDirect = enabledLinks.filter((link) =>
    directPlatforms.has(link.platform),
  );
  const directLinks: DisplayLink[] = [...configuredDirect];

  if (
    profile.email_public &&
    !directLinks.some((link) => link.platform === 'email')
  ) {
    directLinks.push({
      id: 'profile-email',
      platform: 'email',
      label: 'M’écrire',
      url: `mailto:${profile.email_public}`,
      username: profile.email_public,
    });
  }
  if (
    profile.phone_public &&
    !directLinks.some((link) => link.platform === 'phone')
  ) {
    directLinks.push({
      id: 'profile-phone',
      platform: 'phone',
      label: 'M’appeler',
      url: `tel:${profile.phone_public.replace(/\s/g, '')}`,
      username: profile.phone_public,
    });
  }
  if (
    profile.website &&
    !directLinks.some((link) => link.platform === 'website')
  ) {
    directLinks.push({
      id: 'profile-website',
      platform: 'website',
      label: 'Site web',
      url: profile.website,
      username: profile.website.replace(/^https?:\/\//, ''),
    });
  }

  const visual = appearance.show_banner
    ? profile.avatar_url || profile.banner_url
    : null;
  const safeImageBackground = /^https:\/\/[\w.-]+(?:\/[^\s]*)?$/i.test(
    appearance.background_value,
  );
  const safeCssBackground =
    appearance.background_type === 'color'
      ? /^#[0-9a-f]{6}$/i.test(appearance.background_value)
      : /^linear-gradient\([^;{}]+\)$/i.test(appearance.background_value);
  const background =
    appearance.background_type === 'image' && safeImageBackground
      ? `linear-gradient(rgb(3 10 23 / .2), rgb(3 12 27 / .82)), url(${JSON.stringify(appearance.background_value)}) center / cover`
      : safeCssBackground
        ? appearance.background_value
        : 'linear-gradient(145deg, #06101f, #0a2850)';
  const vars = {
    '--preview-accent': appearance.accent_color,
    '--preview-text': appearance.text_color,
    '--preview-radius': `${Math.max(24, appearance.card_radius)}px`,
    '--preview-opacity': appearance.card_opacity,
    '--preview-blur': `${appearance.card_blur}px`,
    '--preview-bg': background,
    '--electric': appearance.accent_color,
    '--text-primary': appearance.text_color,
  } as React.CSSProperties;

  const resetTilt = () => {
    if (tiltFrameRef.current !== null) {
      window.cancelAnimationFrame(tiltFrameRef.current);
      tiltFrameRef.current = null;
    }
    cardRef.current?.style.setProperty('--rx', '0deg');
    cardRef.current?.style.setProperty('--ry', '0deg');
    cardRef.current?.style.setProperty('--lx', '50%');
    cardRef.current?.style.setProperty('--ly', '18%');
  };
  const flip = () => {
    if (isFlipping) return;
    resetTilt();
    setIsFlipping(true);
    setSide((current) => (current === 'front' ? 'back' : 'front'));
  };
  const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('a, button')) return;
    if (dragFlippedRef.current) {
      dragFlippedRef.current = false;
      return;
    }
    flip();
  };
  const handleCardKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      flip();
    }
  };
  const handleGestureStart = (event: PointerEvent<HTMLDivElement>) => {
    gestureRef.current = { x: event.clientX, time: performance.now() };
  };
  const handleGestureEnd = (event: PointerEvent<HTMLDivElement>) => {
    const start = gestureRef.current;
    gestureRef.current = null;
    if (!start) return;
    const distance = event.clientX - start.x;
    const duration = Math.max(1, performance.now() - start.time);
    const velocity = (distance / duration) * 1000;
    if (Math.abs(distance) < 52 && !(Math.abs(distance) > 24 && Math.abs(velocity) > 480)) return;
    dragFlippedRef.current = true;
    flip();
    window.setTimeout(() => {
      dragFlippedRef.current = false;
    }, 320);
  };
  const handleGestureClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!dragFlippedRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    dragFlippedRef.current = false;
  };
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === 'touch') return;
    const element = cardRef.current;
    if (!element) return;
    const clientX = event.clientX;
    const clientY = event.clientY;
    if (tiltFrameRef.current !== null) return;
    tiltFrameRef.current = window.requestAnimationFrame(() => {
      tiltFrameRef.current = null;
      const bounds = element.getBoundingClientRect();
      const x = (clientX - bounds.left) / bounds.width - 0.5;
      const y = (clientY - bounds.top) / bounds.height - 0.5;
      element.style.setProperty('--rx', `${-y * 3.4}deg`);
      element.style.setProperty('--ry', `${x * 3.8}deg`);
      element.style.setProperty('--lx', `${(x + 0.5) * 100}%`);
      element.style.setProperty('--ly', `${(y + 0.5) * 100}%`);
    });
  };
  const share = async () => {
    const url = `${window.location.origin}/u/${profile.slug}`;
    try {
      if (navigator.share)
        await navigator.share({ title: `${profile.display_name} — Qard`, url });
      else await navigator.clipboard.writeText(url);
      setShared(true);
      window.setTimeout(() => setShared(false), 1500);
    } catch {
      setShared(false);
    }
  };

  const frontTabIndex = side === 'front' && !isFlipping ? 0 : -1;
  const backTabIndex = side === 'back' && !isFlipping ? 0 : -1;
  const vcardHref = contactHref ?? `/api/vcard/${profile.slug}`;
  const renderLink = (link: DisplayLink) => (
    <a
      tabIndex={backTabIndex}
      href={link.url}
      target={link.url.startsWith('http') ? '_blank' : undefined}
      rel="noreferrer"
      key={link.id}
      className={`contact-tile ${link.platform}`}
      data-qard-link-id={
        analyticsAttributes && !link.id.startsWith('profile-')
          ? link.id
          : undefined
      }
    >
      <span className="brand-icon">
        <SocialIcon platform={link.platform} />
      </span>
      <div>
        <strong>{link.label || platformLabels[link.platform] || 'Lien'}</strong>
        <small>
          {link.username || link.url.replace(/^(mailto:|tel:|https?:\/\/)/, '')}
        </small>
      </div>
      <ArrowUpRight size={15} />
    </a>
  );

  return (
    <article
      className={`${styles.root} qard-premium card-perspective theme-${appearance.theme} buttons-${appearance.button_style} avatar-${appearance.avatar_shape} font-${appearance.font_family}${appearance.animation_enabled ? ` animation-${appearance.animation_style}` : ''}${compact ? ' compact' : ''}`}
      style={vars}
    >
      <div className="swipe-orbit swipe-orbit-left" aria-hidden="true">
        <ChevronLeft size={19} />
        <i />
        <i />
        <i />
      </div>
      <div className="swipe-orbit swipe-orbit-right" aria-hidden="true">
        <i />
        <i />
        <i />
        <ChevronRight size={19} />
      </div>
      <div className="card-breath">
        <motion.div
          className="card-motion-shell"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.16}
          dragMomentum={false}
          onPointerDown={handleGestureStart}
          onPointerUp={handleGestureEnd}
          onPointerCancel={() => {
            gestureRef.current = null;
          }}
          onClickCapture={handleGestureClickCapture}
          whileDrag={reducedMotion ? undefined : { scale: 0.975, rotateZ: 0.7 }}
          transition={dragSpring}
        >
          <div
            className={`identity-card side-${side}${isFlipping ? ' is-flipping' : ''}`}
            ref={cardRef}
            role="button"
            tabIndex={0}
            aria-label={side === 'front' ? 'Carte Qard. Appuyez pour afficher les contacts.' : 'Contacts Qard. Appuyez pour revenir au profil.'}
            onClick={handleCardClick}
            onKeyDown={handleCardKey}
            onPointerMove={handlePointerMove}
            onPointerLeave={resetTilt}
          >
            <motion.div
              className="flip-card"
              initial={false}
              animate={{
                rotateY: side === 'back' ? 180 : 0,
                scale:
                  reducedMotion || !isFlipping ? 1 : [1, 1.012, 1],
              }}
              transition={{
                rotateY: reducedMotion
                  ? { duration: 0.01 }
                  : { duration: 0.58, ease: [0.4, 0, 0.4, 1] },
                scale: reducedMotion
                  ? { duration: 0.01 }
                  : {
                      duration: 0.58,
                      times: [0, 0.38, 1],
                      ease: [0.22, 1, 0.36, 1],
                    },
              }}
              onAnimationComplete={() => setIsFlipping(false)}
            >
              <div className="card-depth" aria-hidden="true" />
              <div className="card-edge" aria-hidden="true" />
              <div className="card-glint" aria-hidden="true" />
              <div
                className="card-face card-front"
                aria-hidden={side !== 'front'}
              >
                <div
                  className={`portrait-panel ${visual ? 'has-photo' : 'portrait-placeholder'}`}
                >
                  {visual ? (
                    <Image
                      src={visual}
                      alt={`Portrait de ${profile.display_name}`}
                      fill
                      loading="eager"
                      fetchPriority="high"
                      sizes="(max-width: 640px) 94vw, 420px"
                    />
                  ) : (
                    <div
                      className="monogram"
                      aria-label={`Avatar ${profile.display_name[0]}`}
                    >
                      {profile.display_name.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="portrait-scan" aria-hidden="true" />
                </div>
                <p className="human-note" aria-hidden="true">
                  Créer un web
                  <br />
                  plus humain.
                </p>
                <div className="identity-copy">
                  <div className="name-row">
                    <div>
                      <h1>{profile.display_name}</h1>
                    </div>
                    <span className="verified" aria-label="Profil Qard">
                      <Check size={13} />
                    </span>
                  </div>
                  {profile.headline && (
                    <p className="headline">{profile.headline}</p>
                  )}
                  {(profile.job_title || profile.company) && (
                    <p className="identity-role">
                      {[profile.job_title, profile.company]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  )}
                  {profile.location && (
                    <p className="identity-location">
                      <MapPin size={16} /> {profile.location}
                    </p>
                  )}
                  {profile.bio && <p className="identity-bio">{profile.bio}</p>}
                  <div className="identity-meta reference-meta">
                    <span className="active-profile">
                      <i /> Profil actif
                    </span>
                    {profile.job_title && (
                      <span>
                        <Monitor size={15} /> {profile.job_title}
                      </span>
                    )}
                    {profile.company && (
                      <span>
                        <GraduationCap size={16} /> {profile.company}
                      </span>
                    )}
                    {!profile.job_title &&
                      !profile.company &&
                      profile.headline && (
                        <span>
                          <BriefcaseBusiness size={15} /> {profile.headline}
                        </span>
                      )}
                  </div>
                  <div className="primary-actions">
                    <button
                      tabIndex={frontTabIndex}
                      className="action-primary"
                      onClick={flip}
                    >
                      Voir mes contacts <ArrowUpRight size={17} />
                    </button>
                  </div>
                </div>
                <button
                  tabIndex={frontTabIndex}
                  className="flip-hint qard-flip-hint front-flip-hint"
                  onClick={flip}
                >
                  <i aria-hidden="true" /> Glissez pour retourner
                </button>
              </div>

              <div
                className="card-face card-back"
                aria-hidden={side !== 'back'}
              >
                <div className="back-heading">
                  <div>
                    <span>Contact</span>
                    <h2>Mes contacts</h2>
                  </div>
                  <button
                    tabIndex={backTabIndex}
                    onClick={flip}
                    aria-label="Retourner la carte"
                  >
                    <RotateCcw size={17} />
                  </button>
                </div>
                <div className="contact-groups qard-contact-groups">
                  {networkLinks.length > 0 && (
                    <div className="contact-group">
                      <span className="contact-group-label">Réseaux</span>
                      <div className="contact-matrix network-matrix">
                        {networkLinks.map(renderLink)}
                      </div>
                    </div>
                  )}
                  {directLinks.length > 0 && (
                    <div className="contact-group">
                      <span className="contact-group-label">Direct</span>
                      <div className="contact-matrix direct-matrix">
                        {directLinks.map(renderLink)}
                      </div>
                    </div>
                  )}
                  {networkLinks.length === 0 && directLinks.length === 0 && (
                    <p className="qard-empty-contact">
                      Les coordonnées apparaîtront ici.
                    </p>
                  )}
                </div>
                <div className="back-actions">
                  <a
                    tabIndex={backTabIndex}
                    href={vcardHref}
                    data-qard-contact={analyticsAttributes ? 'true' : undefined}
                  >
                    <UserPlus size={16} /> {contactLabel}
                  </a>
                  <button tabIndex={backTabIndex} onClick={share}>
                    {shared ? <Check size={16} /> : <Share2 size={16} />}{' '}
                    {shared ? 'Lien copié' : 'Partager'}
                  </button>
                </div>
                <div className="back-footer">
                  <span>@{profile.slug}</span>
                  <span>Glissez pour revenir</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      {profile.show_branding && (
        <a className="qard-branding" href="/">
          Créé avec <b>Qard</b>
        </a>
      )}
    </article>
  );
}
