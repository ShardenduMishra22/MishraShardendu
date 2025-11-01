'use client'

import { useEffect, useRef, useState } from 'react'
import { useIntersectionObserver } from './obs'
import { SkillsDataLoader } from '../extra/SkillsDataLoader'
import { SkillsSkeleton } from '../main/loading'

export const LazySkillsSection = () => {
  const [loaded, setLoaded] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const { hasBeenVisible } = useIntersectionObserver(sectionRef as React.RefObject<Element>, {
    threshold: 0.05,
    rootMargin: '200px',
  })

  useEffect(() => {
    if (hasBeenVisible && !loaded) {
      // Defer loading slightly to reduce blocking time
      const timeout = setTimeout(() => {
        setLoaded(true)
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [hasBeenVisible, loaded])

  return (
    <div ref={sectionRef} style={{ minHeight: '400px' }}>
      {loaded ? <SkillsDataLoader /> : <SkillsSkeleton />}
    </div>
  )
}
