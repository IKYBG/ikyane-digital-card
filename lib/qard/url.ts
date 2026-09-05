import { env } from '@/lib/env';

export function getPublicProfileUrl(slug: string) {
  return `${env.appUrl.replace(/\/$/, '')}/u/${encodeURIComponent(slug)}`;
}
