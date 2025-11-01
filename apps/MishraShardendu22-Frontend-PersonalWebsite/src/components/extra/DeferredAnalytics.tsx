'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically load analytics with extreme deferral to reduce TBT on mobile
const AnalyticsComponent = dynamic(
  () => import('@vercel/analytics/react').then((mod) => mod.Analytics),
  { ssr: false }
)

const SpeedInsightsComponent = dynamic(
  () => import('@vercel/speed-insights/react').then((mod) => mod.SpeedInsights),
  { ssr: false }
)

/**
 * Analytics Wrapper
 * Defers loading of analytics scripts until after page is fully interactive
 * This significantly improves TBT and LCP on mobile devices
 */
export function DeferredAnalytics() {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Only load analytics after page is fully interactive
    // This prevents blocking the main thread during critical rendering
    const loadAnalytics = () => {
      // Wait for page to be fully loaded and interactive
      if (document.readyState === 'complete') {
        // Use requestIdleCallback for better performance on mobile
        if ('requestIdleCallback' in window) {
          requestIdleCallback(
            () => {
              setShouldLoad(true)
            },
            { timeout: 3000 }
          )
        } else {
          // Fallback for browsers without requestIdleCallback
          setTimeout(() => {
            setShouldLoad(true)
          }, 3000)
        }
      } else {
        // Wait for load event
        window.addEventListener('load', () => {
          setTimeout(() => {
            setShouldLoad(true)
          }, 2000)
        })
      }
    }

    loadAnalytics()
  }, [])

  if (!shouldLoad) {
    return null
  }

  return (
    <>
      <AnalyticsComponent />
      <SpeedInsightsComponent />
    </>
  )
}
