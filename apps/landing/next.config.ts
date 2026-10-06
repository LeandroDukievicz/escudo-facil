import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Landing 100% estática: pode ser hospedada em qualquer CDN (Vercel, Netlify, S3...).
  output: 'export',
  images: { unoptimized: true },
  // Pacotes do monorepo são publicados como TypeScript puro.
  transpilePackages: ['@escudo/core', '@escudo/tokens'],
  reactStrictMode: true,
};

export default nextConfig;
