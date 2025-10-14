# MS22 Blog - Frontend

A modern, production-ready blog frontend built with Svelte 5, TypeScript, and Vite. Features comprehensive validation, toast notifications, OTP verification, and strict type safety.

## 🌟 Features

- ✅ **Modern Stack:** Svelte 5 + TypeScript + Vite + TailwindCSS
- ✅ **Type Safety:** Strict TypeScript with comprehensive API types
- ✅ **Validation:** Client-side validation for all inputs
- ✅ **Toast Notifications:** Beautiful, accessible notifications
- ✅ **OTP Verification:** Complete email verification flow
- ✅ **Authentication:** JWT-based auth with token management
- ✅ **Blog Management:** Create, read, update, delete blogs (owner only)
- ✅ **Comments:** Comment system with verification requirement
- ✅ **Responsive:** Mobile-first responsive design
- ✅ **Dark/Light Theme:** Consistent theme system with toggle button matching other websites
- ✅ **Theme Persistence:** Saves user preference, respects system settings
- ✅ **SEO Optimized:** Complete SEO with meta tags, Open Graph, structured data
- ✅ **PWA Ready:** Progressive Web App with manifest and icons
- ✅ **Production Ready:** Optimized builds, error handling, security

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Backend API running (see [Backend Setup](../Backend/MishraShardendu22-Backend-BlogWebsite/README.md))

### Installation

```bash
# Run setup script (recommended)
./setup.sh

# Or manually:
cp .env.example .env
# Update VITE_API_URL in .env
pnpm install
```

### Development

#### Standalone Mode
```bash
pnpm dev
```

