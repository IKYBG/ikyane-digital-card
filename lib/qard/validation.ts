import { z } from 'zod';

export const reservedSlugs = new Set([
  'admin',
  'api',
  'dashboard',
  'login',
  'logout',
  'signup',
  'register',
  'pricing',
  'privacy',
  'terms',
  'settings',
  'help',
  'support',
  'qard',
  'www',
  'app',
  'pro',
  'account',
]);

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, 'Choisis au moins 3 caractères.')
  .max(30, 'Utilise au maximum 30 caractères.')
  .regex(
    /^[a-z0-9][a-z0-9_-]*$/,
    'Utilise uniquement des lettres minuscules, chiffres, tirets ou underscores.',
  )
  .refine((value) => !reservedSlugs.has(value), 'Cet identifiant est réservé.');

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(''));
const optionalUrl = z
  .union([
    z.literal(''),
    z.url('Entre une URL complète, par exemple https://…').refine((value) => {
      const protocol = new URL(value).protocol;
      return protocol === 'https:' || protocol === 'http:';
    }, 'Utilise une adresse http:// ou https://.'),
  ])
  .optional();

export const profileSchema = z.object({
  display_name: z.string().trim().min(1, 'Le nom est requis.').max(80),
  first_name: optionalText(60),
  last_name: optionalText(60),
  headline: optionalText(120),
  bio: optionalText(420),
  company: optionalText(100),
  job_title: optionalText(100),
  location: optionalText(100),
  email_public: z.union([z.literal(''), z.email('Email invalide.')]).optional(),
  phone_public: optionalText(30),
  website: optionalUrl,
  published: z.boolean(),
  show_branding: z.boolean(),
});

export const socialLinkSchema = z.object({
  platform: z.enum([
    'instagram',
    'snapchat',
    'tiktok',
    'discord',
    'github',
    'youtube',
    'linkedin',
    'x',
    'facebook',
    'twitch',
    'reddit',
    'telegram',
    'whatsapp',
    'spotify',
    'email',
    'phone',
    'website',
    'custom',
  ]),
  label: optionalText(40),
  url: z
    .string()
    .trim()
    .min(1, 'Ce champ est requis.')
    .max(500)
    .refine((value) => {
      try {
        return ['https:', 'http:', 'mailto:', 'tel:'].includes(
          new URL(value).protocol,
        );
      } catch {
        return false;
      }
    }, 'Ce lien n’utilise pas un protocole autorisé.'),
  username: optionalText(80),
  enabled: z.boolean(),
});

export const appearanceSchema = z.object({
  theme: z.enum([
    'midnight-glass',
    'frost',
    'graphite',
    'cobalt',
    'sakura',
    'terracotta',
    'pearl',
    'aurora',
    'sage',
    'minimal-dark',
    'minimal-light',
    'editorial-ink',
  ]),
  background_type: z.enum(['color', 'gradient', 'image']),
  background_value: z.string().max(800),
  accent_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  text_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  card_opacity: z.number().min(0.35).max(1),
  card_blur: z.number().int().min(0).max(32),
  card_radius: z.number().int().min(0).max(48),
  button_style: z.enum(['glass', 'solid', 'outline', 'minimal']),
  avatar_shape: z.enum(['circle', 'rounded', 'square']),
  font_family: z.enum(['geist', 'inter', 'serif', 'mono']),
  animation_style: z.enum(['none', 'fade', 'slide', 'subtle-scale']),
  animation_enabled: z.boolean(),
  show_banner: z.boolean(),
});

export const analyticsSchema = z.object({
  slug: slugSchema,
  socialLinkId: z.uuid().nullable().optional(),
  eventType: z.enum(['profile_view', 'link_click', 'contact_download']),
});
