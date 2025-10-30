import Script from 'next/script'

/**
 * Resource hints for performance optimization
 * Preconnects to critical third-party origins
 */
export default function ResourceHints() {
  return (
    <>
      {/* Preconnect to critical origins */}
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://vercel.live" crossOrigin="anonymous" />

      {/* DNS prefetch for other origins */}
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

      {/* Preload critical assets */}
      <link rel="preload" href="/Professional.webp" as="image" type="image/webp" />
    </>
  )
}
