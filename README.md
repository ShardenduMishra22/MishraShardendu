# Shardendu Mishra - Portfolio Monorepo

<div align="center">
  <img src="./GopherShardenduMishra.png" alt="Shardendu Mishra" width="200" />
  
  <h3>Enterprise-grade portfolio platform built with modern web technologies</h3>
  <p>A comprehensive monorepo featuring personal website, blog system, and admin dashboard</p>
</div>

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Site-4285f4?style=for-the-badge&logo=google-chrome)](https://mishrashardendu22.is-a.dev)
[![Repository](https://img.shields.io/badge/Repository-Star-FFD700?style=for-the-badge&logo=github)](https://github.com/MishraShardendu22/MishraShardendu)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

![Version](https://img.shields.io/badge/version-3.0.0-brightgreen?style=flat-square)
![Status](https://img.shields.io/badge/status-production-success?style=flat-square)
![Build](https://img.shields.io/badge/build-passing-success?style=flat-square)

</div>

---

## Overview

This monorepo contains a complete portfolio platform ecosystem built with cutting-edge technologies. The architecture leverages Turborepo for efficient builds, PNPM workspaces for dependency management, and a modular design with shared packages for maximum code reuse.

### Architecture

**Monorepo Structure**: Turborepo + PNPM Workspaces  
**Frontend Applications**: Next.js 15, Astro 5, Vite + Preact  
**Shared Packages**: TypeScript, React components, utilities, authentication  
**Database Systems**: PostgreSQL (Blog), MongoDB (Portfolio)  
**Styling**: Tailwind CSS 4 + shadcn/ui components  
**Type Safety**: TypeScript with strict mode

---

## Project Structure

\`\`\`
mishrashardendu22/
├── apps/
│   ├── MishraShardendu22-Frontend-PersonalWebsite/  # Next.js 15 - Main portfolio
│   ├── MishraShardendu22-Frontend-BlogWebsite/      # Astro 5 - Blog system
│   └── MishraShardendu22-Frontend-AdminWebsite/     # Vite + Preact - Admin panel
├── packages/
│   ├── shared-ui/          # Shared React components
│   ├── shared-utils/       # Common utilities
│   ├── shared-types/       # TypeScript type definitions
│   ├── auth-shared/        # Authentication logic
│   ├── ui/                 # UI component library
│   └── typescript-config/  # Shared TypeScript configurations
├── docs/                   # Documentation
├── scripts/                # Build and deployment scripts
└── turbo.json             # Turborepo configuration
\`\`\`

---

## Applications

### Personal Website (Next.js 15)

The main portfolio application showcasing projects, experiences, skills, and certifications. Built with Next.js 15 App Router and React 19.

**Technology Stack**:
- Next.js 15 with Server Components
- React 19 with concurrent features
- TypeScript 5.8
- Tailwind CSS 4
- PostgreSQL with Drizzle ORM
- Better-auth for authentication

**Features**:
- Dynamic project showcase with filtering
- Professional experience timeline
- Skills and certifications management
- Contact form with validation
- SEO optimized with metadata API
- Progressive Web App support

### Blog Website (Astro 5)

A high-performance blog platform with markdown support and content management capabilities.

**Technology Stack**:
- Astro 5 with SSR
- React for interactive components
- Drizzle ORM with PostgreSQL
- TipTap rich text editor
- MDX support

**Features**:
- Markdown-based content authoring
- Rich text editor for content creation
- Category and tag management
- Comment system
- RSS feed generation
- Full-text search

### Admin Dashboard (Vite + Preact)

A lightweight admin interface for managing all platform content.

**Technology Stack**:
- Vite 7 for fast development
- Preact for minimal bundle size
- TypeScript
- TailwindCSS
- React Hook Form + Zod validation

**Features**:
- Content management (CRUD operations)
- Project and blog post management
- User authentication and authorization
- Analytics dashboard
- Media management

---

## Shared Packages

### @repo/shared-ui
Reusable React components used across all applications. Built with Radix UI primitives and Tailwind CSS.

### @repo/shared-utils
Common utility functions for data manipulation, formatting, and validation.

### @repo/shared-types
TypeScript type definitions and interfaces shared across the monorepo.

### @repo/auth-shared
Authentication logic and utilities using Better-auth.

### @repo/ui
Component library with shadcn/ui components configured for the design system.

### @repo/typescript-config
Shared TypeScript configurations for consistent type checking across projects.

---

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime environment |
| PNPM | 9.0.0 | Package manager |
| Turborepo | 2.5.8 | Monorepo build system |
| TypeScript | 5.8 | Type safety |

### Frontend Frameworks

| Framework | Version | Application |
|-----------|---------|-------------|
| Next.js | 15.5.3 | Personal Website |
| Astro | 5.14.4 | Blog Website |
| Vite | 7.1.9 | Admin Dashboard |
| React | 19.2.0 | UI Library |
| Preact | 10.27.2 | Admin Dashboard |

### Databases & ORMs

| Technology | Version | Purpose |
|------------|---------|---------|
| PostgreSQL | 15+ | Blog content storage |
| MongoDB | 7.0+ | Portfolio data storage |
| Drizzle ORM | Latest | Type-safe database queries |

### Styling & UI

| Technology | Purpose |
|------------|---------|
| Tailwind CSS 4 | Utility-first styling |
| shadcn/ui | Component library |
| Radix UI | Headless UI primitives |
| Lucide React | Icon library |

---

## Getting Started

### Prerequisites

\`\`\`bash
Node.js >= 18.0.0
PNPM >= 9.0.0
PostgreSQL >= 15
MongoDB >= 7.0 (optional)
\`\`\`

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/MishraShardendu22/MishraShardendu.git
cd mishrashardendu22

# Install dependencies
pnpm install

# Setup environment variables
# Copy .env.example to .env.local in each app directory
# Configure database URLs and API keys

# Run database migrations
cd apps/MishraShardendu22-Frontend-PersonalWebsite
pnpm db:push
cd apps/MishraShardendu22-Frontend-BlogWebsite
pnpm db:push
cd ../..

# Start development servers
pnpm dev
\`\`\`

### Development

\`\`\`bash
# Start all applications in development mode
pnpm dev

# Build all applications
pnpm build

# Run linting
pnpm lint

# Format code
pnpm format

# Type checking
pnpm typecheck

# Clean all build artifacts and node_modules
pnpm clean
\`\`\`

### Accessing Applications

| Application | URL | Description |
|------------|-----|-------------|
| Personal Website | http://localhost:3000 | Main portfolio |
| Blog Website | http://localhost:4321 | Blog platform |
| Admin Dashboard | http://localhost:5173 | Admin panel |

---

## Environment Configuration

Each application requires its own environment configuration. See the respective README files in each app directory for specific requirements.

### Personal Website (.env.local)
- Database URL (PostgreSQL)
- Authentication secrets
- API endpoints

### Blog Website (.env)
- Database URL (PostgreSQL)
- API keys
- Content directory paths

### Admin Dashboard (.env)
- API base URL
- Authentication tokens

Detailed environment setup instructions are available in [docs/DEVELOPMENT_GUIDE.md](./docs/DEVELOPMENT_GUIDE.md).

---

## Deployment

### Production Build

\`\`\`bash
# Build all applications for production
pnpm build

# Test production builds locally
pnpm start
\`\`\`

### Deployment Platforms

**Personal Website**: Vercel (Recommended)  
**Blog Website**: Vercel or Netlify  
**Admin Dashboard**: Vercel or Cloudflare Pages

Refer to [docs/DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

---

## Performance

### Build Performance
- Turborepo caching for incremental builds
- PNPM workspace optimization
- Parallel task execution

### Runtime Performance
- Next.js Server Components for optimal loading
- Astro partial hydration for minimal JavaScript
- Vite optimized bundling for fast admin dashboard

### Metrics
- Lighthouse Score: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 2.5s
- Total Bundle Size: Optimized per application

---

## Security

### Authentication
- JWT-based authentication with Better-auth
- Secure session management
- Role-based access control

### Data Protection
- Input validation with Zod schemas
- SQL injection prevention with parameterized queries
- XSS protection with content sanitization
- CSRF protection with SameSite cookies

### Best Practices
- Environment variable encryption
- Secure HTTP headers
- Rate limiting on API endpoints
- Regular dependency updates

---

## Testing

\`\`\`bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run end-to-end tests
pnpm test:e2e
\`\`\`

---

## Documentation

Comprehensive documentation is available in the [docs](./docs) directory:

- [API Documentation](./docs/API_DOCS.md)
- [Development Guide](./docs/DEVELOPMENT_GUIDE.md)
- [Contributing Guidelines](./docs/CONTRIBUTING.md)
- [Code of Conduct](./docs/CODE_OF_CONDUCT.md)
- [Security Policy](./docs/SECURITY.md)
- [Postman Collection](./docs/POSTMAN.md)

---

## Contributing

We welcome contributions from the community. Please read our [Contributing Guidelines](./docs/CONTRIBUTING.md) before submitting pull requests.

### Contribution Workflow

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

### Development Standards

- TypeScript strict mode
- ESLint and Prettier formatting
- Comprehensive testing (80%+ coverage)
- Conventional commit messages
- Updated documentation

---

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

\`\`\`
MIT License

Copyright (c) 2025 Shardendu Mishra

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
\`\`\`

---

## Author

**Shardendu Mishra**  
Software Engineer | Full-Stack Developer

- Email: mishrashardendu22@gmail.com
- Portfolio: [mishrashardendu22.is-a.dev](https://mishrashardendu22.is-a.dev)
- GitHub: [@MishraShardendu22](https://github.com/MishraShardendu22)
- LinkedIn: [Shardendu Mishra](https://www.linkedin.com/in/shardendumishra22/)

---

## Acknowledgments

Built with outstanding open-source technologies:

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Astro](https://img.shields.io/badge/Astro-5-FF5D01?style=flat-square&logo=astro)](https://astro.build)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![Turborepo](https://img.shields.io/badge/Turborepo-2-EF4444?style=flat-square&logo=turborepo)](https://turbo.build)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql)](https://postgresql.org)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square)](https://orm.drizzle.team)

---

## Support

For support, please:
- Open an issue: [GitHub Issues](https://github.com/MishraShardendu22/MishraShardendu/issues)
- Email: mishrashardendu22@gmail.com
- Documentation: [docs/](./docs)

---

<div align="center">

**Built with precision and passion**

[![GitHub stars](https://img.shields.io/github/stars/MishraShardendu22/MishraShardendu?style=social)](https://github.com/MishraShardendu22/MishraShardendu)
[![GitHub forks](https://img.shields.io/github/forks/MishraShardendu22/MishraShardendu?style=social)](https://github.com/MishraShardendu22/MishraShardendu/fork)

Last Updated: October 2025 | Version 3.0.0 | Monorepo Architecture

</div>
