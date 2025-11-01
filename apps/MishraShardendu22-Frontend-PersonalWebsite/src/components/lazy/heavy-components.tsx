/**
 * Optimized Lazy Loading Guide
 *
 * Heavy libraries to lazy load:
 * - framer-motion: ~100KB
 * - @nivo charts: ~150KB
 * - three.js/@react-three/fiber: ~500KB
 * - @tsparticles: ~80KB
 *
 * Usage:
 * const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
 *   loading: () => <Skeleton />,
 *   ssr: false
 * })
 */

export const HEAVY_LIBRARIES = {
  'framer-motion': '~100KB',
  '@nivo/bar': '~50KB',
  '@nivo/line': '~50KB',
  '@nivo/pie': '~50KB',
  three: '~400KB',
  '@react-three/fiber': '~100KB',
  '@tsparticles/react': '~80KB',
  '@tsparticles/engine': '~60KB',
  recharts: '~120KB',
  'react-markdown': '~40KB',
} as const

// Performance tip: Import these libraries dynamically only when needed
// Example:
// const Chart = dynamic(() => import('./Chart'), { ssr: false })
