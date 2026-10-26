import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },

  // Enable trailing slash consistency for SEO (prevents duplicate URLs)
  trailingSlash: false,
  
  // Compress responses
  compress: true,

  // Image optimization config for SEO (Core Web Vitals)
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'img.unitedclassifieds.sk',
      },
      {
        protocol: 'https',
        hostname: 'admin.realsoft.sk',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
              "worker-src 'self' blob:", // canvas-confetti renders in a blob: Web Worker
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://*.supabase.co https://*.r2.dev https://img.unitedclassifieds.sk https://images.weserv.nl https://lh3.googleusercontent.com https://www.google-analytics.com https://tile.openstreetmap.org https://admin.realsoft.sk",
              "font-src 'self' https://fonts.gstatic.com",
              "frame-src https://www.google.com https://maps.google.com https://www.openstreetmap.org",
              "connect-src 'self' https://*.supabase.co https://places.googleapis.com https://api.resend.com https://www.google-analytics.com",
              "media-src 'self' https://*.supabase.co blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      // Cache static assets aggressively for performance (Core Web Vitals)
      {
        source: '/(.*)\\.(ico|png|jpg|jpeg|svg|webp|avif|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache video assets aggressively (hero loops are content-stable — rename the file if you ever change it)
      {
        source: '/(.*)\\.(mp4|webm|ogg)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // Redirect common misspellings/old URLs if needed
      {
        source: '/sluzby',
        destination: '/preco-frisco',
        permanent: true,
      },
      {
        source: '/:lang(en|de)/sluzby',
        destination: '/:lang/preco-frisco',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
