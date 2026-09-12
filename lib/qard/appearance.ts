import type { Appearance } from '@/types/database';

export const appearanceThemes = [
  {
    id: 'midnight-glass',
    name: 'Midnight Glass',
    bg: 'linear-gradient(145deg, #06101f, #0a2850)',
    accent: '#8fd4ff',
    text: '#f7fbff',
    pro: false,
  },
  {
    id: 'frost',
    name: 'Frost',
    bg: 'linear-gradient(145deg, #dce8ef, #f8fbfc)',
    accent: '#1565c0',
    text: '#10212e',
    pro: false,
  },
  {
    id: 'graphite',
    name: 'Graphite',
    bg: 'linear-gradient(145deg, #181b20, #060708)',
    accent: '#d7ff58',
    text: '#f5f7f8',
    pro: false,
  },
  {
    id: 'pearl',
    name: 'Pearl',
    bg: 'linear-gradient(145deg, #f6f2e9, #d9d2c5)',
    accent: '#715d3e',
    text: '#211d17',
    pro: true,
  },
  {
    id: 'aurora',
    name: 'Aurora',
    bg: 'linear-gradient(145deg, #10253a, #322555)',
    accent: '#9ef7cc',
    text: '#f7f5ff',
    pro: true,
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    bg: '#090a0c',
    accent: '#ffffff',
    text: '#ffffff',
    pro: true,
  },
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    bg: '#f5f5f2',
    accent: '#111111',
    text: '#111111',
    pro: true,
  },
] as const;

export const appearanceGradients = [
  ['Nuit', 'linear-gradient(145deg, #06101f, #0a2850)'],
  ['Aurore', 'linear-gradient(145deg, #10253a, #322555)'],
  ['Graphite', 'linear-gradient(145deg, #181b20, #060708)'],
  ['Givre', 'linear-gradient(145deg, #dce8ef, #f8fbfc)'],
] as const;

const hexPattern = /^#[0-9a-f]{6}$/i;
const gradientPattern = /^linear-gradient\([^;{}]+\)$/i;
const imagePattern = /^https:\/\/[\w.-]+(?:\/[^\s]*)?$/i;

function themeFor(themeId: string) {
  return (
    appearanceThemes.find((theme) => theme.id === themeId) ??
    appearanceThemes[0]
  );
}

export function isValidBackground(
  type: Appearance['background_type'],
  value: string,
) {
  if (type === 'color') return hexPattern.test(value);
  if (type === 'gradient') return gradientPattern.test(value);
  return imagePattern.test(value);
}

export function compatibleBackgroundValue(
  type: Appearance['background_type'],
  value: string,
  themeId: string,
  profileImage?: string | null,
) {
  if (isValidBackground(type, value)) return value;
  const theme = themeFor(themeId);
  if (type === 'image') return profileImage ?? '';
  if (type === 'color') {
    return hexPattern.test(theme.bg)
      ? theme.bg
      : theme.text.toLowerCase() === '#10212e' ||
          theme.text.toLowerCase() === '#211d17' ||
          theme.text.toLowerCase() === '#111111'
        ? '#eef3f6'
        : '#07172c';
  }
  return gradientPattern.test(theme.bg)
    ? theme.bg
    : 'linear-gradient(145deg, #06101f, #0a2850)';
}

function relativeLuminance(hex: string) {
  const channels = [1, 3, 5].map((index) => {
    const value = Number.parseInt(hex.slice(index, index + 2), 16) / 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

export function resolveAppearance(appearance: Appearance) {
  const theme = themeFor(appearance.theme);
  const accent = hexPattern.test(appearance.accent_color)
    ? appearance.accent_color
    : theme.accent;
  const text = hexPattern.test(appearance.text_color)
    ? appearance.text_color
    : theme.text;
  const value = compatibleBackgroundValue(
    appearance.background_type,
    appearance.background_value,
    appearance.theme,
  );
  const background =
    appearance.background_type === 'image' && isValidBackground('image', value)
      ? `url(${JSON.stringify(value)}) center / cover no-repeat`
      : value || theme.bg;
  const darkText = relativeLuminance(text) < 0.42;

  return {
    accent,
    text,
    background,
    onAccent: relativeLuminance(accent) > 0.48 ? '#07111c' : '#ffffff',
    surfaceRgb: darkText ? '242 245 247' : '3 10 23',
    radius: Math.min(48, Math.max(0, appearance.card_radius)),
    opacity: Math.min(1, Math.max(0.35, appearance.card_opacity)),
    blur: Math.min(32, Math.max(0, appearance.card_blur)),
  };
}
