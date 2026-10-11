import { describe, expect, it } from 'vitest';
import { createVCard } from './vcard';
import type { Profile } from '@/types/database';
const profile = {
  id: '1',
  user_id: '2',
  slug: 'lucas',
  display_name: 'Lucas, Martin',
  first_name: 'Lucas',
  last_name: 'Martin',
  headline: null,
  bio: null,
  avatar_url: null,
  banner_url: null,
  company: 'Qard; Studio',
  job_title: 'Designer',
  location: null,
  email_public: 'lucas@example.com',
  phone_public: '+33600000000',
  website: 'https://example.com',
  published: true,
  show_branding: true,
  plan: 'free',
  onboarding_completed: true,
  qr_downloaded_at: null,
  created_at: '',
  updated_at: '',
} satisfies Profile;
describe('createVCard', () => {
  it('génère une vCard 3.0 et échappe les séparateurs', () => {
    const card = createVCard(profile);
    expect(card).toContain('BEGIN:VCARD\r\nVERSION:3.0');
    expect(card).toContain('FN:Lucas\\, Martin');
    expect(card).toContain('ORG:Qard\\; Studio');
    expect(card).toContain('END:VCARD\r\n');
  });
});

it('includes enabled link contacts and the permanent Qard URL', () => {
  const base = {
    id: 'a',
    profile_id: '1',
    label: null,
    username: null,
    position: 0,
    created_at: '',
    updated_at: '',
  };
  const card = createVCard(
    { ...profile, phone_public: null },
    [
      { ...base, platform: 'phone', url: 'tel:+33612345678', enabled: true },
      {
        ...base,
        id: 'b',
        platform: 'email',
        url: 'mailto:hidden@example.com',
        enabled: false,
      },
      {
        ...base,
        id: 'c',
        platform: 'website',
        url: 'javascript:alert(1)',
        enabled: true,
      },
    ],
    'https://qard.example/u/lucas',
  );
  expect(card).toContain('TEL;TYPE=CELL:+33612345678');
  expect(card).toContain('URL:https://qard.example/u/lucas');
  expect(card).not.toContain('hidden@example.com');
  expect(card).not.toContain('javascript:');
});
it('prevents line injection and folds long Unicode values at 75 octets', () => {
  const card = createVCard({
    ...profile,
    display_name: 'é'.repeat(80) + '\r\nTEL:fake',
  });
  expect(card).not.toContain('\r\nTEL:fake');
  expect(card).toContain('\\nTEL:fake');
  for (const line of card.split('\r\n'))
    expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
});
