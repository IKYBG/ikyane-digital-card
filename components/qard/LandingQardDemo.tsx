'use client';

import { QardPreview } from '@/components/qard/QardPreview';
import type { QardData } from '@/types/database';

const now = '2026-09-13T10:00:00.000Z';

const demoQard: QardData = {
  profile: {
    id: 'demo-profile',
    user_id: 'demo-user',
    slug: 'camille-morel',
    display_name: 'Camille Morel',
    first_name: 'Camille',
    last_name: 'Morel',
    headline: 'Designer produit indépendante',
    bio: 'Je conçois des expériences numériques simples, utiles et humaines.',
    avatar_url: '/qard-demo-avatar.jpg',
    banner_url: null,
    company: 'Studio Camille',
    job_title: 'Design produit',
    location: 'Lyon, France',
    email_public: 'camille@exemple.fr',
    phone_public: '+33 6 12 34 56 78',
    website: 'https://example.com',
    published: true,
    show_branding: false,
    plan: 'pro',
    onboarding_completed: true,
    qr_downloaded_at: now,
    created_at: now,
    updated_at: now,
  },
  links: [
    {
      id: 'demo-instagram',
      profile_id: 'demo-profile',
      platform: 'instagram',
      label: 'Instagram',
      url: 'https://instagram.com/camille.design',
      username: '@camille.design',
      position: 0,
      enabled: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'demo-linkedin',
      profile_id: 'demo-profile',
      platform: 'linkedin',
      label: 'LinkedIn',
      url: 'https://linkedin.com',
      username: 'Camille Morel',
      position: 1,
      enabled: true,
      created_at: now,
      updated_at: now,
    },
  ],
  appearance: {
    id: 'demo-appearance',
    profile_id: 'demo-profile',
    theme: 'midnight-glass',
    background_type: 'gradient',
    background_value: 'linear-gradient(145deg, #06101f, #0a2850)',
    accent_color: '#8fd4ff',
    text_color: '#f7fbff',
    card_opacity: 0.78,
    card_blur: 18,
    card_radius: 28,
    button_style: 'glass',
    avatar_shape: 'circle',
    font_family: 'geist',
    animation_style: 'subtle',
    animation_enabled: true,
    show_banner: true,
    created_at: now,
    updated_at: now,
  },
};

export function LandingQardDemo() {
  return (
    <QardPreview
      data={demoQard}
      compact
      contactHref="/card"
      contactLabel="Enregistrer"
    />
  );
}
