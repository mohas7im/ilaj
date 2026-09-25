import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* updated custom auth config */
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
