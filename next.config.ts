import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* updated custom auth config */
  experimental: {
    globalNotFound: true,
  },
  // Admin uploads (service images etc.) are stored on Cloudinary
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
