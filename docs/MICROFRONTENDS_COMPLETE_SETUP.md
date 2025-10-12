# Microfrontends Complete Setup Guide

This document provides a comprehensive guide for the complete microfrontends setup across all three applications in the portfolio monorepo.

## Overview

The portfolio uses Vercel's Microfrontends framework to split the monorepo into three independent applications that work together seamlessly:

- **mishrashardendu22** (PersonalWebsite) - Next.js 15 - Main application
- **mishrashardendu22-admin** (AdminWebsite) - Vite + Preact - Admin dashboard
- **mishrashardendu22-blog** (BlogWebsite) - Astro 5 - Blog platform

## Architecture

### Routing Strategy

The PersonalWebsite serves as the **default application** and contains the `microfrontends.json` configuration file that controls routing for all microfrontends.

**Route Distribution:**
- `/` - PersonalWebsite (default)
- `/admin` and `/admin/*` - AdminWebsite
- `/blog` and `/blog/*` - BlogWebsite

## Configuration Files

### 1. PersonalWebsite (Next.js 15)

#### microfrontends.json
```json
#### microfrontends.json

```json
{
  "$schema": "https://openapi.vercel.sh/microfrontends.json",
  "applications": {
    "mishrashardendu22": {
      "development": {
        "fallback": "https://mishrashardendu22.is-a.dev"
      }
    },
    "mishrashardendu22-admin": {
      "routing": [
        {
          "group": "admin",
          "paths": [
            "/admin",
            "/admin/:path*",
            "/vc-ap-mishrashardendu22-admin/:path*"
          ]
        }
      ]
    },
    "mishrashardendu22-blog": {
      "routing": [
        {
          "group": "blog",
          "paths": [
            "/blog",
            "/blog/:path*",
            "/vc-ap-mishrashardendu22-blog/:path*"
          ]
        }
      ]
    }
  }
}
```
```

#### next.config.ts
```typescript
import type { NextConfig } from 'next';
import { withMicrofrontends } from '@vercel/microfrontends/next/config';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  experimental: {
    proxyTimeout: 120000,
  },
  serverRuntimeConfig: {
    maxDuration: 120,
  },
  outputFileTracingRoot: require('path').join(__dirname, '../../'),
};

export default withMicrofrontends(nextConfig);
```

#### package.json (Dependencies)
```json
{
  "dependencies": {
    "@vercel/analytics": "^1.5.0",
    "@vercel/microfrontends": "^1.2.4",
    "@vercel/speed-insights": "^1.2.0",
    "@vercel/toolbar": "^0.1.36"
  },
  "scripts": {
    "dev": "next dev --port 3000",
    "dev:mfe": "next dev --port $(microfrontends port 2>/dev/null || echo 3000)",
    "proxy": "microfrontends proxy --local-apps mishrashardendu22"
  }
}
```

### 2. AdminWebsite (Vite + Preact)

#### vite.config.ts

```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import { microfrontends } from '@vercel/microfrontends/experimental/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      preact(),
      tailwindcss(),
      microfrontends({ basePath: '/vc-ap-mishrashardendu22-admin/' }),
    ],
    // ... rest of config
  };
});
```

#### package.json (Dependencies)
```json
{
  "type": "module",
  "dependencies": {
    "@vercel/microfrontends": "^1.2.4",
    "@vercel/toolbar": "^0.1.36"
  },
  "devDependencies": {
    "@module-federation/vite": "^1.2.7"
  },
  "scripts": {
    "dev": "vite --port 5173",
    "dev:mfe": "vite --port $(microfrontends port 2>/dev/null || echo 5173)",
    "proxy": "microfrontends proxy --local-apps mishrashardendu22-admin",
    "build": "tsc -b && vite build"
  }
}
```

**Key Points:**
- Plugin uses `basePath` option instead of separate `base` config
- `microfrontends({ basePath: '/vc-ap-mishrashardendu22-admin/' })` handles asset prefixing automatically
- Using `@vercel/microfrontends/experimental/vite` for latest features
- `@module-federation/vite` for module federation support
- **Important**: Asset path `/vc-ap-mishrashardendu22-admin/:path*` must be added to `microfrontends.json` routing for CSS/JS assets to load correctly

