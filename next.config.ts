import type { NextConfig } from 'next';

const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://ikyane-digital-card.brown-wand-1699.chatgpt.site';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_SITE_URL: siteOrigin,
  },
  async redirects() {
    return [
      { source: '/', destination: '/card', permanent: false },
      { source: '/q', destination: '/card', permanent: false },
    ];
  },
};

export default nextConfig;
