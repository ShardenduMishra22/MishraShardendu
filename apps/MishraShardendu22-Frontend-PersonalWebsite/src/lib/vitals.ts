/**
 * Web Vitals Performance Reporter
 * Reports Core Web Vitals to analytics
 */

type Metric = {
  id: string
  name: string
  value: number
  rating?: 'good' | 'needs-improvement' | 'poor'
  delta?: number
  entries?: any[]
}

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals'

function getConnectionSpeed() {
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const conn = (navigator as any).connection
    return conn?.effectiveType || 'unknown'
  }
  return 'unknown'
}

export function sendToAnalytics(metric: Metric) {
  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID
  if (!analyticsId) return

  const body = {
    dsn: analyticsId,
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
  }

  const blob = new Blob([new URLSearchParams(body).toString()], {
    type: 'application/x-www-form-urlencoded',
  })

  if (navigator.sendBeacon) {
    navigator.sendBeacon(vitalsUrl, blob)
  } else {
    fetch(vitalsUrl, {
      body: blob,
      method: 'POST',
      credentials: 'omit',
      keepalive: true,
    })
  }
}

/**
 * Report web vitals
 * Can be imported in pages/_app.tsx or app/layout.tsx
 * Optimized for mobile performance tracking
 */
export function reportWebVitals(metric: Metric) {
  // Log to console in development only
  if (process.env.NODE_ENV === 'development') {
    // Custom handlers for specific metrics in development
    switch (metric.name) {
      case 'FCP':
        // First Contentful Paint - log when first content is rendered
        console.log(`📱 FCP: ${metric.value}ms ${metric.rating ? `(${metric.rating})` : ''}`)
        break
      case 'LCP':
        // Largest Contentful Paint - main content loaded
        console.log(`📱 LCP: ${metric.value}ms ${metric.rating ? `(${metric.rating})` : ''}`)
        break
      case 'CLS':
        // Cumulative Layout Shift - visual stability
        console.log(
          `📱 CLS: ${metric.value.toFixed(3)} ${metric.rating ? `(${metric.rating})` : ''}`
        )
        break
      case 'FID':
        // First Input Delay - interactivity
        console.log(`📱 FID: ${metric.value}ms ${metric.rating ? `(${metric.rating})` : ''}`)
        break
      case 'TTFB':
        // Time to First Byte - server response time
        console.log(`📱 TTFB: ${metric.value}ms ${metric.rating ? `(${metric.rating})` : ''}`)
        break
      case 'INP':
        // Interaction to Next Paint - responsiveness
        console.log(`📱 INP: ${metric.value}ms ${metric.rating ? `(${metric.rating})` : ''}`)
        break
      default:
        console.log('📱', metric)
    }
  }

  // Send to analytics in production only
  // Use requestIdleCallback to avoid blocking main thread on mobile
  if (process.env.NODE_ENV === 'production') {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => sendToAnalytics(metric))
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => sendToAnalytics(metric), 0)
    }
  }
}
