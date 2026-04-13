const nextConfig = {
  async redirects() {
    return [
      { source: "/industry-dashboard", destination: "/role-based", permanent: true },
      { source: "/industry-dashboard/:path*", destination: "/role-based/:path*", permanent: true },
    ];
  },
  experimental: {
    useLightningcss: false,
    optimizeCss: false,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
