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
      { source: '/role_based', destination: '/role-based', permanent: false },
      { source: '/role_based/:path*', destination: '/role-based/:path*', permanent: false },
      // LisN HDFC demo: /hdfc-v3 was the working name; versions now live at /hdfc-pulse/v1 and /hdfc-pulse/v2.
      { source: '/hdfc-v3', destination: '/hdfc-pulse/v2/mds-office', permanent: false },
      { source: '/hdfc-v3/:path*', destination: '/hdfc-pulse/v2/:path*', permanent: false },
    ];
  },
  // IndusInd demo: never indexed, on top of Deployment Protection and the page-level robots meta.
  async headers() {
    const noindex = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }];
    return [
      { source: '/indusind-v1', headers: noindex },
      { source: '/indusind-v1/:path*', headers: noindex },
    ];
  },
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
