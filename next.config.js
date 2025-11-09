

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  
  // Performance optimizations
  poweredByHeader: false,
  generateEtags: true,
  
  // Build configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Output configuration for static export if needed
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: [],
    unoptimized: true,
  },
  
  // Environment variables
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://127.0.0.1:8000',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
  },
  
  // Rewrites for alias routes
  async rewrites() {
    return [
      {
        source: '/live',
        destination: '/en/live',
      },
      {
        source: '/matches',
        destination: '/en/matches',
      },
      {
        source: '/predictions',
        destination: '/en/predictions',
      },
    ];
  },
  
  // Headers for security
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
        ],
      },
    ];
  },
}
