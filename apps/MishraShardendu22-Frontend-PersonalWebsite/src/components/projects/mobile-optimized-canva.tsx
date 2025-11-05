/**
 * Mobile-Optimized Canvas Card Component
 * Uses CSS animations instead of Three.js for better mobile performance
 * Reduces JavaScript bundle by ~500KB on mobile devices
 */

'use client'

import { useState, useEffect } from 'react'
import { Dribbble } from 'lucide-react'
import { shouldLoadHeavyLibraries } from '@/lib/device-detection'

// CSS-based reveal effect for mobile (no Three.js)
const CSSRevealEffect = ({ colors, className }: { colors: number[][]; className?: string }) => {
  const primaryColor = colors[0]
    ? `rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})`
    : 'rgb(0, 255, 255)'

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 animate-gradient-shift"
        style={{
          background: `radial-gradient(circle at center, ${primaryColor}22 0%, transparent 70%)`,
          animation: 'pulse 2s ease-in-out infinite',
        }}
      />
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
    </div>
  )
}

// Lazy load the heavy Three.js component only on desktop
const HeavyCanvasRevealEffect = ({ canvasProps }: { canvasProps: any }) => {
  const [Component, setComponent] = useState<any>(null)

  useEffect(() => {
    import('../ui/canvas-reveal-effect').then((mod) => {
      setComponent(() => mod.CanvasRevealEffect)
    })
  }, [])

  if (!Component) return null
  return <Component {...canvasProps} />
}

export const MobileOptimizedCanvasCard = ({
  title,
  icon,
  children,
  canvasProps,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  canvasProps: {
    animationSpeed: number
    containerClassName: string
    colors: number[][]
    dotSize: number
  }
}) => {
  const [hovered, setHovered] = useState(false)
  const [useHeavyLibraries, setUseHeavyLibraries] = useState(false)

  useEffect(() => {
    setUseHeavyLibraries(shouldLoadHeavyLibraries())
  }, [])

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border border-border/50 group/canvas-card flex flex-col justify-between dark:border-white/20 w-full relative h-auto min-h-[200px] rounded-xl overflow-hidden bg-white dark:bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="absolute h-4 w-4 -top-2 -left-2 dark:text-white text-primary opacity-30">
        <Dribbble className="h-full w-full" />
      </div>
      <div className="absolute h-4 w-4 -bottom-2 -right-2 dark:text-white text-primary opacity-30">
        <Dribbble className="h-full w-full" />
      </div>

      {/* Conditional rendering based on device capability */}
      {hovered && (
        <div className="h-full w-full absolute inset-0">
          {useHeavyLibraries ? (
            <HeavyCanvasRevealEffect canvasProps={canvasProps} />
          ) : (
            <CSSRevealEffect
              colors={canvasProps.colors}
              className={canvasProps.containerClassName}
            />
          )}
        </div>
      )}

      <div className="relative z-20 p-6 flex flex-col justify-between h-full">
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-primary group-hover/canvas-card:text-white transition-colors duration-200">
              {icon}
            </div>
            <h3 className="text-lg font-semibold text-foreground group-hover/canvas-card:text-white transition-colors duration-200">
              {title}
            </h3>
          </div>
        </div>

        <div className="text-foreground group-hover/canvas-card:text-white transition-colors duration-200">
          {children}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        .bg-grid-pattern {
          background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  )
}
