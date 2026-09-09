import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  return ['', '/pricing', '/privacy', '/terms'].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path ? 'monthly' : 'weekly',
    priority: path ? 0.5 : 1,
  }));
}
