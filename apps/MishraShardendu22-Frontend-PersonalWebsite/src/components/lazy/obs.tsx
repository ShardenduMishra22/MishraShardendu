'use client'

import { useEffect, useState, useMemo } from 'react'

export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)

  // Mobile-optimized settings - detect once on mount, not on every render
  const observerOptions = useMemo(() => {
    const mobile = typeof window !== 'undefined' && window.innerWidth < 768
    return {
      threshold: mobile ? 0.05 : 0.1, // Lower threshold on mobile for earlier loading
      rootMargin: mobile ? '50px' : '100px', // Smaller margin on mobile to save bandwidth
      ...options,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array - only calculate once on mount

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
