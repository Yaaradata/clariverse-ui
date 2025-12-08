const nextConfig = {
  experimental: {
    useLightningcss: false,
    optimizeCss: false,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
