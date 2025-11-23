import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  experimental: {
    useLightningcss: false,
    optimizeCss: false,
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
