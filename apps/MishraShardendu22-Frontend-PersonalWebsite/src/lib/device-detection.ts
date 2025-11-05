/**
 * Device Detection Utility for Performance Optimization
 * Used to conditionally load heavy libraries only on capable devices
 */

export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export const isLowEndDevice = (): boolean => {
  if (typeof window === 'undefined') return false

  // Check device memory (< 4GB is considered low-end)
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  if (deviceMemory && deviceMemory < 4) return true

  // Check hardware concurrency (< 4 cores is considered low-end)
  const hardwareConcurrency = navigator.hardwareConcurrency
  if (hardwareConcurrency && hardwareConcurrency < 4) return true

  // Check connection quality
  const connection = (navigator as Navigator & { connection?: { effectiveType?: string } })
    .connection
  if (connection && connection.effectiveType) {
    const slowConnections = ['slow-2g', '2g', '3g']
    if (slowConnections.includes(connection.effectiveType)) return true
  }

  return false
}

export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const shouldLoadHeavyLibraries = (): boolean => {
  return !isMobile() && !isLowEndDevice() && !shouldReduceMotion()
}

export const getPerformanceTier = (): 'high' | 'medium' | 'low' => {
  if (typeof window === 'undefined') return 'low'

  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  const hardwareConcurrency = navigator.hardwareConcurrency

  if ((deviceMemory && deviceMemory >= 8) || (hardwareConcurrency && hardwareConcurrency >= 8)) {
    return 'high'
  }

  if ((deviceMemory && deviceMemory >= 4) || (hardwareConcurrency && hardwareConcurrency >= 4)) {
    return 'medium'
  }

  return 'low'
}
