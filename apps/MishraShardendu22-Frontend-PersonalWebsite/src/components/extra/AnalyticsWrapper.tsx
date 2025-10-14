'use client'

import { Analytics } from '@vercel/analytics/react'
import { useEffect, useState } from 'react'

/**
 * Safe wrapper for Vercel Analytics to prevent runtime errors
 * Only renders after client-side hydration is complete
 */
export default function AnalyticsWrapper() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Only render Analytics after component is mounted on client
  if (!isMounted) {
    return null
  }

  try {
    return <Analytics />
  } catch (error) {
    console.error('Analytics failed to load:', error)
    return null
  }
}
