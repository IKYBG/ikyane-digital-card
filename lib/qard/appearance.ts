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
    name: 'Studio Bleu',
    description: 'Architecture bleue et ivoire',
    category: 'essential',
    bg: 'linear-gradient(145deg, #06184f, #315cae)',
    accent: '#c9dcff',
    text: '#f9fbff',
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
    name: 'Opaline',
    description: 'Blanc lumineux et bleu lavande',
    category: 'essential',
    bg: 'linear-gradient(145deg, #edf2f7, #cbd7ec 54%, #ddd6ed)',
    accent: '#3156be',
    text: '#101c68',
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
    name: 'Minuit Studio',
    description: 'Bleu nuit et lumière froide',
    category: 'essential',
    bg: 'linear-gradient(145deg, #0a1533, #111f53)',
    accent: '#9fc2ff',
    text: '#f7f9ff',
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
    name: 'Cobalt Atelier',
    description: 'Bleu signature et contrasté',
    category: 'essential',
    bg: 'linear-gradient(145deg, #09155e, #456fe4)',
    accent: '#edf3ff',
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
    name: 'Aube Rosée',
    description: 'Nacre rosée et lilas doux',
    category: 'expressive',
    bg: 'linear-gradient(145deg, #f2e4e9, #dacbe9 55%, #cad8e9)',
    accent: '#7652b6',
    text: '#33215b',
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
    name: 'Sienne Éditoriale',
    description: 'Terre, encre et lumière',
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
    name: 'Perle Studio',
    description: 'Ivoire, lumière et précision',
    category: 'minimal',
    bg: 'linear-gradient(145deg, #f0efec, #d7ddea 58%, #e0d9ea)',
    accent: '#3655a5',
    text: '#15205c',
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
    name: 'Iris Nocturne',
    description: 'Indigo et reflet opalin',
    category: 'expressive',
    bg: 'linear-gradient(145deg, #101d4e, #4a316f)',
    accent: '#d8c7ff',
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
    name: 'Verre Sauge',
    description: 'Minéral, calme et lumineux',
    category: 'expressive',
    bg: 'linear-gradient(145deg, #bdc9bc, #e1e7dc)',
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
    name: 'Encre',
    description: 'Noir bleuté essentiel',
    category: 'minimal',
    bg: '#0b1020',
    accent: '#dce7ff',
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
    name: 'Galerie',
    description: 'Blanc architectural et bleu encre',
    category: 'minimal',
    bg: '#e9ecf3',
    accent: '#18266a',
    text: '#121942',
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
    name: 'Papier Bleu',
    description: 'Papier ivoire et encre cobalt',
    category: 'minimal',
    bg: '#e4e0d7',
    accent: '#233c99',
    text: '#171f4f',
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
  ['Opaline', 'linear-gradient(145deg, #edf2f7, #cbd7ec 54%, #ddd6ed)'],
  ['Studio', 'linear-gradient(145deg, #06184f, #315cae)'],
  ['Iris', 'linear-gradient(145deg, #101d4e, #4a316f)'],
  ['Rosée', 'linear-gradient(145deg, #f2e4e9, #dacbe9 55%, #cad8e9)'],
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
