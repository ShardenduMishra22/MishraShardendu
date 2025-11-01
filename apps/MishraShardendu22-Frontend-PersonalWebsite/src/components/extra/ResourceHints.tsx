export default function ResourceHints() {
  return (
    <>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover"
      />

      <meta name="color-scheme" content="dark light" />

      <meta httpEquiv="x-dns-prefetch-control" content="on" />

      <link
        rel="preload"
        as="image"
        href="/Professional.webp"
        type="image/webp"
        fetchPriority="high"
        media="(max-width: 640px)"
        imageSrcSet="/Professional.webp 280w"
        imageSizes="280px"
      />
      <link
        rel="preload"
        as="image"
        href="/Professional.webp"
        type="image/webp"
        fetchPriority="high"
        media="(min-width: 641px) and (max-width: 1024px)"
        imageSrcSet="/Professional.webp 400w"
        imageSizes="400px"
      />
    </>
  )
}
