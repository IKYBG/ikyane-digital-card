import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/', destination: '/card', permanent: false },
      { source: '/q', destination: '/card', permanent: false },
    ];
  },
};

export default nextConfig;
