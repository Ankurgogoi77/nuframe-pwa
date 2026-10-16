import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "pub-7c8d84fdd7764f66967b0ef9a7cffcf1.r2.dev",
      },
    ],
  },
};

export default nextConfig;
