import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/pricing', '/privacy', '/terms', '/u/'],
      disallow: [
        '/api/',
        '/dashboard/',
        '/onboarding',
        '/login',
        '/signup',
        '/forgot-password',
        '/reset-password',
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
