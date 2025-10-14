# Blog Microfrontend Setup

## Overview

The Blog Website (`ms22-blog`) has been configured as a microfrontend child of the main Personal Website, similar to the Admin Website setup. This allows seamless integration where the blog runs at the `/blog` path of the main website.

## Configuration Files

### 1. Microfrontends Configuration

**Location**: `apps/MishraShardendu22-Frontend-PersonalWebsite/microfrontends.json`

```json
{
  "applications": {
    "ms22-blog": {
      "development": {
        "local": 5174,
        "fallback": "ms22-blog.vercel.app"
      },
      "routing": [
        {
          "group": "blog",
          "paths": [
            "/blog",
            "/blog/login",
            "/blog/dashboard",
            "/blog/create",
            "/blog/verify-email",
            "/blog/verify-otp",
            "/blog/:path*",
            "/vc-ap-ms22-blog/:path*"
          ]
        }
      ]
    }
  }
}
```

### 2. Vite Configuration

**Location**: `apps/MishraShardendu22-Frontend-BlogWebsite/vite.config.ts`

The Blog Website's Vite config has been updated to:
- Use `/blog` as the base path
- Include the microfrontends plugin
- Configure code splitting for optimal loading

Key changes:
```typescript
import { microfrontends } from '@vercel/microfrontends/experimental/vite'

export default defineConfig(() => {
  const basePath = '/blog'
  
  return {
    base: basePath,
    plugins: [
      svelte(),
      tailwindcss(),
      microfrontends({ basePath }),
    ],
    // ... rest of config
  }
})
```

### 3. Vercel Deployment Configuration

**Location**: `apps/MishraShardendu22-Frontend-BlogWebsite/vercel.json`

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/blog", "destination": "/blog/index.html" },
    { "source": "/blog/:path*", "destination": "/blog/index.html" }
  ]
}
```

### 4. Package Dependencies

Added to `package.json`:
```json
{
  "devDependencies": {
    "@vercel/microfrontends": "^1.2.4"
  }
}
```

## Routing Updates

All internal routes have been updated to use the `/blog` prefix:

- `/blog` - Blog list page
- `/blog/login` - Login page
- `/blog/dashboard` - Dashboard (owner only)
- `/blog/create` - Create new post (owner only)
- `/blog/:id` - View blog post
- `/blog/:id/edit` - Edit blog post (owner only)

## Development Setup

### Local Development

1. **Start the Main Website** (Parent):
   ```bash
   cd apps/MishraShardendu22-Frontend-PersonalWebsite
   pnpm dev
   ```
   Runs on: http://localhost:3000

2. **Start the Blog Website** (Child):
   ```bash
   cd apps/MishraShardendu22-Frontend-BlogWebsite
   pnpm dev:mfe
   ```
   Runs on: http://localhost:5174

3. **Access the Blog**:
   - Through parent: http://localhost:3000/blog
   - Direct: http://localhost:5174/blog

### Development Scripts

The Blog Website has the following npm scripts:

- `pnpm dev` - Run standalone on port 5174
- `pnpm dev:mfe` - Run as microfrontend (auto-detects port)
- `pnpm proxy` - Run proxy server for local development
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

## Production Deployment

### Deployment Strategy

1. **Main Website**: Deploys to primary domain
2. **Blog Website**: Deploys to subdomain `ms22-blog.vercel.app`
3. **Integration**: Main website proxies `/blog/*` requests to the Blog microfrontend

### Deployment Steps

1. Deploy the Blog Website first:
   ```bash
   cd apps/MishraShardendu22-Frontend-BlogWebsite
   vercel --prod
   ```

2. Deploy the Main Website:
   ```bash
   cd apps/MishraShardendu22-Frontend-PersonalWebsite
   vercel --prod
   ```

### Environment Variables

Ensure these environment variables are set for the Blog Website in Vercel:

- `VITE_API_URL` - Backend API URL
- Any other blog-specific environment variables

## Architecture Benefits

1. **Independent Development**: Blog can be developed and tested independently
2. **Isolated Deployments**: Deploy blog updates without affecting the main site
3. **Code Splitting**: Optimized loading - blog code only loads when visiting `/blog`
4. **Technology Freedom**: Blog uses Svelte while main site uses Next.js
5. **Seamless Integration**: Users experience a unified application

## Troubleshooting

### Issue: Blog routes not working locally

**Solution**: Ensure both the main website and blog website are running:
```bash
# Terminal 1
cd apps/MishraShardendu22-Frontend-PersonalWebsite
pnpm dev

# Terminal 2
cd apps/MishraShardendu22-Frontend-BlogWebsite
pnpm dev:mfe
```

### Issue: 404 errors on refresh

**Solution**: Check that `vercel.json` rewrites are configured correctly to route all `/blog/*` paths to `/blog/index.html`

### Issue: Assets not loading

**Solution**: Verify that `base: '/blog'` is set in `vite.config.ts` and that all asset imports use relative paths

### Issue: CORS errors in development

**Solution**: The microfrontends plugin handles CORS automatically. Ensure your API backend allows requests from both localhost:3000 and localhost:5174

## Comparison with Admin Setup

The Blog setup mirrors the Admin Website configuration:

| Aspect | Admin | Blog |
|--------|-------|------|
| Base Path | `/admin` | `/blog` |
| Port | 5173 | 5174 |
| Framework | Preact | Svelte |
| Fallback Domain | `ms22-admin.vercel.app` | `ms22-blog.vercel.app` |

## Next Steps

1. Test the blog thoroughly in both local and production environments
2. Verify all routes work correctly with the `/blog` prefix
3. Test navigation between main site, blog, and admin
4. Ensure authentication flows work across microfrontends
5. Monitor performance and loading times

## References

- [Vercel Microfrontends Documentation](https://vercel.com/docs/workflow-collaboration/microfrontends)
- Main Website Microfrontends Config: `apps/MishraShardendu22-Frontend-PersonalWebsite/microfrontends.json`
- Admin Website Setup: Similar configuration for reference
