import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      { source: '/industry-dashboard', destination: '/role-based', permanent: true },
      { source: '/industry-dashboard/:path*', destination: '/role-based/:path*', permanent: true },
    ];
  },
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
