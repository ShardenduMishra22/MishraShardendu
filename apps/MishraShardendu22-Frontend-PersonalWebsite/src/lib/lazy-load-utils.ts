/**
 * Mobile-Optimized Lazy Loading Utilities
 *
 * Enhanced intersection observer with mobile-specific optimizations:
 * - Aggressive preloading on good connections
 * - Conservative loading on slow connections
 * - Priority-based loading queue
 * - requestIdleCallback for non-critical work
 */

import { useEffect, useRef, useState, useCallback } from 'react'

export interface LazyLoadOptions {
  /** Root margin for intersection observer (mobile-optimized defaults) */
  rootMargin?: string
  /** Threshold for visibility (0-1) */
  threshold?: number | number[]
  /** Priority level for loading (higher = sooner) */
  priority?: 'high' | 'medium' | 'low'
  /** Enable preloading on fast connections */
  enableSmartPreload?: boolean
  /** Disable on slow connections */
  disableOnSlowConnection?: boolean
}

/**
 * Get connection speed category
 */
function getConnectionSpeed(): 'fast' | 'medium' | 'slow' {
  if (typeof navigator === 'undefined') return 'medium'

  const connection =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection

  if (!connection) return 'medium'

  const effectiveType = connection.effectiveType

  if (effectiveType === '4g') return 'fast'
  if (effectiveType === '3g') return 'medium'
  return 'slow'
}

/**
 * Get optimal root margin based on connection speed and device
 */
function getOptimalRootMargin(
  priority: 'high' | 'medium' | 'low',
  connectionSpeed: 'fast' | 'medium' | 'slow'
): string {
  // Mobile detection
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  // Aggressive preloading on fast connections
  if (connectionSpeed === 'fast') {
    if (priority === 'high') return '400px'
    if (priority === 'medium') return '300px'
    return '200px'
  }

  // Conservative loading on slow connections
  if (connectionSpeed === 'slow') {
    if (priority === 'high') return '100px'
    return '50px'
  }

  // Medium connection - balanced approach
  if (isMobile) {
    if (priority === 'high') return '200px'
    if (priority === 'medium') return '150px'
    return '100px'
  }

  // Desktop with medium connection
  if (priority === 'high') return '300px'
  if (priority === 'medium') return '200px'
  return '100px'
}

/**
 * Enhanced Intersection Observer Hook with Mobile Optimization
 */
export function useOptimizedIntersectionObserver(
  ref: React.RefObject<Element>,
  options: LazyLoadOptions = {}
) {
  const {
    priority = 'medium',
    threshold = 0.1,
    enableSmartPreload = true,
    disableOnSlowConnection = false,
    rootMargin: customRootMargin,
  } = options

  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Check connection speed
    const connectionSpeed = getConnectionSpeed()

    // Skip loading on slow connections if disabled
    if (disableOnSlowConnection && connectionSpeed === 'slow') {
      return
    }

    // Get optimal root margin
    const rootMargin = enableSmartPreload
      ? customRootMargin || getOptimalRootMargin(priority, connectionSpeed)
      : customRootMargin || '100px'

    // Create observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsIntersecting(entry.isIntersecting)
          if (entry.isIntersecting && !hasBeenVisible) {
            setHasBeenVisible(true)
          }
        })
      },
      {
        rootMargin,
        threshold,
      }
    )

    observerRef.current.observe(element)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [
    ref,
    priority,
    threshold,
    enableSmartPreload,
    disableOnSlowConnection,
    customRootMargin,
    hasBeenVisible,
  ])

  return { isIntersecting, hasBeenVisible }
}

/**
 * Request Idle Callback Wrapper
 * Execute non-critical work during browser idle time
 */
export function useIdleCallback(callback: () => void, options: { timeout?: number } = {}) {
  const { timeout = 2000 } = options

  useEffect(() => {
    if (typeof window === 'undefined') return

    let idleCallbackId: number

    if ('requestIdleCallback' in window) {
      idleCallbackId = requestIdleCallback(callback, { timeout })
    } else {
      // Fallback for browsers without requestIdleCallback
      const timeoutId = setTimeout(callback, timeout)
      return () => clearTimeout(timeoutId)
    }

    return () => {
      if (idleCallbackId) {
        cancelIdleCallback(idleCallbackId)
      }
    }
  }, [callback, timeout])
}

/**
 * Priority-based Loading Queue
 * Ensures high-priority content loads first on mobile
 */
class LoadingQueue {
  private queue: Array<{ priority: number; callback: () => void }> = []
  private processing = false

  add(callback: () => void, priority: 'high' | 'medium' | 'low' = 'medium') {
    const priorityValue = priority === 'high' ? 3 : priority === 'medium' ? 2 : 1

    this.queue.push({ priority: priorityValue, callback })
    this.queue.sort((a, b) => b.priority - a.priority)

    if (!this.processing) {
      this.process()
    }
  }

  private async process() {
    if (this.queue.length === 0) {
      this.processing = false
      return
    }

    this.processing = true
    const item = this.queue.shift()

    if (item) {
      // Use requestIdleCallback for better mobile performance
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          item.callback()
          this.process()
        })
      } else {
        // Fallback
        setTimeout(() => {
          item.callback()
          this.process()
        }, 0)
      }
    }
  }
}

export const loadingQueue = new LoadingQueue()

/**
 * Hook to defer loading until idle
 */
export function useDeferredLoad(
  callback: () => void,
  deps: React.DependencyList,
  priority: 'high' | 'medium' | 'low' = 'medium'
) {
  const hasLoaded = useRef(false)

  useEffect(() => {
    if (hasLoaded.current) return

    loadingQueue.add(() => {
      callback()
      hasLoaded.current = true
    }, priority)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/**
 * Prefetch component on hover (for better perceived performance)
 */
export function usePrefetchOnHover(prefetchCallback: () => void, enabled = true) {
  const [isPrefetched, setIsPrefetched] = useState(false)

  const handleMouseEnter = useCallback(() => {
    if (!enabled || isPrefetched) return

    // Only prefetch on fast connections
    const connectionSpeed = getConnectionSpeed()
    if (connectionSpeed === 'slow') return

    // Use requestIdleCallback to avoid blocking
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        prefetchCallback()
        setIsPrefetched(true)
      })
    } else {
      setTimeout(() => {
        prefetchCallback()
        setIsPrefetched(true)
      }, 100)
    }
  }, [enabled, isPrefetched, prefetchCallback])

  return { handleMouseEnter, isPrefetched }
}
