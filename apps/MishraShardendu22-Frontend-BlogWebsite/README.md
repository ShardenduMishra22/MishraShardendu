# Blog Website - Astro 5 Content Platform

High-performance blog platform with markdown support and advanced content management capabilities. Built with Astro 5 for optimal static site generation and server-side rendering.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Content Management](#content-management)
- [Development](#development)
- [Database Schema](#database-schema)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Performance](#performance)
- [SEO Optimization](#seo-optimization)
- [Testing](#testing)
- [Contributing](#contributing)

## Overview

The Blog Website is a high-performance content platform built with Astro 5, designed for optimal content delivery and user experience. It leverages Astro's partial hydration and island architecture to deliver minimal JavaScript while maintaining rich interactivity where needed.

**Key Characteristics**:
- Static site generation with on-demand server rendering
- Markdown and MDX support for flexible content authoring
- Partial hydration for optimal performance
- PostgreSQL database for structured content
- Rich text editing with TipTap
- SEO-optimized with meta tags and structured data

## Technology Stack

### Core Framework
- **Astro 5.14.4**: Modern static site builder with partial hydration
- **React 19.2.0**: UI library for interactive components
- **TypeScript 5.8**: Type-safe development experience

### Content Management
- **MDX**: Enhanced markdown with component support
- **TipTap**: Extensible rich text editor
- **remark**: Markdown processing
- **rehype**: HTML processing
- **@astrojs/mdx**: MDX integration for Astro

### Database & ORM
- **PostgreSQL 15+**: Relational database for blog content
- **Drizzle ORM**: Type-safe database operations
- **pg**: PostgreSQL client library

### Styling & UI
- **Tailwind CSS 4**: Utility-first CSS framework
- **shadcn/ui**: Component library adapted for Astro
- **Lucide React**: Icon library

### Additional Tools
- **Vercel Adapter**: Deployment optimization for Vercel
- **Sharp**: High-performance image processing
- **date-fns**: Date manipulation and formatting
- **zod**: Runtime type validation

## Features

### Content Authoring
- **Markdown Support**: Full GitHub Flavored Markdown (GFM) support
- **MDX Components**: Embed React components in markdown
- **Rich Text Editor**: TipTap-based WYSIWYG editor
- **Code Highlighting**: Syntax highlighting for code blocks
- **Image Optimization**: Automatic image optimization and lazy loading
- **Draft Management**: Save and preview drafts before publishing

### Content Organization
- **Category System**: Hierarchical content categorization
- **Tag Management**: Flexible tagging for content discovery
- **Search Functionality**: Full-text search across all content
- **Related Posts**: Automatic suggestion of related content
- **Content Series**: Link related posts in series
- **Table of Contents**: Auto-generated ToC for long posts

### Reader Experience
- **Reading Time**: Estimated reading time calculation
- **Progress Indicator**: Reading progress tracking
- **Comment System**: Threaded discussions on posts
- **Social Sharing**: Easy sharing on social platforms
- **RSS Feed**: Automatic RSS feed generation
- **Newsletter**: Email subscription integration

### SEO & Discovery
- **Meta Tags**: Comprehensive meta tag generation
- **Open Graph**: Rich social media previews
- **Schema.org**: Structured data markup
- **Sitemap**: Automatic sitemap generation
- **Robots.txt**: Crawl control configuration
- **Canonical URLs**: Duplicate content prevention

### Performance
- **Static Generation**: Pre-rendered pages for instant loading
- **Partial Hydration**: JavaScript only where needed
- **Image Optimization**: WebP/AVIF with responsive sizing
- **Code Splitting**: Minimal JavaScript per page
- **Edge Caching**: CDN-optimized delivery

## Architecture

### Directory Structure

```
src/
├── pages/                        # Astro pages (routes)
│   ├── index.astro              # Homepage
│   ├── blog/
│   │   ├── index.astro          # Blog listing
│   │   ├── [slug].astro         # Blog post page
│   │   ├── create.astro         # Create post (admin)
│   │   ├── edit/
│   │   │   └── [id].astro       # Edit post (admin)
│   │   └── category/
│   │       └── [category].astro # Category pages
│   ├── api/                     # API endpoints
│   │   ├── posts.ts             # Post operations
│   │   ├── comments.ts          # Comment operations
│   │   └── search.ts            # Search functionality
│   └── rss.xml.ts               # RSS feed generation
├── layouts/                      # Layout components
│   ├── BaseLayout.astro         # Base HTML layout
│   ├── BlogLayout.astro         # Blog post layout
│   └── MarkdownLayout.astro     # Markdown content layout
├── components/                   # Reusable components
│   ├── blog/                    # Blog-specific components
│   │   ├── BlogCard.astro       # Blog post card
│   │   ├── BlogList.astro       # Blog listing
│   │   ├── BlogNavigation.tsx   # Blog navigation (React)
│   │   └── CommentSection.tsx   # Comments (React)
│   ├── editor/                  # Editor components
│   │   └── MarkdownEditor.tsx   # TipTap editor (React)
│   ├── ui/                      # UI components
│   └── shared/                  # Shared components
├── content/                      # Content collections
│   ├── blog/                    # Blog posts (markdown)
│   └── config.ts                # Content collection config
├── lib/                         # Utility libraries
│   ├── db/                      # Database configuration
│   ├── utils.ts                 # Helper functions
│   └── markdown.ts              # Markdown processing
├── styles/                       # Global styles
│   └── global.css               # Global CSS
└── types/                        # TypeScript types

drizzle/                         # Database
├── migrations/                  # Migration files
└── schema.ts                    # Database schema

public/                          # Static assets
├── images/                      # Static images
├── fonts/                       # Web fonts
└── favicon.ico                  # Favicon
```

### Astro Islands Architecture

Astro uses an "islands architecture" where:
1. **Static HTML**: Most content rendered as static HTML
2. **Interactive Islands**: React components hydrated on demand
3. **Client Directives**: Control when components hydrate

```astro
<!-- Static content (no JavaScript) -->
<BlogCard post={post} />

<!-- Interactive island (hydrates on load) -->
<CommentSection client:load postId={post.id} />

<!-- Interactive island (hydrates when visible) -->
<RelatedPosts client:visible posts={related} />

<!-- Interactive island (hydrates on idle) -->
<Newsletter client:idle />
```

### Content Collections

Astro Content Collections provide type-safe content management:

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false)
  })
})

export const collections = { blog }
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PNPM >= 9.0.0
- PostgreSQL >= 15
- Git

### Installation

```bash
# Navigate to blog directory
cd apps/MishraShardendu22-Frontend-BlogWebsite

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env

# Configure database
pnpm db:generate
pnpm db:push

# (Optional) Seed with sample content
pnpm db:seed

# Start development server
pnpm dev
```

Access the application at `http://localhost:4321`

## Environment Configuration

Create a `.env` file with the following configuration:

### Database

```env
# PostgreSQL connection
DATABASE_URL="postgresql://username:password@localhost:5432/blog_db"
DIRECT_URL="postgresql://username:password@localhost:5432/blog_db"

# Database pool configuration
DB_POOL_MIN=2
DB_POOL_MAX=10
```

### Application

```env
# Site URL
SITE_URL="http://localhost:4321"
PUBLIC_SITE_URL="http://localhost:4321"

# API endpoints
API_BASE_URL="http://localhost:3000/api"
PUBLIC_API_BASE_URL="http://localhost:3000/api"
```

### Authentication

```env
# Auth tokens (if using admin features)
AUTH_SECRET="your-auth-secret-min-32-chars"
SESSION_TIMEOUT="86400"
```

### External Services

```env
# Email service (for notifications)
RESEND_API_KEY="re_your_key"
ADMIN_EMAIL="admin@yourdomain.com"

# Analytics
GOOGLE_ANALYTICS_ID="G-YOUR-ID"
PLAUSIBLE_DOMAIN="yourdomain.com"
```

### Content Configuration

```env
# Posts per page
POSTS_PER_PAGE=10

# Enable features
ENABLE_COMMENTS=true
ENABLE_SEARCH=true
ENABLE_RSS=true
```

## Content Management

### Writing Blog Posts

#### Markdown Files

Create markdown files in `src/content/blog/`:

```markdown
---
title: "Your Post Title"
description: "Brief description"
pubDate: 2025-01-15
author: "Your Name"
image: "/images/post-cover.jpg"
tags: ["typescript", "web-development"]
draft: false
---

# Your Post Content

Write your content here using **markdown** syntax.

## Code Examples

\`\`\`typescript
const example = "syntax highlighted code"
\`\`\`

## MDX Components

<CustomComponent prop="value" />
```

#### Using the Editor

Access the admin editor at `/blog/create`:

1. **Title & Meta**: Enter post metadata
2. **Content**: Use TipTap rich text editor
3. **Categories & Tags**: Organize content
4. **Preview**: Review before publishing
5. **Publish**: Make post live or save as draft

### Content Organization

**Categories**:
- Hierarchical structure for broad topics
- Each post can have one primary category
- Used for main navigation and filtering

**Tags**:
- Flexible labeling for specific topics
- Multiple tags per post
- Used for search and related posts

**Series**:
- Link related posts together
- Maintain reading order
- Useful for tutorials and multi-part content

## Development

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server (port 4321)
pnpm build            # Production build
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format with Prettier
pnpm typecheck        # TypeScript type checking

# Database
pnpm db:generate      # Generate migrations
pnpm db:push          # Apply migrations
pnpm db:studio        # Open Drizzle Studio
pnpm db:seed          # Seed database

# Content
pnpm content:validate # Validate content collections
pnpm sitemap:generate # Generate sitemap

# Testing
pnpm test             # Run tests
pnpm test:e2e         # E2E tests
```

### Development Workflow

1. **Creating New Posts**:
   ```bash
   # Create markdown file
   touch src/content/blog/my-new-post.md
   
   # Or use the web editor
   # Navigate to /blog/create
   ```

2. **Adding Components**:
   ```bash
   # Create Astro component (static)
   touch src/components/MyComponent.astro
   
   # Create React component (interactive)
   touch src/components/MyComponent.tsx
   ```

3. **Styling**:
   - Use Tailwind utility classes
   - Create component-specific styles
   - Maintain global styles in `src/styles/`

### Hot Module Replacement

Astro provides fast HMR for development:
- Astro components: Instant updates
- React components: Preserves state
- Styles: Immediate application
- Content: Automatic rebuild

## Database Schema

### Posts Table

```typescript
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  description: text('description'),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  coverImage: varchar('cover_image', { length: 500 }),
  authorId: integer('author_id').references(() => users.id),
  categoryId: integer('category_id').references(() => categories.id),
  status: varchar('status', { length: 20 }).default('draft'),
  featured: boolean('featured').default(false),
  viewCount: integer('view_count').default(0),
  readTime: integer('read_time'),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})
