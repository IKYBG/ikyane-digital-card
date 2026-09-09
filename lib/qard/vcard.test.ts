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
