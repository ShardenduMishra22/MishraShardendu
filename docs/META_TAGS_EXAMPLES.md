# Head Metadata Examples

## Complete HTML Head Template

This template includes all essential SEO meta tags, OpenGraph tags, Twitter Cards, and JSON-LD structured data.

### Next.js 15 App Router Example (metadata.ts)

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  // Basic Metadata
  title: {
    default: 'Shardendu Mishra | Software Engineer & Developer',
    template: '%s | Shardendu Mishra'
  },
  description: 'Portfolio of Shardendu Mishra - Software Engineer passionate about Go, AI, and building impactful tools. Explore projects, experience, and technical insights.',
  
  // Keywords
  keywords: [
    'Shardendu Mishra',
    'Software Engineer',
    'Web Developer',
    'Go Developer',
    'TypeScript',
    'React',
    'Next.js',
    'Portfolio',
    'AI',
    'Open Source'
  ],
  
  // Authors
  authors: [
    {
      name: 'Shardendu Mishra',
      url: 'https://mishrashardendu22.is-a.dev'
    }
  ],
  
  // Creator
  creator: 'Shardendu Mishra',
  publisher: 'Shardendu Mishra',
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/icons/icon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/icons/icon-16x16.png',
      },
    ],
  },
  
  // Manifest
  manifest: '/manifest.json',
  
  // OpenGraph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mishrashardendu22.is-a.dev/',
    siteName: 'Shardendu Mishra Portfolio',
    title: 'Shardendu Mishra | Software Engineer & Developer',
    description: 'Portfolio of Shardendu Mishra - Software Engineer passionate about Go, AI, and building impactful tools.',
    images: [
      {
        url: 'https://mishrashardendu22.is-a.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Shardendu Mishra Portfolio',
        type: 'image/png',
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Shardendu Mishra | Software Engineer & Developer',
    description: 'Portfolio of Shardendu Mishra - Software Engineer passionate about Go, AI, and building impactful tools.',
    creator: '@Shardendu_M',
    images: ['https://mishrashardendu22.is-a.dev/twitter-image.png'],
  },
  
  // Verification
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  
  // Alternate languages (if applicable)
  alternates: {
    canonical: 'https://mishrashardendu22.is-a.dev/',
    languages: {
      'en-US': 'https://mishrashardendu22.is-a.dev/',
      // Add more languages if needed
    },
  },
  
  // Other
  metadataBase: new URL('https://mishrashardendu22.is-a.dev'),
  category: 'technology',
};
```

### Static HTML Head Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Basic Meta Tags -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  
  <!-- SEO Meta Tags -->
  <title>Shardendu Mishra | Software Engineer & Developer</title>
  <meta name="description" content="Portfolio of Shardendu Mishra - Software Engineer passionate about Go, AI, and building impactful tools. Explore projects, experience, and technical insights.">
  <meta name="keywords" content="Shardendu Mishra, Software Engineer, Web Developer, Go, TypeScript, React, Next.js, Portfolio, AI">
  <meta name="author" content="Shardendu Mishra">
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://mishrashardendu22.is-a.dev/">
  
  <!-- Alternate Languages (if applicable) -->
  <link rel="alternate" hreflang="en" href="https://mishrashardendu22.is-a.dev/">
  <link rel="alternate" hreflang="x-default" href="https://mishrashardendu22.is-a.dev/">
  
  <!-- Robots -->
  <meta name="robots" content="index, follow">
  <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  
  <!-- OpenGraph Meta Tags -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://mishrashardendu22.is-a.dev/">
  <meta property="og:site_name" content="Shardendu Mishra Portfolio">
  <meta property="og:title" content="Shardendu Mishra | Software Engineer & Developer">
  <meta property="og:description" content="Portfolio of Shardendu Mishra - Software Engineer passionate about Go, AI, and building impactful tools.">
  <meta property="og:image" content="https://mishrashardendu22.is-a.dev/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Shardendu Mishra Portfolio">
  <meta property="og:locale" content="en_US">
  
  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@Shardendu_M">
  <meta name="twitter:creator" content="@Shardendu_M">
  <meta name="twitter:title" content="Shardendu Mishra | Software Engineer & Developer">
  <meta name="twitter:description" content="Portfolio of Shardendu Mishra - Software Engineer passionate about Go, AI, and building impactful tools.">
  <meta name="twitter:image" content="https://mishrashardendu22.is-a.dev/twitter-image.png">
  <meta name="twitter:image:alt" content="Shardendu Mishra Portfolio">
  
  <!-- Favicon and Icons -->
  <link rel="icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png">
  <link rel="apple-touch-icon" sizes="192x192" href="/apple-touch-icon.png">
  
  <!-- Manifest -->
  <link rel="manifest" href="/manifest.json">
  
  <!-- Theme Color -->
  <meta name="theme-color" content="#000000">
  <meta name="msapplication-TileColor" content="#000000">
  
  <!-- Search Engine Verification -->
  <meta name="google-site-verification" content="your-google-verification-code">
  <meta name="yandex-verification" content="your-yandex-verification-code">
  <meta name="msvalidate.01" content="your-bing-verification-code">
  
  <!-- DNS Prefetch and Preconnect -->
  <link rel="dns-prefetch" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Shardendu Mishra",
    "url": "https://mishrashardendu22.is-a.dev/",
    "image": "https://mishrashardendu22.is-a.dev/profile.jpg",
    "sameAs": [
      "https://www.linkedin.com/in/shardendumishra22/",
      "https://github.com/MishraShardendu22",
      "https://x.com/Shardendu_M",
      "https://leetcode.com/u/ShardenduMishra22/"
    ],
    "jobTitle": "Software Engineer",
    "worksFor": {
      "@type": "Organization",
      "name": "Self-Employed"
    },
    "description": "Software Engineer passionate about Go, AI, and building impactful tools."
  }
  </script>
  
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Shardendu Mishra",
    "url": "https://mishrashardendu22.is-a.dev/",
    "logo": "https://mishrashardendu22.is-a.dev/logo.png",
    "sameAs": [
      "https://www.linkedin.com/in/shardendumishra22/",
      "https://github.com/MishraShardendu22",
      "https://x.com/Shardendu_M",
      "https://leetcode.com/u/ShardenduMishra22/"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "mishrashardendu22@gmail.com",
      "contactType": "General Inquiry"
    }
  }
  </script>
</head>
<body>
  <!-- Your content here -->
</body>
</html>
```