```

### Categories Table

```typescript
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  description: text('description'),
  parentId: integer('parent_id').references(() => categories.id),
  displayOrder: integer('display_order'),
  createdAt: timestamp('created_at').defaultNow()
})
```

### Tags Table

```typescript
export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  slug: varchar('slug', { length: 50 }).unique().notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow()
})

export const postTags = pgTable('post_tags', {
  postId: integer('post_id').references(() => posts.id),
  tagId: integer('tag_id').references(() => tags.id)
})
```

### Comments Table

```typescript
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').references(() => posts.id),
  authorId: integer('author_id').references(() => users.id),
  parentId: integer('parent_id').references(() => comments.id),
  content: text('content').notNull(),
  approved: boolean('approved').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})
```

## API Integration

### Server Endpoints

```typescript
// GET /api/posts - List posts
export async function GET({ url }) {
  const page = url.searchParams.get('page') || '1'
  const limit = url.searchParams.get('limit') || '10'
  
  const posts = await db.query.posts.findMany({
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit),
    where: eq(posts.status, 'published'),
    orderBy: desc(posts.publishedAt)
  })
  
  return new Response(JSON.stringify(posts), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

// POST /api/posts - Create post
export async function POST({ request }) {
  const data = await request.json()
  
  const [post] = await db.insert(posts)
    .values(data)
    .returning()
  
  return new Response(JSON.stringify(post), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  })
}
```

### Client-side Data Fetching

```typescript
// Fetch posts in React component
async function fetchPosts(page = 1) {
  const response = await fetch(
    `${import.meta.env.PUBLIC_API_BASE_URL}/posts?page=${page}`
  )
  return response.json()
}
```

## Deployment

### Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
pnpm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Build Configuration

```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config'
import vercel from '@astrojs/vercel/serverless'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [react(), tailwind(), mdx()],
  site: 'https://yourdomain.com'
})
```

### Environment Variables

Add environment variables in Vercel dashboard:
1. Project Settings > Environment Variables
2. Add all variables from `.env`
3. Set appropriate scope (Production/Preview/Development)

### Custom Domain

1. Add domain in Vercel dashboard
2. Update DNS records
3. Configure SSL (automatic)

## Performance

### Optimization Techniques

**Static Generation**:
- Pre-render all blog posts at build time
- Generate static HTML for listing pages
- Serve from CDN for global performance

**Partial Hydration**:
- Only interactive components load JavaScript
- Reduces initial JavaScript bundle significantly
- Faster Time to Interactive (TTI)

**Image Optimization**:
```astro
<Image
  src="/images/cover.jpg"
  alt="Post cover"
  width={1200}
  height={630}
  format="webp"
  quality={80}
  loading="lazy"
