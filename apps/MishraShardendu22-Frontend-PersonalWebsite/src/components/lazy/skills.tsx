'use client'

import { useEffect, useRef, useState } from 'react'
import { useIntersectionObserver } from './obs'
import { SkillsDataLoader } from '../extra/SkillsDataLoader'
import { SkillsSkeleton } from '../main/loading'

export const LazySkillsSection = () => {
  const [loaded, setLoaded] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const { hasBeenVisible } = useIntersectionObserver(sectionRef as React.RefObject<Element>, {
    threshold: 0.1,
    rootMargin: '100px',
  })

  useEffect(() => {
    if (hasBeenVisible && !loaded) {
      setLoaded(true)
    }
  }, [hasBeenVisible, loaded])

  return <div ref={sectionRef}>{loaded ? <SkillsDataLoader /> : <SkillsSkeleton />}</div>
}
