'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import type { QardData } from '@/types/database';
import { QardPreview } from './QardPreview';
import { SocialIcon } from './SocialIcon';
import styles from './ContactConvergenceHero.module.css';

const demoQard: QardData = {
  profile: {
    id: 'demo-profile',
    user_id: 'demo-user',
    slug: 'camille-morel',
    display_name: 'Camille Morel',
    first_name: 'Camille',
    last_name: 'Morel',
    headline: 'Designer produit',
    bio: 'Je crée des expériences numériques simples, utiles et humaines.',
    avatar_url: '/qard-demo-avatar.jpg',
    banner_url: '/qard-demo-avatar.jpg',
    company: 'Studio Camille',
    job_title: 'Designer indépendante',
    location: 'Lyon, France',
    email_public: 'camille@qard.me',
    phone_public: '+33 6 12 34 56 78',
    website: null,
    published: true,
    show_branding: false,
    plan: 'pro',
    onboarding_completed: true,
    qr_downloaded_at: null,
    created_at: '',
    updated_at: '',
  },
  links: [
    {
      id: 'demo-instagram', profile_id: 'demo-profile', platform: 'instagram',
      label: 'Instagram', url: 'https://instagram.com/camille.design',
      username: '@camille.design', position: 0, enabled: true, created_at: '', updated_at: '',
    },
    {
      id: 'demo-linkedin', profile_id: 'demo-profile', platform: 'linkedin',
      label: 'LinkedIn', url: 'https://linkedin.com', username: 'Camille Morel',
      position: 1, enabled: true, created_at: '', updated_at: '',
    },
  ],
  appearance: {
    id: 'demo-appearance', profile_id: 'demo-profile', theme: 'frost',
    background_type: 'gradient',
    background_value: 'linear-gradient(145deg, #fafdff, #dfe9ff 54%, #eee7ff)',
    accent_color: '#4265cf', text_color: '#111a5b', card_opacity: 0.96,
    card_blur: 0, card_radius: 38, button_style: 'solid',
    avatar_shape: 'circle', font_family: 'geist', animation_style: 'fade',
    animation_enabled: true, show_banner: true, created_at: '', updated_at: '',
  },
};

const contacts = [
  {
    platform: 'whatsapp',
    label: 'WhatsApp',
    start: [-390, -120],
    mobileStart: [-145, -190],
    target: [-104, 174],
  },
  {
    platform: 'instagram',
    label: 'Instagram',
    start: [-300, 230],
    mobileStart: [-145, 145],
    target: [-52, 174],
  },
  {
    platform: 'snapchat',
    label: 'Snapchat',
    start: [340, -155],
    mobileStart: [145, -175],
    target: [0, 174],
  },
  {
    platform: 'phone',
    label: 'Téléphone',
    start: [390, 175],
    mobileStart: [145, 95],
    target: [52, 174],
  },
  {
    platform: 'email',
    label: 'E-mail',
    start: [250, 285],
    mobileStart: [125, 200],
    target: [104, 174],
  },
] as const;

function ContactParticle({
  contact,
  progress,
  compact,
  reduced,
}: {
  contact: (typeof contacts)[number];
  progress: ReturnType<typeof useSpring>;
  compact: boolean;
  reduced: boolean | null;
}) {
  const start = compact ? contact.mobileStart : contact.start;
  const targetRatio = compact ? 0.84 : 1;
  const x = useTransform(
    progress,
    [0, 0.68, 0.84],
    [start[0], start[0] * 0.16, contact.target[0] * targetRatio],
  );
  const y = useTransform(
    progress,
    [0, 0.68, 0.84],
    [start[1], start[1] * 0.1, contact.target[1] * (compact ? 0.88 : 1)],
  );
  const scale = useTransform(
    progress,
    [0, 0.84],
    [compact ? 0.84 : 1, compact ? 0.72 : 0.8],
  );
  const labelOpacity = useTransform(progress, [0, 0.34, 0.58], [1, 1, 0]);
  const particleOpacity = useTransform(
    progress,
    [0, 0.68, 0.79, 0.88],
    [1, 1, 0.72, 0],
  );
  return (
    <motion.div
      className={styles.particle}
      style={reduced ? undefined : { x, y, scale, opacity: particleOpacity }}
      data-platform={contact.platform}
    >
      <span>
        <SocialIcon platform={contact.platform} size={21} />
      </span>
      <motion.strong style={reduced ? undefined : { opacity: labelOpacity }}>
        {contact.label}
      </motion.strong>
    </motion.div>
  );
}

export function ContactConvergenceHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [compact, setCompact] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 92,
    damping: 26,
    mass: 0.52,
  });
  const copyOpacity = useTransform(progress, [0, 0.22, 0.46], [1, 1, 0]);
  const copyY = useTransform(progress, [0, 0.46], [0, -42]);
  const cardOpacity = useTransform(progress, [0.22, 0.54], [0, 1]);
  const cardScale = useTransform(progress, [0.22, 0.67], [0.86, 1]);
  const cardY = useTransform(progress, [0.22, 0.67], [52, 0]);
  const hintOpacity = useTransform(progress, [0.02, 0.18], [1, 0]);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 700px)');
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.hero}
      aria-labelledby="hero-title"
    >
      <div className={styles.stickyStage}>
        <div className={styles.copyAnchor}>
          <motion.div
            className={styles.copy}
            style={reduced ? undefined : { opacity: copyOpacity, y: copyY }}
          >
            <span className={styles.eyebrow}>
              Votre identité numérique, réunie
            </span>
            <h1 id="hero-title">
              Tous vos contacts.
              <br />
              Une seule Qard.
            </h1>
            <p>
              Rassemblez les moyens vraiment utiles pour vous joindre et
              partagez-les en un geste.
            </p>
            <div className={styles.actions}>
              <Link href="/signup" prefetch={false}>
                Créer ma Qard <ArrowUpRight size={17} />
              </Link>
              <Link href="/card" prefetch={false}>
                Voir un exemple
              </Link>
            </div>
          </motion.div>
        </div>

        <div className={styles.cardAnchor}>
          <motion.div
            className={styles.exampleCard}
            style={
              reduced
                ? undefined
                : { opacity: cardOpacity, scale: cardScale, y: cardY }
            }
            aria-label="Exemple de carte de contact Camille Morel"
          >
            <QardPreview data={demoQard} compact />
          </motion.div>
        </div>

        <div
          className={styles.particles}
          aria-label="WhatsApp, Instagram, Snapchat, téléphone et e-mail réunis dans votre Qard"
        >
          {contacts.map((contact) => (
            <ContactParticle
              key={contact.platform}
              contact={contact}
              progress={progress}
              compact={compact}
              reduced={reduced}
            />
          ))}
        </div>
        <motion.span
          className={styles.scrollHint}
          style={reduced ? undefined : { opacity: hintOpacity }}
        >
          <i /> Faites défiler pour tout réunir
        </motion.span>
      </div>
    </section>
  );
}
