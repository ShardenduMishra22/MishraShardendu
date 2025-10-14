# Blog Website 404 Fix - Deployment Configuration

## Problem
The blog website was deploying successfully but showing 404 errors in production at `blog.mishrashardendu22.is-a.dev`. This was working fine locally but not in production.

## Root Cause
The issue was caused by a mismatch between the Vite build configuration and Vercel routing:

1. **Vite Config**: Had `base: '/blog'` hardcoded, which was meant for microfrontend integration
2. **Vercel Config**: Was trying to rewrite `/blog/*` to `/blog/index.html`, creating a double nesting issue
3. **Routing Logic**: All route checks were hardcoded to look for `/blog/` prefix

## Solution Implemented

### 1. Updated `vite.config.ts`
- Made base path dynamic using environment variable
- Uses `/` (root) for standalone deployment
- Uses `/blog` when `VITE_BASE_PATH=blog` is set (for microfrontend)

```typescript
const basePath = process.env.VITE_BASE_PATH ? `/${process.env.VITE_BASE_PATH}` : '/'
```

### 2. Updated `vercel.json`
- Changed rewrites to catch-all pattern for SPA routing
- Routes all requests to `/index.html`
- Added security headers
- Added caching headers for assets

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 3. Created Navigation Utility (`src/lib/navigation.ts`)
- `getBasePath()`: Detects if running standalone or as microfrontend
- `navigateTo()`: Helper for path-aware navigation
- Works for both deployment scenarios

### 4. Updated Routing Logic

#### `App.svelte`
- Added path normalization
- Removes `/blog` prefix if present
- Routes work with or without prefix

#### `BlogNavigation.svelte`
- Dynamic navigation items based on deployment context
- Proper route active detection
- Login redirects respect base path

#### `BlogListPage.svelte`
- Dynamic navigation links
- Create post and view post links adapt to context

## How It Works

### Standalone Deployment (blog.mishrashardendu22.is-a.dev)
- Build with default settings: `pnpm build`
- Base path = `/`
- Routes: `/`, `/login`, `/create`, `/123`, etc.

### Microfrontend Integration (mishrashardendu22.is-a.dev/blog)
- Build with: `VITE_BASE_PATH=blog pnpm build`
- Base path = `/blog`
- Routes: `/blog`, `/blog/login`, `/blog/create`, `/blog/123`, etc.

## Testing

### Local Testing (Standalone)
```bash
cd apps/MishraShardendu22-Frontend-BlogWebsite
pnpm dev
# Access at http://localhost:5173/
```

### Local Testing (Microfrontend Mode)
```bash
VITE_BASE_PATH=blog pnpm dev
# Access at http://localhost:5173/blog/
```

### Production Build
```bash
pnpm build
# Creates dist/ with assets at root level
```

## Files Modified

1. `vite.config.ts` - Dynamic base path
2. `vercel.json` - SPA-friendly rewrites
3. `src/lib/navigation.ts` - New utility file
4. `src/App.svelte` - Path normalization
5. `src/lib/components/BlogNavigation.svelte` - Dynamic navigation
6. `src/lib/components/BlogListPage.svelte` - Dynamic links

## Deployment Steps

1. Push changes to repository
2. Vercel will auto-deploy
3. The blog will be accessible at root `/` of the domain
4. All routes will work correctly (no more 404s)

## Benefits

✅ Works on standalone domain
✅ Can still be integrated as microfrontend
✅ No hardcoded paths
✅ Proper SPA routing in production
✅ Better security headers
✅ Optimized asset caching

## Future Considerations

If you want to deploy this as a microfrontend on the main site:
1. Set environment variable in Vercel: `VITE_BASE_PATH=blog`
2. Update the main site to load the microfrontend from the correct path
3. All internal routing will automatically work with `/blog` prefix

---
**Date**: October 14, 2025
**Status**: ✅ Fixed and Ready for Deployment
