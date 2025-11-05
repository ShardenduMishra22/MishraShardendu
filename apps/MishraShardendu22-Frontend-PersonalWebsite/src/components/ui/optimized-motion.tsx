/**
 * Mobile-Optimized Motion Components
 * Conditionally loads framer-motion only on capable devices
 * Falls back to CSS animations on mobile for better performance
 */

'use client'

import { useEffect, useState } from 'react'
import { shouldLoadHeavyLibraries } from '@/lib/device-detection'

type MotionDivProps = React.HTMLAttributes<HTMLDivElement> & {
  initial?: any
  animate?: any
  exit?: any
  transition?: any
  whileHover?: any
  whileTap?: any
  variants?: any
}

// CSS-based motion fallback for mobile
const CSSMotionDiv = ({ children, className, whileHover, ...props }: MotionDivProps) => {
  return (
    <div className={`${className || ''} ${whileHover ? 'hover-scale' : ''}`} {...props}>
      {children}
      <style jsx>{`
        .hover-scale {
          transition: transform 0.2s ease-in-out;
        }
        .hover-scale:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  )
}

// Lazy-loaded framer-motion component
const HeavyMotionDiv = ({ children, ...props }: MotionDivProps) => {
  const [Component, setComponent] = useState<any>(null)

  useEffect(() => {
    import('framer-motion').then((mod) => {
      setComponent(() => mod.motion.div)
    })
  }, [])

  if (!Component) return <div className={props.className}>{children}</div>
  return <Component {...props}>{children}</Component>
}

// Smart motion component that chooses based on device capability
export const OptimizedMotionDiv = (props: MotionDivProps) => {
  const [useHeavyLibraries, setUseHeavyLibraries] = useState<boolean | null>(null)

  useEffect(() => {
    setUseHeavyLibraries(shouldLoadHeavyLibraries())
  }, [])

  // During SSR and initial render, use CSS fallback
  if (useHeavyLibraries === null) {
    return <CSSMotionDiv {...props} />
  }

  return useHeavyLibraries ? <HeavyMotionDiv {...props} /> : <CSSMotionDiv {...props} />
}

// AnimatePresence fallback
export const OptimizedAnimatePresence = ({ children }: { children: React.ReactNode }) => {
  const [useHeavyLibraries, setUseHeavyLibraries] = useState<boolean | null>(null)
  const [Component, setComponent] = useState<any>(null)

  useEffect(() => {
    const shouldUse = shouldLoadHeavyLibraries()
    setUseHeavyLibraries(shouldUse)

    if (shouldUse) {
      import('framer-motion').then((mod) => {
        setComponent(() => mod.AnimatePresence)
      })
    }
  }, [])

  if (useHeavyLibraries && Component) {
    return <Component>{children}</Component>
  }

  // Fallback for mobile - simple conditional rendering
  return <>{children}</>
}

// Export types for TypeScript
export type { MotionDivProps }
