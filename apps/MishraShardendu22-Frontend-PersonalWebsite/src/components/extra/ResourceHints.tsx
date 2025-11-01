import Script from 'next/script'

/**
 * Resource hints for performance optimization
 * Preconnects to critical third-party origins
 * Optimized for mobile performance
 */
export default function ResourceHints() {
  return (
    <>
      {/* Preconnect to critical origins */}
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* DNS prefetch for analytics - deferred for mobile */}
      <link rel="dns-prefetch" href="https://vercel.live" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

      {/* Preload critical LCP image with high priority for mobile */}
      <link
        rel="preload"
        href="/Professional.webp"
        as="image"
        type="image/webp"
        fetchPriority="high"
      />

      {/* Mobile viewport optimization */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover"
      />

      {/* Reduce layout shift by defining color scheme early */}
      <meta name="color-scheme" content="dark light" />

      {/* Performance hints for browser */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
    </>
  )
}
