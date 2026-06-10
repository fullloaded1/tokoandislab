import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        {
          source: "/:brand/:slug",
          destination: "/katalog/:slug",
        },
      ],
    };
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "webicdn.com",
      },
      {
        protocol: "https",
        hostname: "indonesian.chemical-storagecabinet.com",
      },
      {
        protocol: "https",
        hostname: "image.mitrabatavia.com",
      },
      {
        protocol: "https",
        hostname: "cdn.phototourl.com",
      },
      {
        protocol: "https",
        hostname: "andislabs.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
