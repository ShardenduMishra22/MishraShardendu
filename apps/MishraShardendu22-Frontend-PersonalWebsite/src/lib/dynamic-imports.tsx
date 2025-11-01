/**
 * Dynamic Imports for Heavy Components
 *
 * This file provides dynamically imported versions of heavy libraries
 * to reduce initial bundle size and improve TBT/LCP on mobile
 *
 * Libraries split:
 * - framer-motion: ~100KB
 * - three.js/@react-three/fiber: ~500KB
 * - @tsparticles: ~80KB
 * - recharts: ~150KB
 * - @nivo: ~200KB
 *
 * Total savings: ~1MB+ on initial load
 */

import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

/**
 * Loading Skeleton Component
 */
const LoadingSkeleton = () => <div className="animate-pulse bg-muted rounded-lg h-64 w-full" />

/**
 * Framer Motion Components - Dynamic Import
 * Only load when animations are actually needed
 */
export const DynamicMotion = {
  div: dynamic(() => import('framer-motion').then((mod) => mod.motion.div), {
    ssr: false,
    loading: () => <div />,
  }),
  section: dynamic(() => import('framer-motion').then((mod) => mod.motion.section), {
    ssr: false,
    loading: () => <section />,
  }),
  span: dynamic(() => import('framer-motion').then((mod) => mod.motion.span), {
    ssr: false,
    loading: () => <span />,
  }),
}

/**
 * Three.js Canvas - Dynamic Import
 * ~500KB - only load when 3D visualization is needed
 */
export const DynamicCanvas = dynamic(() => import('@react-three/fiber').then((mod) => mod.Canvas), {
  ssr: false,
  loading: () => <LoadingSkeleton />,
})

/**
 * Particles - Dynamic Import
 * ~80KB - only load when particle effects are visible
 */
export const DynamicParticles = dynamic(() => import('@tsparticles/react'), {
  ssr: false,
  loading: () => null,
})

/**
 * Chart Components - Dynamic Import
 * Only load chart library when charts are in viewport
 */

// Nivo Charts (recharts not in dependencies)
export const DynamicNivoLine = dynamic(
  () => import('@nivo/line').then((mod) => mod.ResponsiveLine),
  {
    ssr: false,
    loading: () => <LoadingSkeleton />,
  }
)

export const DynamicNivoBar = dynamic(() => import('@nivo/bar').then((mod) => mod.ResponsiveBar), {
  ssr: false,
  loading: () => <LoadingSkeleton />,
})

export const DynamicNivoPie = dynamic(() => import('@nivo/pie').then((mod) => mod.ResponsivePie), {
  ssr: false,
  loading: () => <LoadingSkeleton />,
})

/**
 * Heavy UI Components - Dynamic Import
 */
export const DynamicHeroParallax = dynamic(
  () => import('@/components/ui/hero-parallax').then((mod) => mod.HeroParallax),
  {
    ssr: false,
    loading: () => <LoadingSkeleton />,
  }
)

export const DynamicCanvasReveal = dynamic(
  () => import('@/components/ui/canvas-reveal-effect').then((mod) => mod.CanvasRevealEffect),
  {
    ssr: false,
    loading: () => <LoadingSkeleton />,
  }
)

export const DynamicSparkles = dynamic(
  () => import('@/components/ui/sparkles').then((mod) => mod.SparklesCore),
  {
    ssr: false,
    loading: () => null,
  }
)

/**
 * Utility: Check if device is low-end
 * Used to disable heavy animations on mobile
 */
export function isLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false

  const memory = (navigator as any).deviceMemory
  const cores = navigator.hardwareConcurrency

  // Consider device low-end if:
  // - Less than 4GB RAM
  // - Less than 4 CPU cores
  // - User prefers reduced motion
  const isLowMemory = memory && memory < 4
  const isLowCPU = cores && cores < 4
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return isLowMemory || isLowCPU || prefersReducedMotion
}

/**
 * Utility: Conditionally load component based on device capability
 */
export function createConditionalDynamicImport<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T } | T>,
  Fallback?: ComponentType<any>
): ComponentType<any> {
  if (typeof window !== 'undefined' && isLowEndDevice()) {
    return Fallback || (() => null)
  }

  return dynamic(() => importFunc() as any, {
    ssr: false,
    loading: () => (Fallback ? <Fallback /> : null),
  }) as any
}