### 3. BlogWebsite (Astro 5)

#### astro.config.mjs

```javascript
// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// Astro is configured as "other framework" with manual asset prefix
export default defineConfig({
  base: '/vc-ap-mishrashardendu22-blog/',
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: false }
  }),
  trailingSlash: 'ignore',
  vite: {
    plugins: [tailwindcss()],
    // ... rest of config
  },
  integrations: [react()],
});
```

#### package.json (Dependencies)
```json
{
  "type": "module",
  "dependencies": {
    "@vercel/microfrontends": "^1.2.4",
    "@vercel/toolbar": "^0.1.36"
  },
  "scripts": {
    "dev": "astro dev --port 4321",
    "dev:mfe": "astro dev --port $(microfrontends port 2>/dev/null || echo 4321)",
    "proxy": "microfrontends proxy --local-apps mishrashardendu22-blog",
    "build": "astro build"
  }
}
```

**Key Points:**
- **Astro is configured as "Other Framework"** - not officially supported by Vercel microfrontends
- Uses standard Astro `base` config option: `base: '/vc-ap-mishrashardendu22-blog/'`
- All assets (CSS, JS, images) are automatically prefixed with the base path
- No special microfrontends plugin needed - Astro handles asset paths natively
- **Important**: Asset path `/vc-ap-mishrashardendu22-blog/:path*` must be added to `microfrontends.json` routing for assets to load correctly

## Development Workflow

### Local Development

#### Option 1: Run Individual Apps
```bash
# Terminal 1 - PersonalWebsite (Port 3000)
cd apps/MishraShardendu22-Frontend-PersonalWebsite
pnpm dev

# Terminal 2 - AdminWebsite (Port 5173)
cd apps/MishraShardendu22-Frontend-AdminWebsite
pnpm dev

# Terminal 3 - BlogWebsite (Port 4321)
cd apps/MishraShardendu22-Frontend-BlogWebsite
pnpm dev
```

#### Option 2: Run with Microfrontends CLI (Recommended)
```bash
# Terminal 1 - PersonalWebsite with dynamic port
cd apps/MishraShardendu22-Frontend-PersonalWebsite
pnpm dev:mfe

# Terminal 2 - Proxy to route between apps
cd apps/MishraShardendu22-Frontend-PersonalWebsite
pnpm proxy

# Terminal 3 - AdminWebsite
cd apps/MishraShardendu22-Frontend-AdminWebsite
pnpm dev:mfe

# Terminal 4 - BlogWebsite
cd apps/MishraShardendu22-Frontend-BlogWebsite
pnpm dev:mfe
```

#### Option 3: Run from Root (Turborepo)
```bash
# From root - runs all apps concurrently
pnpm dev
```

### Testing the Setup

1. **Visit PersonalWebsite**: `http://localhost:3000`
   - Should show the main portfolio site

2. **Visit Admin Dashboard**: `http://localhost:3000/admin`
   - Should route to AdminWebsite running on port 5173
   - Assets should load from `/vc-ap-mishrashardendu22-admin/`

3. **Visit Blog**: `http://localhost:3000/blog`
   - Should route to BlogWebsite running on port 4321
   - Assets should load from `/vc-ap-mishrashardendu22-blog/`

## Asset Prefixes

Each microfrontend automatically gets an asset prefix in production:

| Application | Asset Prefix |
|------------|--------------|
| mishrashardendu22 (PersonalWebsite) | `/` (root) |
| mishrashardendu22-admin (AdminWebsite) | `/vc-ap-mishrashardendu22-admin/` |
| mishrashardendu22-blog (BlogWebsite) | `/vc-ap-mishrashardendu22-blog/` |

The format is `/vc-ap-<application-name>/`

## Package Versions

All three applications use the same versions of core microfrontends packages:

```json
{
  "@vercel/microfrontends": "^1.2.4",
  "@vercel/toolbar": "^0.1.36"
}
```

Additional AdminWebsite dependency:
```json
{
  "@module-federation/vite": "^1.2.7"
}
```

## Deployment

### Vercel Deployment

1. **Deploy Each App Separately**:
   - Each app must be deployed as a separate Vercel project
   - Project names MUST match the names in `microfrontends.json`:
     - `mishrashardendu22`
     - `mishrashardendu22-admin`
     - `mishrashardendu22-blog`

