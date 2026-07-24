import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// Tahap 1: Report-Only. Setelah 1-2 minggu tanpa pelanggaran di console,
// ubah key menjadi "Content-Security-Policy" (enforcement).
const cspReportOnly = [
  "default-src 'self'",
  // GA4 / Google Ads tag (gtag.js) — jangan dihapus, dipakai campaign aktif
  // 'unsafe-eval' dibutuhkan lottie-web (animasi chatbot)
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googletagmanager.com https://*.google-analytics.com https://*.doubleclick.net https://*.googleadservices.com https://*.googlesyndication.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://*.google-analytics.com https://*.googletagmanager.com https://*.doubleclick.net https://*.googlesyndication.com https://webicdn.com https://indonesian.chemical-storagecabinet.com https://image.mitrabatavia.com https://cdn.phototourl.com https://picsum.photos https://images.unsplash.com https://*.google.com https://*.google.co.id",
  "connect-src 'self' https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://*.googletagmanager.com https://*.doubleclick.net https://*.googleadservices.com https://*.googlesyndication.com https://www.google.com https://www.google.co.id",
  "font-src 'self' data:",
  "worker-src 'self' blob:",
  // Google Maps embed (halaman /tentang) + Google Ads remarketing frame
  "frame-src https://www.google.com https://www.google.co.id https://*.doubleclick.net",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  // productionBrowserSourceMaps dimatikan: Vercel menyajikan file .map kosong
  // (SyntaxError di Lighthouse) sehingga fitur ini hanya menambah noise audit.
  experimental: {
    // Inline CSS ke HTML — menghilangkan request CSS terpisah di critical path
    // (CSS situs hanya ~17 KiB sehingga cocok di-inline). Verifikasi di
    // preview deploy Vercel sebelum promote ke production.
    inlineCss: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            // Mulai 1 hari; setelah verifikasi tidak ada masalah akses,
            // naikkan ke max-age=63072000; includeSubDomains; preload
            key: "Strict-Transport-Security",
            value: "max-age=86400",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Content-Security-Policy-Report-Only",
            value: cspReportOnly,
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
      {
        source: "/order-status/:path*",
        headers: [
          {
            key: "Referrer-Policy",
            value: "no-referrer",
          },
        ],
      },
      {
        source: "/api/documents/:path*",
        headers: [
          {
            key: "Referrer-Policy",
            value: "no-referrer",
          },
        ],
      },
      {
        source: "/api/orders/:path*/invoice",
        headers: [
          {
            key: "Referrer-Policy",
            value: "no-referrer",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'andislabs.com' }],
        destination: 'https://www.andislab.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.andislabs.com' }],
        destination: 'https://www.andislab.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'andislab.com' }],
        destination: 'https://www.andislab.com/:path*',
        permanent: true,
      },
    ];
  },
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
    formats: ["image/avif", "image/webp"],
    qualities: [65, 75],
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
        hostname: "andislab.com",
      },
      {
        protocol: "https",
        hostname: "www.andislab.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default analyzer(nextConfig);
