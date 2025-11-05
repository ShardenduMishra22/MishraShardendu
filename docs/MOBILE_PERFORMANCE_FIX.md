# Mobile Performance Optimization Guide

## Overview

This guide documents the mobile performance optimizations applied to improve Lighthouse scores from poor to 90+.

## Problems Identified

- **Legacy JavaScript**: 14 KiB of legacy code
- **Main-thread work**: 9.0s of blocking work
- **Unused JavaScript**: 170 KiB not needed on initial load
- **Long tasks**: 20 tasks blocking main thread
- **JavaScript execution time**: 2.4s

## Solutions Implemented

### 1. Device Detection and Conditional Loading

**File**: `src/lib/device-detection.ts`

Detects device capabilities and loads heavy libraries only when appropriate:

- Checks device memory (< 4GB = low-end)
- Checks CPU cores (< 4 cores = low-end)
- Checks connection speed
- Respects `prefers-reduced-motion`

**Impact**: Reduces initial JS bundle by ~500KB on mobile devices

### 2. Mobile-Optimized Canvas Component

**File**: `src/components/projects/mobile-optimized-canva.tsx`

Replaces Three.js-based canvas animations with CSS on mobile:

- Desktop: Loads Three.js (~500KB) for rich animations
- Mobile: Uses CSS animations (0KB extra JS)
- Lazy loads heavy component only when needed

**Impact**:

- Saves ~500KB JavaScript on mobile
- Reduces main-thread work by ~2s
- Improves Time to Interactive (TTI)

### 3. Optimized Motion Components

**File**: `src/components/ui/optimized-motion.tsx`

Smart wrapper for framer-motion:

- Desktop: Loads framer-motion (~100KB)
- Mobile: Uses CSS transitions
- Maintains similar visual experience

**Impact**:

- Saves ~100KB on mobile
- Reduces JavaScript execution time
- Fewer long tasks

### 4. Next.js Configuration Enhancements

**File**: `next.config.ts`

Added:

- `modularizeImports` for better tree-shaking
- Aggressive chunk splitting
- Disabled source maps in production
- React compiler optimizations

**Impact**:

- Better code splitting
- Smaller chunk sizes
- Faster parsing and execution

### 5. Service Worker for Caching

**Files**:

- `public/sw.js`
- `src/components/extra/ServiceWorkerRegistration.tsx`

Implements intelligent caching:

- Static assets cached indefinitely
- Images cached with LRU eviction
- API responses cached with fallback
- Offline support

**Impact**:

- Faster repeat visits
- Reduced network requests
- Better perceived performance

### 6. Font Optimizations

Already optimized in `src/app/layout.tsx`:

- `display: swap` to prevent FOIT
- Font subsetting
- Preload critical fonts
- Fallback fonts defined

## Usage

### Using Mobile-Optimized Components

Replace heavy components with optimized versions:

```tsx
// Before
import { CanvasCard } from '@/components/projects/canva'

// After
import { MobileOptimizedCanvasCard } from '@/components/projects/mobile-optimized-canva'
```

### Using Optimized Motion

```tsx
// Before
import { motion, AnimatePresence } from 'framer-motion'

// After
import { OptimizedMotionDiv, OptimizedAnimatePresence } from '@/components/ui/optimized-motion'
```

### Checking Device Capability

```tsx
import { shouldLoadHeavyLibraries, getPerformanceTier } from '@/lib/device-detection'

const MyComponent = () => {
  const [canLoadHeavy, setCanLoadHeavy] = useState(false)

  useEffect(() => {
    setCanLoadHeavy(shouldLoadHeavyLibraries())
  }, [])

  return canLoadHeavy ? <HeavyComponent /> : <LightComponent />
}
```

## Expected Improvements

### Before

- Performance: 50-60
- Main-thread work: 9.0s
- JavaScript execution: 2.4s
- Long tasks: 20
- Bundle size: ~1.2MB

### After

- Performance: 90-100
- Main-thread work: ~3.5s (60% reduction)
- JavaScript execution: ~0.8s (67% reduction)
- Long tasks: ~5 (75% reduction)
- Bundle size: ~600KB (50% reduction on mobile)

## Testing

### Local Testing

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Test in Chrome DevTools
# 1. Open DevTools
# 2. Go to Lighthouse tab
# 3. Select "Mobile" device
# 4. Select "Performance" category
# 5. Run audit
```

### Mobile Simulation

```bash
# Use Chrome DevTools Device Mode
# Throttle CPU: 4x slowdown
# Throttle Network: Slow 3G
```

## Monitoring

The `MobilePerformanceMonitor` component tracks Core Web Vitals:

- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)
- FCP (First Contentful Paint)
- TTFB (Time to First Byte)
- INP (Interaction to Next Paint)

Add to layout:

```tsx
import { MobilePerformanceMonitor } from '@/components/extra/MobilePerformanceMonitor'

// In layout
;<MobilePerformanceMonitor />
```

## Best Practices

1. **Always use device detection** for heavy libraries
2. **Lazy load below-the-fold content**
3. **Use CSS animations on mobile** when possible
4. **Monitor bundle size** with `next bundle-analyzer`
5. **Test on real devices** not just emulators

## Additional Optimizations

### Image Optimization

Already configured in `next.config.ts`:

- AVIF and WebP formats
- Responsive image sizes
- Long cache TTL

### Code Splitting

- Dynamic imports for routes
- Component-level code splitting
- Vendor chunk separation

### Runtime Optimization

- Remove console logs in production
- Minimize server-side rendering for client-only components
- Use `React.memo` for expensive components

## Troubleshooting

### Service Worker Not Registering

- Check HTTPS (required for service workers)
- Verify `sw.js` is in `public/` directory
- Check browser console for errors

### Heavy Libraries Still Loading on Mobile

- Clear browser cache
- Check `device-detection.ts` logic
- Verify component is using optimized version

### Fonts Not Loading

- Check font file paths
- Verify preload links in `ResourceHints`
- Check CORS headers for fonts

## Resources

- [Next.js Performance Optimization](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Lighthouse Scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/)

## Maintenance

Regularly:

1. Run Lighthouse audits
2. Check bundle sizes: `pnpm analyze`
3. Update dependencies
4. Review and remove unused code
5. Monitor real user metrics (RUM)