2. **Set Root Directory**:
   - PersonalWebsite: `apps/MishraShardendu22-Frontend-PersonalWebsite`
   - AdminWebsite: `apps/MishraShardendu22-Frontend-AdminWebsite`
   - BlogWebsite: `apps/MishraShardendu22-Frontend-BlogWebsite`

3. **Build Commands**:
   - PersonalWebsite: `pnpm build`
   - AdminWebsite: `pnpm build`
   - BlogWebsite: `pnpm build`

4. **Install Command** (for all):
   ```bash
   pnpm install --no-frozen-lockfile
   ```

### Environment Variables

Ensure all environment variables are set for each Vercel project:

**PersonalWebsite:**
- Database connection strings
- Authentication secrets
- API keys

**AdminWebsite:**
- Backend API URLs
- Authentication tokens

**BlogWebsite:**
- Database connection strings
- Content API keys

## Troubleshooting

### Common Issues

#### 1. 404 Errors on Microfrontend Routes
**Problem**: Visiting `/admin` or `/blog` returns 404

**Solution**:
- Verify `microfrontends.json` exists in PersonalWebsite
- Check that `group` property is set for each routing configuration
- Ensure project names match exactly in Vercel

#### 2. Assets Not Loading
**Problem**: CSS/JS files return 404 in admin or blog apps

**Solution**:
- Verify `base` is set correctly in Vite/Astro config
- Check asset prefix matches: `/vc-ap-<app-name>/`
- Clear browser cache and rebuild

#### 3. TypeScript Errors
**Problem**: `Cannot find module '@vercel/microfrontends/...'`

**Solution**:
```bash
# Install dependencies from root
cd /path/to/monorepo
pnpm install
```

#### 4. Proxy Not Working in Development
**Problem**: Routes don't proxy correctly to other apps

**Solution**:
```bash
# Make sure proxy is running
cd apps/MishraShardendu22-Frontend-PersonalWebsite
pnpm proxy

# And all apps are running with dev:mfe
pnpm dev:mfe
```

#### 5. Port Conflicts
**Problem**: `microfrontends port` command fails

**Solution**:
- Ensure `@vercel/microfrontends` is installed in each app
- Use fallback ports in scripts: `$(microfrontends port 2>/dev/null || echo 3000)`
- Check no other processes are using the ports

## Key Configuration Rules

### ✅ DO:
- Use exact project names in `microfrontends.json`
- Set `base` path for non-default apps (Vite/Astro)
- Include `group` property for each routing rule
- Use `:path*` for wildcard route matching
- Install `@vercel/microfrontends` in all apps
- Use `withMicrofrontends` wrapper for Next.js config

### ❌ DON'T:
- Use `/` or `/*` in path patterns (use `:path*` instead)
- Forget `base` path in Vite/Astro configs
- Miss the `group` property in routing configs
- Use different package versions across apps
- Have conflicting route paths

## Testing Checklist

Before deploying, verify:

- [ ] All three apps build successfully
- [ ] `microfrontends.json` is in PersonalWebsite
- [ ] Each app has correct `base` path configured
- [ ] All routing groups are defined
- [ ] Package versions match across apps
- [ ] Environment variables are set
- [ ] Local development proxy works
- [ ] All routes load correctly locally
- [ ] Assets load from correct paths
- [ ] No console errors in browser

## Additional Resources

- [Vercel Microfrontends Documentation](https://vercel.com/docs/frameworks/microfrontends)
- [Next.js Microfrontends Guide](https://vercel.com/docs/frameworks/microfrontends/next-js)
- [Vite Microfrontends Guide](https://vercel.com/docs/frameworks/microfrontends/vite)
- [Astro Microfrontends Guide](https://vercel.com/docs/frameworks/microfrontends/astro)

## Summary

This microfrontends setup allows you to:
- ✅ Deploy and develop each app independently
- ✅ Share common packages via workspace
- ✅ Route between apps seamlessly
- ✅ Scale and optimize each app separately
- ✅ Use different frameworks (Next.js, Vite, Astro)
- ✅ Maintain a unified monorepo structure

All configurations are now complete and ready for development and deployment!
