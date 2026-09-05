const bases: Record<string, string> = {
  instagram: 'https://instagram.com/', snapchat: 'https://snapchat.com/add/', tiktok: 'https://tiktok.com/@', github: 'https://github.com/',
  youtube: 'https://youtube.com/@', linkedin: 'https://linkedin.com/in/', x: 'https://x.com/', facebook: 'https://facebook.com/', twitch: 'https://twitch.tv/',
  reddit: 'https://reddit.com/u/', telegram: 'https://t.me/', whatsapp: 'https://wa.me/', spotify: 'https://open.spotify.com/',
};

export function normalizeSocialUrl(platform: string, value: string) {
  const clean = value.trim();
  if (platform === 'email') return clean.startsWith('mailto:') ? clean : `mailto:${clean}`;
  if (platform === 'phone') return clean.startsWith('tel:') ? clean : `tel:${clean.replace(/\s/g, '')}`;
  if (platform === 'whatsapp') return clean.startsWith('http') ? clean : `https://wa.me/${clean.replace(/\D/g, '')}`;
  if (/^https?:\/\//i.test(clean)) return clean;
  return `${bases[platform] ?? 'https://'}${clean.replace(/^@/, '')}`;
}

export const platformLabels: Record<string, string> = { instagram: 'Instagram', snapchat: 'Snapchat', tiktok: 'TikTok', discord: 'Discord', github: 'GitHub', youtube: 'YouTube', linkedin: 'LinkedIn', x: 'X', facebook: 'Facebook', twitch: 'Twitch', reddit: 'Reddit', telegram: 'Telegram', whatsapp: 'WhatsApp', spotify: 'Spotify', email: 'Email', phone: 'Téléphone', website: 'Site web', custom: 'Lien' };
