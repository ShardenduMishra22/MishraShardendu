'use client'

import { useEffect } from 'react'
import { logPerformanceMetrics, isMobileDevice, isSlowConnection } from '@/lib/mobile-performance'

/**
 * Performance Monitor Component
 * Logs performance metrics in development
 * Tracks mobile-specific performance issues
 */
export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return

    // Log initial performance metrics after page load
    const logMetrics = () => {
      logPerformanceMetrics()

      const mobile = isMobileDevice()
      const slow = isSlowConnection()

      console.group('📱 Device & Connection Info')
      console.log('Mobile Device:', mobile)
      console.log('Slow Connection:', slow)
      console.log('User Agent:', navigator.userAgent)

      if ('connection' in navigator) {
        const conn = (navigator as any).connection
        console.log('Effective Type:', conn?.effectiveType || 'unknown')
        console.log('Downlink:', conn?.downlink || 'unknown', 'Mbps')
        console.log('RTT:', conn?.rtt || 'unknown', 'ms')
        console.log('Save Data:', conn?.saveData || false)
      }
      console.groupEnd()
    }

    // Wait for page to fully load
    if (document.readyState === 'complete') {
      setTimeout(logMetrics, 1000)
    } else {
      window.addEventListener('load', () => {
        setTimeout(logMetrics, 1000)
      })
    }

    // Monitor long tasks (potential mobile performance issues)
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              console.warn('⚠️ Long Task Detected:', {
                duration: `${entry.duration.toFixed(2)}ms`,
                startTime: `${entry.startTime.toFixed(2)}ms`,
                name: entry.name,
              })
            }
          }
        })

        observer.observe({ entryTypes: ['longtask'] })

        return () => observer.disconnect()
      } catch (e) {
        // longtask not supported in all browsers
      }
    }
  }, [])

  return null
}