/>
```

**Code Splitting**:
- Automatic per-route code splitting
- Dynamic imports for heavy components
- Minimal shared chunks

### Performance Metrics

Target metrics:
- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.0s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## SEO Optimization

### Meta Tags

```astro
<head>
  <title>{title}</title>
  <meta name="description" content={description} />
  
  <!-- Open Graph -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <meta property="og:type" content="article" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
  
  <!-- Schema.org -->
  <script type="application/ld+json">
    {JSON.stringify(schemaMarkup)}
  </script>
</head>
```

### Sitemap Generation

Automatic sitemap generation for all posts:

```typescript
// src/pages/sitemap.xml.ts
import { getCollection } from 'astro:content'

export async function GET() {
  const posts = await getCollection('blog')
  const sitemap = generateSitemap(posts)
  
  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' }
  })
}
```

### RSS Feed

```typescript
// src/pages/rss.xml.ts
import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

export async function GET(context) {
  const posts = await getCollection('blog')
  
  return rss({
    title: 'Blog Title',
    description: 'Blog description',
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.slug}`
    }))
  })
}
```

## Testing

### Unit Tests

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

### E2E Tests

```bash
# Run E2E tests
pnpm test:e2e

# Specific test
pnpm test:e2e tests/blog-post.spec.ts
```

### Testing Stack

- **Vitest**: Unit testing framework
- **Testing Library**: Component testing
- **Playwright**: E2E testing
- **MSW**: API mocking

## Contributing

For contribution guidelines, see [CONTRIBUTING.md](../../docs/CONTRIBUTING.md).

### Quick Guidelines

1. Follow Astro and React best practices
2. Write tests for new features
3. Use TypeScript for type safety
4. Document components and functions
5. Ensure accessibility compliance

## Support

For support and questions:
- **Issues**: [GitHub Issues](https://github.com/MishraShardendu22/MishraShardendu/issues)
- **Documentation**: [Root Docs](../../docs)
- **Email**: mishrashardendu22@gmail.com

## License

Part of the MishraShardendu monorepo. Licensed under the MIT License.
