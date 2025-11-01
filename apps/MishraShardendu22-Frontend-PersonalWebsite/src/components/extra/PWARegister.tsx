'use client'

import { useEffect } from 'react'

export default function PWARegister() {
  useEffect(() => {
    // Defer service worker registration to reduce TBT on mobile
    const registerServiceWorker = () => {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        const registerSW = async () => {
          try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
              scope: '/',
            })

            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    if (window.confirm('New content available! Reload to update?')) {
                      window.location.reload()
                    }
                  }
                })
              }
            })

            navigator.serviceWorker.addEventListener('message', (event) => {
              if (event.data && event.data.type === 'SKIP_WAITING') {
                window.location.reload()
              }
            })
          } catch (error) {
            console.error('Service Worker registration failed:', error)
          }
        }

        registerSW()

        let refreshing = false
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!refreshing) {
            refreshing = true
            window.location.reload()
          }
        })
      }
    }

    // Use requestIdleCallback to defer execution until browser is idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(registerServiceWorker, { timeout: 2000 })
    } else {
      // Fallback to setTimeout for browsers that don't support requestIdleCallback
      setTimeout(registerServiceWorker, 1000)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isAndroid = /Android/.test(navigator.userAgent)

      if (isStandalone) {
        // App launched as PWA
      }

      let deferredPrompt: any = null

      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        deferredPrompt = e
      })

      window.addEventListener('appinstalled', () => {
        deferredPrompt = null
      })
    }
  }, [])

  return null
}
