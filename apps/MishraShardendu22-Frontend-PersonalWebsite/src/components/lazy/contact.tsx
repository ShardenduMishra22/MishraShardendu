'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useIntersectionObserver } from './obs'
import ContactSection from '../main/contact'
import { LoadingScreen } from '../chart/loader-chart'

export const LazyContactSection = () => {
  const [loaded, setLoaded] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const { hasBeenVisible } = useIntersectionObserver(sectionRef as React.RefObject<Element>, {
    threshold: 0.05,
    rootMargin: '200px',
  })

  useEffect(() => {
    if (hasBeenVisible && !loaded) {
      setLoaded(true)
    }
  }, [hasBeenVisible, loaded])

  return <div ref={sectionRef}>{loaded ? <ContactSection /> : <LoadingScreen />}</div>
}
