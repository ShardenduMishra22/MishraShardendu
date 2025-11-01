export function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return false

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const isLowEndDevice = () => {
    if ('deviceMemory' in navigator && (navigator as any).deviceMemory < 4) {
      return true
    }
    if ('hardwareConcurrency' in navigator && (navigator as any).hardwareConcurrency < 4) {
      return true
    }
    return false
  }

  return prefersReducedMotion || isLowEndDevice()
}

export function applyReducedMotion() {
  if (typeof document === 'undefined') return

  if (shouldReduceMotion()) {
    document.body.classList.add('reduce-motion')
  }
}
