'use client'

import { SpeedInsights } from '@vercel/speed-insights/react'
import { useEffect, useState } from 'react'

/**
 * Safe wrapper for Vercel Speed Insights to prevent runtime errors
 * Only renders after client-side hydration is complete
 */
export default function SpeedInsightsWrapper() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Only render SpeedInsights after component is mounted on client
  if (!isMounted) {
    return null
  }

  try {
    return <SpeedInsights />
  } catch (error) {
    console.error('SpeedInsights failed to load:', error)
    return null
  }
}
