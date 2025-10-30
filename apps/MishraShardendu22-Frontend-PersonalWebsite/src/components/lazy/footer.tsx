'use client'

import { useEffect, useRef, useState } from 'react'
import { useIntersectionObserver } from './obs'
import FooterSection from '../main/FooterSection'

export const LazyFooterSection = () => {
  const [loaded, setLoaded] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const { hasBeenVisible } = useIntersectionObserver(sectionRef as React.RefObject<Element>, {
    threshold: 0.01,
    rootMargin: '300px',
  })

  useEffect(() => {
    if (hasBeenVisible && !loaded) {
      setLoaded(true)
    }
  }, [hasBeenVisible, loaded])

  return (
    <div ref={sectionRef}>
      {loaded ? (
        <FooterSection />
      ) : (
        <div className="min-h-[400px] flex items-center justify-center bg-muted">
          <div className="animate-pulse text-foreground/70 font-medium">Loading footer...</div>
        </div>
      )}
    </div>
  )
}
