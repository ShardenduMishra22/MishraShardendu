# Mobile Performance Optimizations

This document outlines all the optimizations implemented to improve Lighthouse performance scores on mobile devices.

## Overview

Mobile performance was lower than desktop due to:

- Larger JavaScript bundles on slower mobile networks
- Render-blocking resources (fonts, CSS)
- Third-party scripts loading too early
- Non-optimized images for mobile screens
- Layout shifts on slower devices

## Implemented Optimizations

### 1. Next.js Configuration (`next.config.ts`)

#### Image Optimization

- **Removed large device sizes** (2048, 3840) - mobile devices don't need these
- **Increased cache TTL** from 60s to 31536000s (1 year) for better caching
- **Added SVG security** with CSP for safe SVG handling
- **Optimized formats** - AVIF first, then WebP for better compression

#### Build Optimizations

- **Package imports optimization** - Added more packages to tree-shake unused code
- **Webpack workers** - Parallel builds for faster compilation
- **Removed source maps** in production - Reduces bundle size
- **ETag generation** - Better caching with HTTP ETags

#### Headers & Caching

- **Static asset caching** - 1 year cache for `/_next/static/*` and images
- **Manifest caching** - 24 hours for PWA manifest
- **Security headers** - Permissions-Policy to disable unused features
- **Image CDN caching** - Immutable cache for Next.js Image optimization

### 2. Layout Optimizations (`src/app/layout.tsx`)

#### Deferred Third-Party Scripts

```tsx
// Before: Imported directly (blocking)
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

// After: Dynamic import with SSR disabled (non-blocking)
const Analytics = dynamic(
  () => import('@vercel/analytics/react').then((mod) => ({ default: mod.Analytics })),
  { ssr: false }
)
const SpeedInsights = dynamic(
  () => import('@vercel/speed-insights/react').then((mod) => ({ default: mod.SpeedInsights })),
  { ssr: false }
)
```

**Impact**: Analytics and Speed Insights now load after initial page render, improving FCP and LCP.

#### Font Optimization

- **Added `adjustFontFallback`** - Reduces CLS by matching fallback fonts
- **Optimized weights** - Only loading required font weights
- **Swap display** - Shows fallback immediately while fonts load

### 3. CSS Optimizations (`src/app/globals.css`)

#### Rendering Performance

```css
/* Hardware acceleration */
* {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-perspective: 1000;
  perspective: 1000;
}

/* Prevent horizontal scroll on mobile */
body {
  overflow-x: hidden;
  overflow-y: scroll;
  overscroll-behavior-y: none;
}

/* Better text rendering */
html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
```

**Impact**: Smoother animations and scrolling, especially on mobile devices.

### 4. Resource Hints (`src/components/extra/ResourceHints.tsx`)

#### Mobile-Specific Preloading

```tsx
// Preload hero image only on desktop
<link
  rel="preload"
  href="/Professional.webp"
  as="image"
  type="image/webp"
  media="(min-width: 768px)"
/>
```

#### Early Color Scheme Definition

```tsx
<meta name="color-scheme" content="dark light" />
```

**Impact**: Reduces layout shift by preventing flash of unstyled content.

### 5. Intersection Observer Optimization (`src/components/lazy/obs.tsx`)

#### Mobile-Aware Settings

```tsx
const observerOptions = {
  threshold: mobile ? 0.05 : 0.1, // Lower threshold on mobile
  rootMargin: mobile ? '50px' : '100px', // Smaller margin to save bandwidth
}

// Disconnect after first visibility
if (entry.isIntersecting && !hasBeenVisible) {
  setHasBeenVisible(true)
  observer.disconnect() // Reduce observer overhead
}
```

**Impact**: Earlier loading on mobile while being more conservative with bandwidth.

### 6. Web Vitals Optimization (`src/lib/vitals.ts`)

#### Non-Blocking Analytics

```tsx
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => sendToAnalytics(metric))
} else {
  setTimeout(() => sendToAnalytics(metric), 0)
}
```

**Impact**: Analytics don't block the main thread, improving INP and FID.

### 7. Mobile Performance Utilities (`src/lib/mobile-performance.ts`)

New utility functions for:

- **Device detection** - Identify mobile devices
- **Connection speed detection** - Adapt to slow networks
- **Optimal image quality** - Lower quality on slow connections
- **Animation optimization** - Respect prefers-reduced-motion
- **Performance metrics logging** - Debug performance in development

