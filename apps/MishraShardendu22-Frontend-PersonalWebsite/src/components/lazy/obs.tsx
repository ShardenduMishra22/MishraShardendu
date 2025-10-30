'use client'

import { useEffect, useState, useMemo } from 'react'

// Detect if user is on mobile for different thresholds
const isMobile = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)

  // Mobile-optimized settings
  const observerOptions = useMemo(() => {
    const mobile = isMobile()
    return {
      threshold: mobile ? 0.05 : 0.1, // Lower threshold on mobile for earlier loading
      rootMargin: mobile ? '50px' : '100px', // Smaller margin on mobile to save bandwidth
      ...options,
    }
  }, [options])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
      if (entry.isIntersecting && !hasBeenVisible) {
        setHasBeenVisible(true)
        // Disconnect after first visibility to reduce observer overhead on mobile
        observer.disconnect()
      }
    }, observerOptions)

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, hasBeenVisible, observerOptions])

  return { isVisible, hasBeenVisible }
}
