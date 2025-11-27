

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  compress: true,
  
  // Performance optimizations (Tesla/SpaceX philosophy)
  poweredByHeader: false,
  generateEtags: true,
  productionBrowserSourceMaps: false,
  
  // Build configuration
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Output configuration for static export if needed
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: [],
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  
  // Optimization for production builds
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  
  // Allow cross-origin requests from Replit domains (only strings, no regex)
  allowedDevOrigins: true,
  
  // Environment variables
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://127.0.0.1:8000',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
  },
  
  // Rewrites for API calls to backend
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: 'http://127.0.0.1:8000/api/:path*',
        },
      ],
    };
  },
  
  // Headers for security, PWA, and cache control
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, public, max-age=0'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          },
          {
            key: 'X-UA-Compatible',
            value: 'IE=edge'
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600'
          },
        ],
      },
      {
        source: '/icon-:width(\\d+)x:height(\\d+).(png|svg)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
        ],
      },
    ];
  },
}