## Blog Post Meta Tags Example

```html
<!-- Blog Post Specific -->
<title>Blog Post Title | Shardendu Mishra Blog</title>
<meta name="description" content="Blog post description under 160 characters">
<link rel="canonical" href="https://mishrashardendu22.is-a.dev/blog/post-slug">

<!-- OpenGraph for Blog Post -->
<meta property="og:type" content="article">
<meta property="og:url" content="https://mishrashardendu22.is-a.dev/blog/post-slug">
<meta property="og:title" content="Blog Post Title">
<meta property="og:description" content="Blog post description under 160 characters">
<meta property="og:image" content="https://mishrashardendu22.is-a.dev/blog/images/featured-image.jpg">
<meta property="article:published_time" content="2025-10-15T08:00:00+00:00">
<meta property="article:modified_time" content="2025-10-15T10:30:00+00:00">
<meta property="article:author" content="Shardendu Mishra">
<meta property="article:section" content="Web Development">
<meta property="article:tag" content="TypeScript">
<meta property="article:tag" content="React">

<!-- JSON-LD for Blog Post -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Blog Post Title",
  "description": "Blog post description under 160 characters",
  "image": "https://mishrashardendu22.is-a.dev/blog/images/featured-image.jpg",
  "author": {
    "@type": "Person",
    "name": "Shardendu Mishra",
    "url": "https://mishrashardendu22.is-a.dev/"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Shardendu Mishra",
    "logo": {
      "@type": "ImageObject",
      "url": "https://mishrashardendu22.is-a.dev/logo.png"
    }
  },
  "datePublished": "2025-10-15T08:00:00+00:00",
  "dateModified": "2025-10-15T10:30:00+00:00",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://mishrashardendu22.is-a.dev/blog/post-slug"
  },
  "keywords": ["TypeScript", "React", "Web Development"]
}
</script>
```

## Svelte Head Example (BlogWebsite)

```svelte
<script>
  import { page } from '$app/stores';
  
  const title = 'Shardendu Mishra Blog | Technical Articles';
  const description = 'Technical articles about web development, programming, and software engineering insights by Shardendu Mishra.';
  const canonicalUrl = `https://mishrashardendu22.is-a.dev/blog${$page.url.pathname}`;
  const imageUrl = 'https://mishrashardendu22.is-a.dev/blog/og-image.png';
</script>

<svelte:head>
  <!-- Basic Meta Tags -->
  <title>{title}</title>
  <meta name="description" content={description}>
  <link rel="canonical" href={canonicalUrl}>
  
  <!-- OpenGraph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content={canonicalUrl}>
  <meta property="og:title" content={title}>
  <meta property="og:description" content={description}>
  <meta property="og:image" content={imageUrl}>
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:creator" content="@Shardendu_M">
  <meta name="twitter:title" content={title}>
  <meta name="twitter:description" content={description}>
  <meta name="twitter:image" content={imageUrl}>
</svelte:head>
```

## Notes

- All meta descriptions should be unique and under 160 characters
- All title tags should be under 60 characters for optimal display
- Always include canonical URLs to prevent duplicate content issues
- Use absolute URLs for all og:image and twitter:image tags
- Include width and height for OpenGraph images (1200x630 recommended)
- Structured data should validate via Google's Rich Results Test
- Test OpenGraph tags using Facebook Sharing Debugger
- Test Twitter Cards using Twitter Card Validator
