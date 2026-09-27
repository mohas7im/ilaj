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
  // The website's "Services" pages were renamed to "Treatments"; keep old links working
  async redirects() {
    return [
      { source: "/services", destination: "/treatments", permanent: true },
      { source: "/services/:slug", destination: "/treatments/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
