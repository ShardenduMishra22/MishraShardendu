/**
 * Mobile Performance Utilities
 * Helper functions to optimize performance on mobile devices
 */

/**
 * Detect if user is on a mobile device
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Detect if user is on a slow connection
 */
export const isSlowConnection = (): boolean => {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) return false

  const connection = (navigator as any).connection
  if (!connection) return false

  // Consider 3G and slower as slow
  const slowConnections = ['slow-2g', '2g', '3g']
  return slowConnections.includes(connection.effectiveType) || connection.saveData
}

/**
 * Get optimal image quality based on device and connection
 */
export const getOptimalImageQuality = (): number => {
  if (isSlowConnection()) return 60
  if (isMobileDevice()) return 75
  return 85
}

/**
 * Prefetch resources with priority based on connection
 */
export const prefetchWithPriority = (url: string, as: string = 'fetch') => {
  if (typeof document === 'undefined') return

  // Skip prefetch on slow connections
  if (isSlowConnection()) return

  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = url
  link.as = as

  document.head.appendChild(link)
}

/**
 * Defer non-critical resources
 */
export const deferNonCritical = (callback: () => void, delay: number = 0) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback)
  } else {
    setTimeout(callback, delay)
  }
}

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get safe viewport dimensions (excluding safe areas)
 */
export const getSafeViewport = () => {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 }
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

/**
 * Optimize animations for mobile
 */
export const getMobileAnimationConfig = () => {
  const reduced = prefersReducedMotion()
  const mobile = isMobileDevice()

  return {
    duration: reduced ? 0 : mobile ? 0.2 : 0.3,
    ease: mobile ? 'easeOut' : 'easeInOut',
    disabled: reduced,
  }
}

/**
 * Lazy load image with IntersectionObserver
 */
export const lazyLoadImage = (
  element: HTMLImageElement,
  src: string,
  options: IntersectionObserverInit = {}
) => {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.src = src
            observer.unobserve(element)
          }
        })
      },
      {
        rootMargin: isMobileDevice() ? '50px' : '100px',
        ...options,
      }
    )

    observer.observe(element)
    return () => observer.disconnect()
  } else {
    // Fallback for browsers without IntersectionObserver
    element.src = src
    return () => {}
  }
}

/**
 * Performance timing metrics
 */
export const getPerformanceMetrics = () => {
  if (typeof window === 'undefined' || !window.performance) {
    return null
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

  if (!navigation) return null

  return {
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    ttfb: navigation.responseStart - navigation.requestStart,
    download: navigation.responseEnd - navigation.responseStart,
    domInteractive: navigation.domInteractive - navigation.fetchStart,
    domComplete: navigation.domComplete - navigation.fetchStart,
    loadComplete: navigation.loadEventEnd - navigation.fetchStart,
  }
}

/**
 * Log performance metrics in development
 */
export const logPerformanceMetrics = () => {
  if (process.env.NODE_ENV !== 'development') return

  const metrics = getPerformanceMetrics()
  if (!metrics) return

  console.group('📊 Performance Metrics')
  console.log('DNS Lookup:', `${metrics.dns.toFixed(2)}ms`)
  console.log('TCP Connection:', `${metrics.tcp.toFixed(2)}ms`)
  console.log('TTFB:', `${metrics.ttfb.toFixed(2)}ms`)
  console.log('Download:', `${metrics.download.toFixed(2)}ms`)
  console.log('DOM Interactive:', `${metrics.domInteractive.toFixed(2)}ms`)
  console.log('DOM Complete:', `${metrics.domComplete.toFixed(2)}ms`)
  console.log('Load Complete:', `${metrics.loadComplete.toFixed(2)}ms`)
  console.groupEnd()
}
