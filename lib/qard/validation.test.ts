import { describe, expect, it } from 'vitest';
import { appearanceThemes } from './appearance';
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
  it('accepte chaque palette proposée dans le studio', () => {
    for (const theme of appearanceThemes) {
      expect(
        appearanceSchema.safeParse({
          theme: theme.id,
          background_type: theme.bg.startsWith('#') ? 'color' : 'gradient',
          background_value: theme.bg,
          accent_color: theme.accent,
          text_color: theme.text,
          card_opacity: theme.cardOpacity,
          card_blur: theme.cardBlur,
          card_radius: theme.cardRadius,
          button_style: theme.buttonStyle,
          avatar_shape: theme.avatarShape,
          font_family: theme.fontFamily,
          animation_style: 'none',
          animation_enabled: false,
          show_banner: true,
        }).success,
      ).toBe(true);
    }
  });

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
