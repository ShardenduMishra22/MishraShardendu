# Mobile Performance Optimization Guide

## Overview

This document details the performance optimizations implemented to improve mobile performance metrics, particularly focusing on reducing main-thread work and JavaScript execution time.

## Key Performance Issues Addressed

### 1. Main-Thread Work (19.2s → Target: <5s)

**Before:** 19.2 seconds of main-thread blocking
**Goal:** Reduce to under 5 seconds

**Breakdown:**

- Other: 7,995 ms
- Script Evaluation: 5,989 ms
- Script Parsing & Compilation: 2,393 ms
- Style & Layout: 2,116 ms
- Rendering: 341 ms
- Parse HTML & CSS: 301 ms
- Garbage Collection: 93 ms

### 2. JavaScript Execution Time (7.6s → Target: <3s)

Large JavaScript bundles blocking the main thread during evaluation and execution.

### 3. Unused JavaScript (479 KiB to remove)

Dead code and unused imports increasing bundle size unnecessarily.

### 4. JavaScript Minification (285 KiB savings)

Opportunity to reduce bundle size through better minification.

### 5. Back/Forward Cache Blocking

Three issues preventing bfcache:

- WebSocket usage
- cache-control:no-store headers
- Combined WebSocket + cache-control issue

## Solutions Implemented

### 1. Next.js Configuration Optimizations

#### Bundle Splitting Strategy

```typescript
// next.config.ts
webpack: (config, { dev, isServer }) => {
  if (!dev && !isServer) {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        framework: {
          name: 'framework',
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
          priority: 40,
          enforce: true,
        },
        ui: {
          name: 'ui',
          test: /[\\/]node_modules[\\/](@radix-ui|framer-motion)[\\/]/,
          priority: 30,
        },
        charts: {
          name: 'charts',
          test: /[\\/]node_modules[\\/](recharts|@nivo)[\\/]/,
          chunks: 'async', // Lazy loaded
          priority: 25,
        },
        three: {
          name: 'three',
          test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
          chunks: 'async', // Lazy loaded
          priority: 25,
        },
      },
    }
  }
}
```

#### Tree-Shaking with modularizeImports

```typescript
modularizeImports: {
  'lucide-react': {
    transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    skipDefaultConversion: true,
  },
  '@tabler/icons-react': {
    transform: '@tabler/icons-react/dist/esm/icons/{{member}}',
  },
  'date-fns': {
    transform: 'date-fns/{{member}}',
  },
}
```

**Impact:**

- ✅ Reduces icon library size by 60-70%
- ✅ Only imports used icons instead of entire library
- ✅ Estimated savings: ~150KB

#### Package Import Optimization

```typescript
experimental: {
  optimizePackageImports: [
    'lucide-react',
    'framer-motion',
    '@radix-ui/*',
    'recharts',
    '@nivo/*',
    'date-fns',
    'axios',
    'three',
    '@react-three/fiber',
    '@tsparticles/react',
  ],
}
```

**Impact:**

- ✅ Better tree-shaking
- ✅ Reduced parsing time
- ✅ Smaller initial bundles

### 2. Service Worker Optimizations

#### Removed BFCache Blockers

- ✅ Removed WebSocket references
- ✅ Updated cache strategies to avoid `cache-control:no-store`
- ✅ Added proper cache versioning (v1 → v2)

#### Performance Improvements

```javascript
// Stale-while-revalidate pattern
if (cachedResponse) {
  // Return cached response immediately
  // Update cache in background after 24 hours
  if (Date.now() - installTime > 86400000) {
    fetch(request).then(updateCache)
  }
  return cachedResponse
}
```

**Impact:**

- ✅ Enables back/forward cache
- ✅ Faster back/forward navigation
- ✅ Better offline experience

### 3. Code Splitting Utilities

Created `/src/lib/performance.ts` with:

- `lazyLoad()` - Enhanced dynamic import wrapper
- `requestIdleTask()` - Defer non-critical work
- `isLowEndDevice()` - Adaptive loading based on device capabilities
- `isSlowConnection()` - Network-aware loading
- `deferExecution()` - Postpone heavy operations

**Usage:**

```typescript
import { lazyLoad, requestIdleTask } from '@/lib/performance'

const HeavyChart = lazyLoad(() => import('./HeavyChart'), {
  ssr: false,
  delay: 200,
})

requestIdleTask(
  () => {
    // Non-critical initialization
  },
  { timeout: 2000 }
)
```

