/**
 * Service Worker Registration
 * Registers the service worker for offline support and caching
 */

'use client'

import { useEffect } from 'react'

export const ServiceWorkerRegistration = () => {
  useEffect(() => {
    // Only register service worker in production on HTTPS
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production' &&
      window.location.protocol === 'https:'
    ) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration)

          // Check for updates every hour
          setInterval(
            () => {
              registration.update()
            },
            60 * 60 * 1000
          )
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })

      // Handle service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker updated, reloading...')
        window.location.reload()
      })
    }
  }, [])

  return null
}
