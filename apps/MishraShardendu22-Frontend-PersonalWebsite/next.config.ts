import type { NextConfig } from 'next'
import { withMicrofrontends } from '@vercel/microfrontends/next/config'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Mobile optimization
    unoptimized: false,
    loader: 'default',
  },
  experimental: {
    proxyTimeout: 120000,
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      '@tabler/icons-react',
      'recharts',
      '@nivo/bar',
      '@nivo/core',
      '@nivo/line',
      '@nivo/pie',
      'react-hook-form',
      'zod',
      '@hookform/resolvers',
      'next-themes',
    ],
    optimizeCss: true,
    scrollRestoration: true,
    // Mobile optimization flags
    cpus: 4,
    webpackBuildWorker: true,
    optimisticClientCache: true,
    // Enhanced module optimization for better tree-shaking
    esmExternals: true,
  },
  // Modularize imports for better tree-shaking
  modularizeImports: {
    'framer-motion': {
      transform: 'framer-motion/dist/es/{{member}}',
    },
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
    '@tabler/icons-react': {
      transform: '@tabler/icons-react/dist/esm/icons/{{member}}',
    },
    '@radix-ui/react-icons': {
      transform: '@radix-ui/react-icons/dist/{{member}}',
    },
  },
  outputFileTracingRoot: require('path').join(__dirname, '../../'),
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
    // Enable React compiler optimizations
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // Performance optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  generateEtags: true,

  // Optimize chunk sizes for mobile
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  // Mobile-specific webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Enable tree shaking
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
      // More aggressive minification for mobile
      minimize: !dev,
      minimizer:
        !dev && !isServer
          ? [...(config.optimization.minimizer || [])]
          : config.optimization.minimizer,
      // Split chunks for better caching and mobile loading
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Separate framework code
          framework: {
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // Heavy libraries - separate chunks for better mobile loading
          motion: {
            name: 'framer-motion',
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            priority: 35,
            enforce: true,
          },
          three: {
            name: 'three-js',
            test: /[\\/]node_modules[\\/](@react-three|three)[\\/]/,
            priority: 35,
            enforce: true,
          },
          particles: {
            name: 'particles',
            test: /[\\/]node_modules[\\/]@tsparticles[\\/]/,
            priority: 35,
            enforce: true,
          },
          charts: {
            name: 'charts',
            test: /[\\/]node_modules[\\/](@nivo|recharts)[\\/]/,
            priority: 35,
            enforce: true,
          },
          // UI components
          ui: {
            name: 'ui',
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            priority: 30,
            enforce: true,
          },
          // Common vendor code
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 20,
            minChunks: 2,
          },
        },
      },
    }

    // Reduce bundle size by ignoring unnecessary files
    config.resolve.alias = {
      ...config.resolve.alias,
    }

    // Mobile performance: lighter source maps
    if (!dev && !isServer) {
      config.devtool = false // Disable source maps in production for smaller bundles
    }

    return config
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/icons/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
    ]
  },
}

export default withMicrofrontends(nextConfig)
