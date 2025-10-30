'use client'

import dynamic from 'next/dynamic'

// Dynamically load analytics to defer non-critical third-party scripts
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
 * Defers loading of analytics scripts to improve initial page load on mobile
 */
export function DeferredAnalytics() {
  return (
    <>
      <AnalyticsComponent />
      <SpeedInsightsComponent />
    </>
  )
}
