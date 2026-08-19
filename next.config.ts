import type { NextConfig } from "next";
import path from "node:path";

// NOTE: Never set an explicit dev port here or in package.json scripts.
// Next.js auto-assigns an available port (default 3000, increments on conflict).
const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
