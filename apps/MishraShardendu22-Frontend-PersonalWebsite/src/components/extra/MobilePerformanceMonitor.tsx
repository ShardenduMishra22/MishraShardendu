/**
 * Mobile Performance Monitoring
 * Tracks and reports performance metrics for mobile devices
 */

'use client'

import { useEffect } from 'react'
import type { Metric } from 'web-vitals'

export const MobilePerformanceMonitor = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return

    // Track Core Web Vitals
    const reportWebVitals = (metric: Metric) => {
      console.log(metric.name, metric.value)

      // Send to analytics
      if (window.gtag) {
        window.gtag('event', metric.name, {
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          event_category: 'Web Vitals',
          event_label: metric.id,
          non_interaction: true,
        })
      }
    }

    // Import web-vitals dynamically
    import('web-vitals')
      .then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
        onCLS(reportWebVitals)
        onFCP(reportWebVitals)
        onLCP(reportWebVitals)
        onTTFB(reportWebVitals)
        onINP(reportWebVitals)
      })
      .catch(() => {
        console.log('Web vitals not available')
      })

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              console.warn('Long task detected:', entry.duration, 'ms')
            }
          }
        })
        longTaskObserver.observe({ entryTypes: ['longtask'] })

        return () => longTaskObserver.disconnect()
      } catch (e) {
        console.error('Performance observer error:', e)
      }
    }
  }, [])

  return null
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

/**
 * Core Web Vitals tracked:
 * - LCP (Largest Contentful Paint): Measures loading performance
 * - FCP (First Contentful Paint): Measures when first content is painted
 * - CLS (Cumulative Layout Shift): Measures visual stability
 * - TTFB (Time to First Byte): Measures server response time
 * - INP (Interaction to Next Paint): Measures interactivity (replaces FID in v5)
 */
