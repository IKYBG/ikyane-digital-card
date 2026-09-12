import { describe, expect, it } from 'vitest';
import {
  compatibleBackgroundValue,
  isValidBackground,
  resolveAppearance,
} from './appearance';
import type { Appearance } from '@/types/database';

const appearance = {
  id: 'appearance-id',
  profile_id: 'profile-id',
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
  animation_style: 'fade',
  animation_enabled: true,
  show_banner: true,
  created_at: '',
  updated_at: '',
} satisfies Appearance;

describe('appearance rendering', () => {
  it('replaces an incompatible background when its type changes', () => {
    expect(
      compatibleBackgroundValue(
        'color',
        appearance.background_value,
        appearance.theme,
      ),
    ).toBe('#07172c');
    expect(isValidBackground('color', appearance.background_value)).toBe(false);
  });

  it('uses exact finishing values instead of silently clamping corners', () => {
    expect(resolveAppearance({ ...appearance, card_radius: 0 }).radius).toBe(0);
    expect(resolveAppearance({ ...appearance, card_blur: 32 }).blur).toBe(32);
  });

  it('selects a readable foreground for the accent color', () => {
    expect(
      resolveAppearance({ ...appearance, accent_color: '#f5f5f2' }).onAccent,
    ).toBe('#07111c');
    expect(
      resolveAppearance({ ...appearance, accent_color: '#10253a' }).onAccent,
    ).toBe('#ffffff');
  });
});
