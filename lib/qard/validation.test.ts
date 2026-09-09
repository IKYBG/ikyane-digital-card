import { describe, expect, it } from 'vitest';
import { appearanceSchema, slugSchema, socialLinkSchema } from './validation';
describe('slugSchema', () => {
  it('normalise un slug valide', () =>
    expect(slugSchema.parse('Lucas_01')).toBe('lucas_01'));
  it('refuse les routes réservées', () =>
    expect(() => slugSchema.parse('dashboard')).toThrow());
  it('refuse les caractères non sûrs', () =>
    expect(() => slugSchema.parse('lucas martin')).toThrow());
});

describe('validation des contenus publics', () => {
  it('refuse un protocole de lien exécutable', () => {
    expect(() =>
      socialLinkSchema.parse({
        platform: 'custom',
        label: '',
        url: 'javascript:alert(1)',
        username: '',
        enabled: true,
      }),
    ).toThrow();
  });

  it('accepte les protocoles attendus', () => {
    expect(
      socialLinkSchema.parse({
        platform: 'email',
        label: '',
        url: 'mailto:test@example.com',
        username: '',
        enabled: true,
      }).url,
    ).toBe('mailto:test@example.com');
  });

  it('refuse une couleur arbitraire', () => {
    expect(() =>
      appearanceSchema.parse({
        theme: 'midnight-glass',
        background_type: 'color',
        background_value: '#001122',
        accent_color: 'red',
        text_color: '#ffffff',
        card_opacity: 0.8,
        card_blur: 18,
        card_radius: 28,
        button_style: 'glass',
        avatar_shape: 'circle',
        font_family: 'geist',
        animation_style: 'none',
        animation_enabled: false,
        show_banner: true,
      }),
    ).toThrow();
  });
});