### 8. Performance Monitor (`src/components/extra/PerformanceMonitor.tsx`)

Development-only component that logs:

- DNS, TCP, TTFB, download times
- DOM interactive and complete times
- Device type and connection speed
- Long tasks (>50ms) that could hurt performance

### 9. Page Structure (`src/app/page.tsx`)

#### Added Performance Hints

```tsx
<div className="md:pl-20 transition-all duration-500 ease-out will-change-auto">
```

**Impact**: `will-change-auto` prevents unnecessary layer promotion on mobile.

## Performance Metrics Impact

### Expected Improvements

| Metric      | Desktop | Mobile (Before) | Mobile (After) |
| ----------- | ------- | --------------- | -------------- |
| FCP         | 100     | 85-90           | 95-100         |
| LCP         | 100     | 80-85           | 90-95          |
| CLS         | 100     | 90-95           | 95-100         |
| TBT         | 100     | 85-90           | 95-100         |
| Speed Index | 100     | 85-90           | 95-100         |

### Key Improvements

1. **First Contentful Paint (FCP)**
   - Deferred analytics scripts
   - Optimized font loading
   - Reduced blocking resources

2. **Largest Contentful Paint (LCP)**
   - Image optimization
   - Better caching
   - Mobile-specific resource hints

3. **Cumulative Layout Shift (CLS)**
   - Font fallback matching
   - Early color scheme
   - Proper image dimensions

4. **Total Blocking Time (TBT)**
   - Code splitting
   - Lazy loading
   - Deferred non-critical scripts

5. **Speed Index**
   - Critical CSS inline
   - Progressive enhancement
   - Mobile-first approach

## Testing

### Lighthouse Testing

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Test mobile performance
lighthouse https://your-domain.com --preset=perf --view --only-categories=performance --form-factor=mobile --throttling.cpuSlowdownMultiplier=4

# Test desktop performance
lighthouse https://your-domain.com --preset=perf --view --only-categories=performance --form-factor=desktop
```

### Local Development Testing

1. Run `pnpm dev`
2. Open DevTools → Performance
3. Enable CPU throttling (4x slowdown)
4. Enable network throttling (Slow 3G)
5. Record page load
6. Check for long tasks and layout shifts

### Performance Monitoring

- Check console for performance metrics (dev mode only)
- Monitor Core Web Vitals in production
- Use Vercel Speed Insights for real user data

## Best Practices for Future Development

1. **Always lazy load below-the-fold content**

   ```tsx
   const Component = dynamic(() => import('./Component'), { ssr: false })
   ```

2. **Use Next.js Image component**

   ```tsx
   <Image src="/image.jpg" width={800} height={600} alt="..." />
   ```

3. **Defer third-party scripts**

   ```tsx
   <Script src="..." strategy="lazyOnload" />
   ```

4. **Minimize client-side JavaScript**
   - Use Server Components when possible
   - Split large components
   - Tree-shake unused code

5. **Optimize fonts**
   - Use `font-display: swap`
   - Subset fonts
   - Preload critical fonts

6. **Test on real mobile devices**
   - Don't rely only on DevTools
   - Test on slow networks
   - Test on low-end devices

## Additional Resources

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Performance Scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/)
- [Mobile Performance Checklist](https://www.smashingmagazine.com/2021/01/front-end-performance-2021-free-pdf-checklist/)

## Monitoring in Production

The following are automatically tracked:

- Core Web Vitals via Vercel Analytics
- Performance metrics via Speed Insights
- Custom vitals reporting in `src/lib/vitals.ts`

Access metrics at:

- Vercel Dashboard → Analytics
- Vercel Dashboard → Speed Insights
- Google Search Console → Core Web Vitals

## Troubleshooting

### If mobile score is still low:

1. **Check bundle size**

   ```bash
   pnpm build
   # Check .next/analyze/client.html
   ```

2. **Analyze images**
   - Use WebP/AVIF formats
   - Proper sizing for mobile
   - Lazy load off-screen images

3. **Review third-party scripts**
   - Remove unused scripts
   - Defer non-critical scripts
   - Use facade pattern for embeds

4. **Test on real devices**
   - Use Chrome DevTools remote debugging
   - Test on actual mobile networks
   - Profile on low-end devices

## Maintenance

- **Monthly**: Review bundle size and dependencies
- **Quarterly**: Run Lighthouse audits
- **Yearly**: Review and update performance budget
- **Continuous**: Monitor Core Web Vitals in production
