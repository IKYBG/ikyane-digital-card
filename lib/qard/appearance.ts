import type { Appearance } from '@/types/database';

export type AppearanceThemeCategory = 'essential' | 'expressive' | 'minimal';

type AppearanceTheme = {
  id: string;
  name: string;
  description: string;
  category: AppearanceThemeCategory;
  bg: string;
  accent: string;
  text: string;
  pro: boolean;
  buttonStyle: Appearance['button_style'];
  fontFamily: Appearance['font_family'];
  avatarShape: Appearance['avatar_shape'];
  cardOpacity: number;
  cardBlur: number;
  cardRadius: number;
};

export const appearanceThemeCategories = [
  { id: 'essential', label: 'Essentiels' },
  { id: 'expressive', label: 'Expressifs' },
  { id: 'minimal', label: 'Épurés' },
] as const;

export const appearanceThemes = [
  {
    id: 'midnight-glass',
    name: 'Midnight Glass',
    description: 'Bleu profond et verre',
    category: 'essential',
    bg: 'linear-gradient(145deg, #06101f, #0a2850)',
    accent: '#8fd4ff',
    text: '#f7fbff',
    pro: false,
    buttonStyle: 'glass',
    fontFamily: 'geist',
    avatarShape: 'circle',
    cardOpacity: 0.78,
    cardBlur: 18,
    cardRadius: 28,
  },
  {
    id: 'frost',
    name: 'Frost',
    description: 'Clair, calme et précis',
    category: 'essential',
    bg: 'linear-gradient(145deg, #dce8ef, #f8fbfc)',
    accent: '#1565c0',
    text: '#10212e',
    pro: false,
    buttonStyle: 'solid',
    fontFamily: 'inter',
    avatarShape: 'rounded',
    cardOpacity: 0.9,
    cardBlur: 14,
    cardRadius: 24,
  },
  {
    id: 'graphite',
    name: 'Graphite',
    description: 'Sombre et contemporain',
    category: 'essential',
    bg: 'linear-gradient(145deg, #181b20, #060708)',
    accent: '#d7ff58',
    text: '#f5f7f8',
    pro: false,
    buttonStyle: 'outline',
    fontFamily: 'geist',
    avatarShape: 'rounded',
    cardOpacity: 0.9,
    cardBlur: 8,
    cardRadius: 22,
  },
  {
    id: 'cobalt',
    name: 'Cobalt',
    description: 'Bleu franc et énergique',
    category: 'essential',
    bg: 'linear-gradient(145deg, #07194b, #174fc4)',
    accent: '#d7e8ff',
    text: '#ffffff',
    pro: false,
    buttonStyle: 'solid',
    fontFamily: 'inter',
    avatarShape: 'circle',
    cardOpacity: 0.84,
    cardBlur: 12,
    cardRadius: 32,
  },
  {
    id: 'sakura',
    name: 'Sakura',
    description: 'Rose doux et personnel',
    category: 'expressive',
    bg: 'linear-gradient(145deg, #f3dce7, #ddd8f5)',
    accent: '#913d70',
    text: '#281822',
    pro: false,
    buttonStyle: 'solid',
    fontFamily: 'serif',
    avatarShape: 'rounded',
    cardOpacity: 0.91,
    cardBlur: 16,
    cardRadius: 34,
  },
  {
    id: 'terracotta',
    name: 'Terracotta',
    description: 'Chaleureux et affirmé',
    category: 'expressive',
    bg: 'linear-gradient(145deg, #351713, #873b2d)',
    accent: '#ffc09a',
    text: '#fff7f1',
    pro: false,
    buttonStyle: 'outline',
    fontFamily: 'serif',
    avatarShape: 'square',
    cardOpacity: 0.86,
    cardBlur: 10,
    cardRadius: 18,
  },
  {
    id: 'pearl',
    name: 'Pearl',
    description: 'Élégance chaleureuse',
    category: 'minimal',
    bg: 'linear-gradient(145deg, #f6f2e9, #d9d2c5)',
    accent: '#715d3e',
    text: '#211d17',
    pro: true,
    buttonStyle: 'outline',
    fontFamily: 'serif',
    avatarShape: 'rounded',
    cardOpacity: 0.92,
    cardBlur: 10,
    cardRadius: 30,
  },
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Violet et vert boréal',
    category: 'expressive',
    bg: 'linear-gradient(145deg, #10253a, #322555)',
    accent: '#9ef7cc',
    text: '#f7f5ff',
    pro: true,
    buttonStyle: 'glass',
    fontFamily: 'geist',
    avatarShape: 'circle',
    cardOpacity: 0.72,
    cardBlur: 24,
    cardRadius: 36,
  },
  {
    id: 'sage',
    name: 'Sauge',
    description: 'Naturel et apaisant',
    category: 'expressive',
    bg: 'linear-gradient(145deg, #d8e2d6, #f1f4ed)',
    accent: '#355c49',
    text: '#18251e',
    pro: true,
    buttonStyle: 'solid',
    fontFamily: 'inter',
    avatarShape: 'rounded',
    cardOpacity: 0.9,
    cardBlur: 14,
    cardRadius: 26,
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    description: 'Noir essentiel',
    category: 'minimal',
    bg: '#090a0c',
    accent: '#ffffff',
    text: '#ffffff',
    pro: true,
    buttonStyle: 'minimal',
    fontFamily: 'inter',
    avatarShape: 'square',
    cardOpacity: 0.96,
    cardBlur: 0,
    cardRadius: 12,
  },
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    description: 'Blanc architectural',
    category: 'minimal',
    bg: '#f5f5f2',
    accent: '#111111',
    text: '#111111',
    pro: true,
    buttonStyle: 'minimal',
    fontFamily: 'inter',
    avatarShape: 'square',
    cardOpacity: 0.96,
    cardBlur: 0,
    cardRadius: 12,
  },
  {
    id: 'editorial-ink',
    name: 'Editorial Ink',
    description: 'Papier et encre rouge',
    category: 'minimal',
    bg: '#eee7da',
    accent: '#922f32',
    text: '#211e1a',
    pro: true,
    buttonStyle: 'outline',
    fontFamily: 'serif',
    avatarShape: 'square',
    cardOpacity: 0.94,
    cardBlur: 2,
    cardRadius: 8,
  },
] as const satisfies readonly AppearanceTheme[];

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
