// Service Worker for Mobile Performance Optimization
// Caches static assets and API responses for faster repeat loads

const CACHE_NAME = 'portfolio-v1'
const STATIC_CACHE = 'static-v1'
const DYNAMIC_CACHE = 'dynamic-v1'
const IMAGE_CACHE = 'images-v1'

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

// Maximum cache size for different types
const MAX_CACHE_SIZE = {
  [IMAGE_CACHE]: 50,
  [DYNAMIC_CACHE]: 30,
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(
            (name) =>
              name !== STATIC_CACHE &&
              name !== DYNAMIC_CACHE &&
              name !== IMAGE_CACHE &&
              name !== CACHE_NAME
          )
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// Limit cache size
const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size))
      }
    })
  })
}

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip chrome extensions and analytics
  if (
    url.protocol === 'chrome-extension:' ||
    url.hostname.includes('analytics') ||
    url.hostname.includes('googletagmanager')
  ) {
    return
  }

  // Handle images separately with longer cache
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cacheRes) => {
        if (cacheRes) return cacheRes

        return fetch(request).then((fetchRes) => {
          return caches.open(IMAGE_CACHE).then((cache) => {
            cache.put(request, fetchRes.clone())
            limitCacheSize(IMAGE_CACHE, MAX_CACHE_SIZE[IMAGE_CACHE])
            return fetchRes
          })
        })
      })
    )
    return
  }

  // Handle API requests - network first, then cache
  if (url.pathname.startsWith('/api')) {
    event.respondWith(
      fetch(request)
        .then((fetchRes) => {
          return caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, fetchRes.clone())
            limitCacheSize(DYNAMIC_CACHE, MAX_CACHE_SIZE[DYNAMIC_CACHE])
            return fetchRes
          })
        })
        .catch(() => caches.match(request))
    )
    return
  }

  // Handle static assets - cache first, then network
  event.respondWith(
    caches.match(request).then((cacheRes) => {
      return (
        cacheRes ||
        fetch(request).then((fetchRes) => {
          return caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, fetchRes.clone())
            return fetchRes
          })
        })
      )
    })
  )
})

// Background sync for failed requests (if supported)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Retry failed requests
      Promise.resolve()
    )
  }
})