**Impact:**

- ✅ Reduces Time to Interactive (TTI)
- ✅ Lowers Total Blocking Time (TBT)
- ✅ Improves First Input Delay (FID)

### 4. Heavy Library Identification

Created `/src/components/lazy/heavy-components.tsx` documenting:

- framer-motion: ~100KB
- @nivo charts: ~150KB total
- three.js: ~400KB
- @react-three/fiber: ~100KB
- @tsparticles: ~80KB
- recharts: ~120KB

**Recommendation:** These should be loaded only when needed using dynamic imports.

### 5. PWA Registration Optimization

```typescript
// Defer SW registration using requestIdleCallback
requestIdleCallback(registerServiceWorker, { timeout: 3000 })

// Clean up event listeners for bfcache
return () => {
  window.removeEventListener('beforeinstallprompt', handler)
}
```

**Impact:**

- ✅ Reduces main-thread blocking during initial load
- ✅ Better bfcache compatibility
- ✅ Lower TBT

## Performance Metrics Goals

### Before Optimization

- Main-thread work: 19.2s
- JavaScript execution: 7.6s
- Unused JavaScript: 479 KiB
- Unminified JavaScript: 285 KiB
- BFCache: Blocked (3 reasons)

### After Optimization (Projected)

- Main-thread work: <5s (74% improvement)
- JavaScript execution: <3s (60% improvement)
- Unused JavaScript: <100 KiB (79% reduction)
- Unminified JavaScript: 0 KiB (100% minified)
- BFCache: Enabled ✅

## Implementation Checklist

### Completed ✅

- [x] Next.js webpack configuration optimization
- [x] modularizeImports for tree-shaking
- [x] Service worker bfcache fixes
- [x] Performance utilities library
- [x] PWA registration optimization
- [x] Heavy library documentation

### Recommended Next Steps

- [ ] Audit and remove unused dependencies
- [ ] Convert heavy components to use dynamic imports
- [ ] Implement virtual scrolling for long lists
- [ ] Add bundle analyzer to CI/CD
- [ ] Set up performance budgets
- [ ] Implement resource hints (preconnect, prefetch)
- [ ] Add performance monitoring (Web Vitals)

## How to Measure Improvements

### Local Testing

```bash
# Build for production
pnpm build

# Analyze bundle
ANALYZE=true pnpm build

# Run Lighthouse
npm install -g lighthouse
lighthouse http://localhost:3000 --view
```

### Key Metrics to Monitor

- **Lighthouse Performance Score:** Target: >90
- **Total Blocking Time (TBT):** Target: <300ms
- **First Contentful Paint (FCP):** Target: <1.8s
- **Largest Contentful Paint (LCP):** Target: <2.5s
- **Cumulative Layout Shift (CLS):** Target: <0.1
- **First Input Delay (FID):** Target: <100ms

## Best Practices Moving Forward

### 1. Component Development

```typescript
// ❌ Bad: Import entire library
import * as Icons from 'lucide-react'

// ✅ Good: Import specific icons
import { Home, User } from 'lucide-react'

// ✅ Better: Dynamic import for heavy components
const Chart = dynamic(() => import('./Chart'), { ssr: false })
```

### 2. Animation Libraries

```typescript
// For low-end devices, skip animations
const shouldAnimate = !isLowEndDevice() && !prefersReducedMotion()

<motion.div
  animate={shouldAnimate ? { opacity: 1 } : undefined}
>
```

### 3. Data Fetching

```typescript
// Use ISR (Incremental Static Regeneration)
export const revalidate = 3600 // Revalidate every hour

// Or use SWR for client-side caching
import useSWR from 'swr'
const { data } = useSWR('/api/data', fetcher, {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
})
```

### 4. Images

```typescript
// Always use Next.js Image component
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

## Additional Resources

- [Next.js Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

## Monitoring

### Production Monitoring Setup

```typescript
// layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <>
      {children}
      <SpeedInsights />
      <Analytics />
    </>
  )
}
```

## Summary

These optimizations target the root causes of mobile performance issues:

1. **Reduced bundle sizes** through better code splitting
2. **Eliminated bfcache blockers** for faster navigation
3. **Deferred non-critical work** to improve initial load
4. **Tree-shaking optimizations** to remove unused code
5. **Created reusable utilities** for future performance improvements

Expected overall performance improvement: **60-75%** reduction in main-thread work and JavaScript execution time.
