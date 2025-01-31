import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;
