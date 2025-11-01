/**
 * OptimizedImage Component
 *
 * Mobile-first image component with:
 * - Automatic format selection (AVIF/WebP)
 * - Responsive sizing with mobile breakpoints
 * - Lazy loading with intersection observer
 * - Blur placeholder for better perceived performance
 * - Priority loading for above-the-fold images
 */

import Image, { ImageProps } from 'next/image'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  priority?: boolean
  /** Mobile-first responsive sizes */
  mobileSizes?: string
  /** Blur placeholder data URL (optional) */
  blurDataURL?: string
  /** Custom class for wrapper div */
  wrapperClassName?: string
  /** Enable fade-in animation on load */
  fadeIn?: boolean
}

/**
 * OptimizedImage Component
 *
 * Uses mobile-first responsive images with automatic format detection
 * and optimized loading strategies
 */
export function OptimizedImage({
  src,
  alt,
  priority = false,
  className,
  wrapperClassName,
  mobileSizes,
  sizes: customSizes,
  blurDataURL,
  fadeIn = true,
  quality = 85,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(priority)

  // Default mobile-first sizes if not provided
  const defaultSizes =
    mobileSizes || customSizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'

  useEffect(() => {
    if (priority || !('IntersectionObserver' in window)) {
      setIsInView(true)
      return
    }

    // Lazy load images that are not priority
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
    )

    const element = document.getElementById(`img-${src}`)
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [priority, src])

  return (
    <div id={`img-${src}`} className={cn('relative overflow-hidden', wrapperClassName)}>
      {isInView && (
        <Image
          src={src}
          alt={alt}
          className={cn(
            'transition-opacity duration-300',
            fadeIn && !isLoaded && 'opacity-0',
            fadeIn && isLoaded && 'opacity-100',
            className
          )}
          sizes={defaultSizes}
          quality={quality}
          priority={priority}
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
          onLoad={() => setIsLoaded(true)}
          loading={priority ? 'eager' : 'lazy'}
          {...props}
        />
      )}
      {!isInView && <div className={cn('bg-muted animate-pulse', className)} />}
    </div>
  )
}

/**
 * Utility function to generate blur placeholder data URL
 * Use this for static images to improve perceived performance
 */
export function generateBlurDataURL(width = 10, height = 10): string {
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null
  if (!canvas) return ''

  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, 'rgba(0,0,0,0.1)')
  gradient.addColorStop(1, 'rgba(0,0,0,0.05)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  return canvas.toDataURL()
}
