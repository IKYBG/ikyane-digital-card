'use client';

/* oxlint-disable jsx-a11y/prefer-tag-over-role, next/no-html-link-for-pages -- the interactive card contains nested contact controls */
import Image from 'next/image';
import {
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react';
import { motion, useReducedMotion } from 'motion/react';
import styles from './QardPreview.module.css';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Monitor,
  UsersRound,
} from 'lucide-react';
import type { QardData, SocialLink } from '@/types/database';
import { resolveAppearance } from '@/lib/qard/appearance';
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
}: {
  data: QardData;
  compact?: boolean;
  analyticsAttributes?: boolean;
}) {
  const { profile, appearance } = data;
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltFrameRef = useRef<number | null>(null);
  const dragFlippedRef = useRef(false);
  const gestureRef = useRef<{ x: number; y: number; time: number } | null>(
    null,
  );
  const reducedMotion = useReducedMotion();
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [isFlipping, setIsFlipping] = useState(false);
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
      label: 'E-mail',
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
      label: 'Téléphone',
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

  const visual = appearance.show_banner ? profile.banner_url : null;
  const avatarVisual = profile.avatar_url;
  const presentation = resolveAppearance(appearance);
  const vars = {
    '--preview-accent': presentation.accent,
    '--preview-text': presentation.text,
    '--preview-on-accent': presentation.onAccent,
    '--preview-surface-rgb': presentation.surfaceRgb,
    '--preview-radius': `${presentation.radius}px`,
    '--preview-opacity': presentation.opacity,
    '--preview-blur': `${presentation.blur}px`,
    '--preview-bg': presentation.background,
    '--electric': presentation.accent,
    '--text-primary': presentation.text,
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
  const handleCardKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      flip();
    }
  };
  const handleGestureStart = (event: PointerEvent<HTMLDivElement>) => {
    gestureRef.current = {
      x: event.clientX,
      y: event.clientY,
      time: performance.now(),
    };
  };
  const handleGestureEnd = (event: PointerEvent<HTMLDivElement>) => {
    const start = gestureRef.current;
    gestureRef.current = null;
    if (!start) return;
    if ((event.target as HTMLElement).closest('a, button')) return;
    const distance = event.clientX - start.x;
    const verticalDistance = event.clientY - start.y;
    const duration = Math.max(1, performance.now() - start.time);
    const velocity = (distance / duration) * 1000;
    const isClick = Math.abs(distance) < 8 && Math.abs(verticalDistance) < 8;
    const isHorizontalDrag =
      Math.abs(distance) >= 38 ||
      (Math.abs(distance) > 22 && Math.abs(velocity) > 420);
    if (!isClick && !isHorizontalDrag) return;
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
  const frontTabIndex = side === 'front' && !isFlipping ? 0 : -1;
  const backTabIndex = side === 'back' && !isFlipping ? 0 : -1;
  const displayLinks = [...networkLinks, ...directLinks];
  const renderLink = (link: DisplayLink) => (
    <a
      tabIndex={backTabIndex}
      href={link.url}
      target={link.url.startsWith('http') ? '_blank' : undefined}
      rel="noreferrer"
      key={link.id}
      className={`${styles.contactItem} qref-contact-item ${link.platform}`}
      data-qard-link-id={
        analyticsAttributes && !link.id.startsWith('profile-')
          ? link.id
          : undefined
      }
    >
      <span className={styles.contactIcon}>
        <SocialIcon platform={link.platform} />
      </span>
      <div>
        <strong>{link.label || platformLabels[link.platform] || 'Lien'}</strong>
        <small>
          {link.username || link.url.replace(/^(mailto:|tel:|https?:\/\/)/, '')}
        </small>
      </div>
      <ChevronRight className={styles.contactChevron} size={20} />
    </a>
  );

  return (
    <article
      className={`${styles.root} qard-premium theme-${appearance.theme}${appearance.animation_enabled ? ` animation-${appearance.animation_style}` : ''}${compact ? ` ${styles.compact}` : ''}`}
      data-entry-animation={
        appearance.animation_enabled ? appearance.animation_style : 'none'
      }
      style={vars}
    >
      <div
        className={`${styles.swipeCue} ${styles.swipeCueLeft}`}
        aria-hidden="true"
      >
        <ChevronLeft size={19} />
      </div>
      <div
        className={`${styles.swipeCue} ${styles.swipeCueRight}`}
        aria-hidden="true"
      >
        <ChevronRight size={19} />
      </div>
      <div className={styles.breath}>
        <motion.div
          className={styles.shell}
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
            className={`${styles.stage} ${side === 'back' ? styles.sideBack : styles.sideFront}${isFlipping ? ` ${styles.flipping}` : ''}`}
            ref={cardRef}
            role="button"
            tabIndex={0}
            aria-label={
              side === 'front'
                ? 'Carte Qard. Appuyez pour afficher les contacts.'
                : 'Contacts Qard. Appuyez pour revenir au profil.'
            }
            onKeyDown={handleCardKey}
            onPointerMove={handlePointerMove}
            onPointerLeave={resetTilt}
          >
            <motion.div
              className={styles.flip}
              initial={false}
              animate={{
                rotateY: side === 'back' ? 180 : 0,
                scale: reducedMotion || !isFlipping ? 1 : [1, 1.012, 1],
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
              <div className={styles.depth} aria-hidden="true" />
              <div className={styles.edge} aria-hidden="true" />
              <div
                className={`${styles.face} ${styles.front}`}
                aria-hidden={side !== 'front'}
              >
                <div className={styles.glint} aria-hidden="true" />
                <div
                  className={`${styles.banner} ${visual ? styles.hasBanner : styles.bannerPlaceholder}`}
                >
                  {visual ? (
                    <Image
                      src={visual}
                      alt={`Bannière de ${profile.display_name}`}
                      fill
                      loading="eager"
                      fetchPriority="high"
                      sizes="(max-width: 640px) 94vw, 420px"
                    />
                  ) : (
                    <div className={styles.bannerShape} aria-hidden="true" />
                  )}
                  <div className={styles.brand} aria-hidden="true">
                    <b>Qard</b>
                    <small>
                      Des gens
                      <br />
                      Des projets
                      <br />
                      Un monde plus ouvert
                    </small>
                  </div>
                  <p className={styles.bannerQuote} aria-hidden="true">
                    Les bonnes
                    <br />
                    connexions font avancer
                    <br />
                    les belles idées.
                  </p>
                </div>
                <div className={styles.frontPanel}>
                  <div className={styles.avatar} aria-hidden="true">
                    {avatarVisual ? (
                      <Image src={avatarVisual} alt="" fill sizes="170px" />
                    ) : (
                      <span>
                        {profile.display_name.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className={styles.nameRow}>
                    <h1>{profile.display_name}</h1>
                    <span
                      className={styles.verified}
                      aria-label="Profil Qard vérifié"
                    >
                      <Check size={13} />
                    </span>
                  </div>
                  {profile.headline && (
                    <p className={styles.headline}>{profile.headline}</p>
                  )}
                  <div className={styles.identityFacts}>
                    {(profile.company || profile.job_title) && (
                      <p>
                        <span>
                          <Monitor size={17} />
                        </span>
                        {profile.company || profile.job_title}
                      </p>
                    )}
                    {profile.location && (
                      <p>
                        <span>
                          <MapPin size={17} />
                        </span>
                        {profile.location}
                      </p>
                    )}
                  </div>
                  {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
                  <button
                    tabIndex={frontTabIndex}
                    className={styles.contactButton}
                    onClick={flip}
                  >
                    <span
                      className={styles.contactButtonIcon}
                      aria-hidden="true"
                    >
                      <UsersRound size={21} />
                    </span>
                    <span>Entrer en contact</span>
                    <ArrowRight
                      className={styles.contactButtonArrow}
                      size={22}
                    />
                  </button>
                </div>
              </div>

              <div
                className={`${styles.face} ${styles.back}`}
                aria-hidden={side !== 'back'}
              >
                <div className={styles.backBrand} aria-hidden="true">
                  <b>Qard</b>
                  <span>✦</span>
                </div>
                <div className={styles.backBanner} aria-hidden="true">
                  {visual && (
                    <Image
                      src={visual}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 86vw, 380px"
                    />
                  )}
                  <small>
                    Des gens
                    <br />
                    Des projets
                    <br />
                    Un monde plus ouvert
                  </small>
                  <em>Les bonnes connexions font avancer les belles idées.</em>
                  <div className={styles.backAvatar}>
                    {avatarVisual ? (
                      <Image src={avatarVisual} alt="" fill sizes="132px" />
                    ) : (
                      <span>
                        {profile.display_name.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <div className={styles.backProfile}>
                  <div className={styles.backName}>
                    <h2>{profile.display_name}</h2>
                    <span className={styles.verified} aria-hidden="true">
                      <Check size={11} />
                    </span>
                  </div>
                  {(profile.job_title || profile.headline) && (
                    <p>{profile.job_title || profile.headline}</p>
                  )}
                </div>
                {profile.bio && (
                  <div className={styles.about}>
                    <strong>À propos</strong>
                    <p>{profile.bio}</p>
                  </div>
                )}
                <h3 className={styles.contactsTitle}>
                  Coordonnées &amp; réseaux
                </h3>
                <div className={styles.contactList}>
                  {displayLinks.map(renderLink)}
                  {displayLinks.length === 0 && (
                    <p className={styles.emptyContact}>
                      Les coordonnées apparaîtront ici.
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  tabIndex={backTabIndex}
                  className={styles.backFlip}
                  onClick={flip}
                  aria-label="Revenir au profil"
                >
                  <ChevronLeft size={18} /> Profil
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      {profile.show_branding && (
        <a className={styles.branding} href="/">
          Créé avec <b>Qard</b>
        </a>
      )}
    </article>
  );
}