Open [http://localhost:5174](http://localhost:5174)

#### Microfrontend Mode (Recommended)

This blog is configured as a microfrontend child of the main Personal Website. To run it in microfrontend mode:

```bash
# Terminal 1: Start the main website (parent)
cd ../MishraShardendu22-Frontend-PersonalWebsite
pnpm dev

# Terminal 2: Start the blog (child)
pnpm dev:mfe
```

Access the blog at: [http://localhost:3000/blog](http://localhost:3000/blog)

**Note:** The blog runs at the `/blog` path when integrated with the main website. See [Blog Microfrontend Setup](../../docs/BLOG_MICROFRONTEND_SETUP.md) for detailed configuration

### Build

```bash
pnpm build
pnpm preview
```

## 📋 Documentation

- **[IMPROVEMENTS.md](./IMPROVEMENTS.md)** - Complete list of all improvements and features
- **[TESTING.md](./TESTING.md)** - Comprehensive testing guide and checklist
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment instructions
- **[docs/SEO_GUIDE.md](./docs/SEO_GUIDE.md)** - Complete SEO implementation guide
- **[docs/OG_IMAGE_GUIDE.md](./docs/OG_IMAGE_GUIDE.md)** - Open Graph image creation guide
- **[docs/THEME_SYSTEM.md](./docs/THEME_SYSTEM.md)** - Theme system documentation and usage
- **[docs/THEME_IMPLEMENTATION_SUMMARY.md](./docs/THEME_IMPLEMENTATION_SUMMARY.md)** - Theme implementation summary

## 🎯 Project Structure

```
src/
├── lib/
│   ├── api.ts              # API client with types
│   ├── auth.ts             # Authentication store
│   ├── validation.ts       # Input validation utilities
│   ├── toast.ts            # Toast notification system
│   └── components/
│       ├── Toast.svelte            # Toast UI component
│       ├── OTPVerification.svelte  # OTP verification flow
│       ├── LoginPage.svelte        # Login/Register page
│       ├── BlogListPage.svelte     # Blog listing
│       ├── BlogDetailPage.svelte   # Blog detail view
│       ├── BlogCreatePage.svelte   # Create/Edit blog
│       └── ui/                     # Reusable UI components
├── App.svelte              # Main app component
└── main.ts                 # Entry point
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file (see `.env.example`):

```env
VITE_API_URL=http://localhost:3000
```

### API Integration

The frontend connects to your backend API. Make sure:
- Backend is running on the configured URL
- CORS is properly configured
- All endpoints match the API specification

## ✨ Key Features Explained

### 1. Type-Safe API Client

```typescript
// Comprehensive types matching backend
export interface Blog {
  id: number;
  title: string;
  content: string;
  tags?: string[];
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author?: Author;
}

// Type-safe API calls
const response = await blogApi.getBlogById(1);
if (response.success && response.data) {
  const blog: Blog = response.data;
}
```

### 2. Input Validation

```typescript
// Email validation
const emailValidation = validateEmail("user@example.com");
if (!emailValidation.isValid) {
  console.error(emailValidation.error);
}

// Password strength
const passwordValidation = validatePassword("SecurePass123!");
// Requires: 8+ chars, uppercase, lowercase, number, special char
```

### 3. Toast Notifications

```typescript
import { toast } from './lib/toast';

toast.success("Blog created successfully!");
toast.error("Failed to save");
toast.warning("Please verify your email");
toast.info("New features available");
```

### 4. OTP Verification

Dedicated component with:
- 6-digit OTP input
- Resend functionality (60s cooldown)
- Auto-verification
- Error handling

## 🧪 Testing

See [TESTING.md](./TESTING.md) for:
- Authentication flow tests
- Blog management tests
- Validation tests
- UI/UX testing checklist
- Common issues and solutions

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Vercel deployment
- Netlify deployment
- Docker configuration
- AWS deployment
- CI/CD setup

## 🎨 Tech Stack

- **Framework:** Svelte 5 (Runes mode)
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Icons:** Lucide Svelte
- **State Management:** Svelte stores
- **HTTP Client:** Fetch API with custom wrapper

## 📝 Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm check        # Type check
```

## 🔒 Security

- XSS prevention via HTML sanitization
- Input validation on client-side
- JWT token management
- Token expiry detection
- CORS-aware error handling

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check `VITE_API_URL` in `.env`
   - Verify backend is running
   - Check browser console for CORS errors

2. **Login Not Working**
   - Verify backend is accessible
   - Check JWT token in localStorage
   - Review backend logs

3. **OTP Not Received**
   - Check spam folder
   - Verify backend email configuration
   - Check backend logs

See [TESTING.md](./TESTING.md) for more troubleshooting.

## 📄 License

MIT

---

## Original Svelte + Vite Template Info

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## Need an official Svelte framework?

Check out [SvelteKit](https://github.com/sveltejs/kit#readme), which is also powered by Vite. Deploy anywhere with its serverless-first approach and adapt to various platforms, with out of the box support for TypeScript, SCSS, and Less, and easily-added support for mdsvex, GraphQL, PostCSS, Tailwind CSS, and more.

## Technical considerations

**Why use this over SvelteKit?**

- It brings its own routing solution which might not be preferable for some users.
- It is first and foremost a framework that just happens to use Vite under the hood, not a Vite app.

This template contains as little as possible to get started with Vite + TypeScript + Svelte, while taking into account the developer experience with regards to HMR and intellisense. It demonstrates capabilities on par with the other `create-vite` templates and is a good starting point for beginners dipping their toes into a Vite + Svelte project.

Should you later need the extended capabilities and extensibility provided by SvelteKit, the template has been structured similarly to SvelteKit so that it is easy to migrate.

**Why `global.d.ts` instead of `compilerOptions.types` inside `jsconfig.json` or `tsconfig.json`?**

Setting `compilerOptions.types` shuts out all other types not explicitly listed in the configuration. Using triple-slash references keeps the default TypeScript setting of accepting type information from the entire workspace, while also adding `svelte` and `vite/client` type information.

**Why include `.vscode/extensions.json`?**

Other templates indirectly recommend extensions via the README, but this file allows VS Code to prompt the user to install the recommended extension upon opening the project.

**Why enable `allowJs` in the TS template?**

While `allowJs: false` would indeed prevent the use of `.js` files in the project, it does not prevent the use of JavaScript syntax in `.svelte` files. In addition, it would force `checkJs: false`, bringing the worst of both worlds: not being able to guarantee the entire codebase is TypeScript, and also having worse typechecking for the existing JavaScript. In addition, there are valid use cases in which a mixed codebase may be relevant.

**Why is HMR not preserving my local component state?**

HMR state preservation comes with a number of gotchas! It has been disabled by default in both `svelte-hmr` and `@sveltejs/vite-plugin-svelte` due to its often surprising behavior. You can read the details [here](https://github.com/rixo/svelte-hmr#svelte-hmr).

If you have state that's important to retain within a component, consider creating an external store which would not be replaced by HMR.

```ts
// store.ts
// An extremely simple external store
import { writable } from 'svelte/store'
export default writable(0)
```
