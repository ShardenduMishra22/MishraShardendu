const STATIC_CACHE_NAME = 'admin-static-cache-v1'
const DYNAMIC_CACHE_NAME = 'admin-dynamic-cache-v1'
const API_CACHE_NAME = 'admin-api-cache-v1'

const STATIC_ASSETS = [
  '/',
  '/admin',
  '/admin/dashboard',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/favicon.ico',
]

// API endpoints to cache for offline access
const CACHEABLE_API_ENDPOINTS = [
  '/api/blogs',
  '/api/projects',
  '/api/experiences',
  '/api/certifications',
  '/api/volunteer',
  '/api/skills',
  '/api/profile',
  '/api/github-stats',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((error) => {
        console.error('[ServiceWorker] Failed to cache static assets:', error)
      })
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== STATIC_CACHE_NAME &&
            cacheName !== DYNAMIC_CACHE_NAME &&
            cacheName !== API_CACHE_NAME
          ) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API requests with network-first strategy (cache as fallback)
  if (url.pathname.startsWith('/api/')) {
    // Skip caching for non-GET requests (POST, PUT, DELETE, etc.)
    if (request.method !== 'GET') {
      event.respondWith(fetch(request))
      return
    }

    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful GET requests
          if (response && response.status === 200) {
            // Check if this is a cacheable endpoint
            const isCacheable = CACHEABLE_API_ENDPOINTS.some((endpoint) =>
              url.pathname.startsWith(endpoint)
            )

            if (isCacheable) {
              const responseToCache = response.clone()
              caches.open(API_CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache)
              })
            }
          }
          return response
        })
        .catch(() => {
          // If network fails, try to return cached API response (only for GET)
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }
            // Return offline response for API
            return new Response(
              JSON.stringify({
                error: 'Offline - API not available',
                cached: false,
                message: 'You are currently offline. Some data may not be available.',
              }),
              {
                status: 503,
                headers: {
                  'Content-Type': 'application/json',
                  'X-Offline': 'true',
                },
              }
            )
          })
        })
    )
    return
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          // Fallback to cached dashboard or admin home
          return caches.match('/admin/dashboard') || caches.match('/admin') || caches.match('/')
        })
      })
    )
    return
  }

  // Handle all other requests (CSS, JS, images, etc.) with cache-first strategy
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request).then((response) => {
        // Don't cache if response is not valid
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        // Only cache GET requests
        if (request.method !== 'GET') {
          return response
        }

        // Only cache http/https requests
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
          return response
        }

        const responseToCache = response.clone()

        caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache)
        })

        return response
      })
    })
  )
})

// Handle background sync for failed POST/PUT/DELETE requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Implement sync logic here if needed
      Promise.resolve()
    )
  }
})

// Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data
    ? event.data.json()
    : {
        title: 'Admin Dashboard',
        body: 'New update available',
      }

  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: data.url || '/admin/dashboard',
    actions: [
      {
        action: 'open',
        title: 'Open Dashboard',
      },
      {
        action: 'close',
        title: 'Close',
      },
    ],
    vibrate: [200, 100, 200],
    tag: 'admin-notification',
    renotify: true,
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'open') {
    event.waitUntil(self.clients.openWindow(event.notification.data || '/admin/dashboard'))
  }
})

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls)
      })
    )
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
      })
    )
  }
})
