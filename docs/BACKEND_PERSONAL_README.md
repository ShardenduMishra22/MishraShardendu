# MishraShardendu22 Backend - Personal Website API

## Overview

Backend API for the personal website providing authentication, data management, and content delivery. Built with modern API design principles and optimized for performance and security.

## Technology Stack

- Runtime: Node.js 18+ or Go 1.21+
- Database: PostgreSQL 15+
- ORM: Drizzle (Node.js) or GORM (Go)
- Authentication: JWT tokens with Better-auth
- API Documentation: OpenAPI 3.0 / Swagger

## Features

- User authentication and authorization
- Project management CRUD operations
- Experience and certification management
- Contact form handling with email integration
- Sitemap generation endpoint
- Health check and monitoring endpoints

## API Endpoints

### Health Check
```
GET /health
GET /api/health
```

Returns server status and database connectivity.

### Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
```

### Projects
```
GET /api/projects
GET /api/projects/:id
POST /api/projects (authenticated)
PUT /api/projects/:id (authenticated)
DELETE /api/projects/:id (authenticated)
```

### Sitemap Generation
```
GET /sitemap.xml
GET /api/sitemap
```

Dynamically generates sitemap based on current content.

### Robots.txt
```
GET /robots.txt
```

Returns robots.txt with sitemap location.

## Sitemap Generation Implementation

### Pseudocode Example

```
function generateSitemap(request, response):
    baseURL = "https://mishrashardendu22.is-a.dev"
    currentDate = getCurrentDate()
    
    # Initialize XML structure
    xml = createXMLDocument()
    urlset = xml.createElement("urlset")
    urlset.setAttribute("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
    
    # Add homepage
    addURLToSitemap(urlset, {
        loc: baseURL + "/",
        lastmod: currentDate,
        changefreq: "weekly",
        priority: "1.0"
    })
    
    # Add static pages
    staticPages = [
        {path: "/projects", changefreq: "weekly", priority: "0.9"},
        {path: "/experiences", changefreq: "monthly", priority: "0.8"},
        {path: "/certifications", changefreq: "monthly", priority: "0.7"},
        {path: "/volunteer", changefreq: "monthly", priority: "0.6"},
        {path: "/contact", changefreq: "yearly", priority: "0.5"}
    ]
    
    for each page in staticPages:
        addURLToSitemap(urlset, {
            loc: baseURL + page.path,
            lastmod: currentDate,
            changefreq: page.changefreq,
            priority: page.priority
        })
    
    # Add dynamic project pages from database
    projects = database.query("SELECT slug, updated_at FROM projects WHERE published = true")
    for each project in projects:
        addURLToSitemap(urlset, {
            loc: baseURL + "/projects/" + project.slug,
            lastmod: project.updated_at,
            changefreq: "monthly",
            priority: "0.8"
        })
    
    # Set response headers
    response.setHeader("Content-Type", "application/xml")
    response.setHeader("Cache-Control", "public, max-age=3600")
    
    # Return XML
    return xml.toString()

function addURLToSitemap(urlset, data):
    url = urlset.createElement("url")
    
    loc = urlset.createElement("loc")
    loc.textContent = data.loc
    url.appendChild(loc)
    
    lastmod = urlset.createElement("lastmod")
    lastmod.textContent = data.lastmod
    url.appendChild(lastmod)
    
    changefreq = urlset.createElement("changefreq")
    changefreq.textContent = data.changefreq
    url.appendChild(changefreq)
    
    priority = urlset.createElement("priority")
    priority.textContent = data.priority
    url.appendChild(priority)
    
    urlset.appendChild(url)
```

### Node.js Express Example

```javascript
const express = require('express');
const router = express.Router();
const db = require('./database');

router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseURL = 'https://mishrashardendu22.is-a.dev';
    const currentDate = new Date().toISOString().split('T')[0];
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    // Homepage
    sitemap += `
  <url>
    <loc>${baseURL}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;
    
    // Static pages
    const staticPages = [
      { path: '/projects', changefreq: 'weekly', priority: '0.9' },
      { path: '/experiences', changefreq: 'monthly', priority: '0.8' },
      { path: '/certifications', changefreq: 'monthly', priority: '0.7' },
      { path: '/volunteer', changefreq: 'monthly', priority: '0.6' },
      { path: '/contact', changefreq: 'yearly', priority: '0.5' }
    ];
    
    staticPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${baseURL}${page.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });
    
    // Dynamic project pages
    const projects = await db.query(
      'SELECT slug, updated_at FROM projects WHERE published = true'
    );
    
    projects.rows.forEach(project => {
      const lastmod = new Date(project.updated_at).toISOString().split('T')[0];
      sitemap += `
  <url>
    <loc>${baseURL}/projects/${project.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });
    
    sitemap += `
</urlset>`;
    
    res.header('Content-Type', 'application/xml');
    res.header('Cache-Control', 'public, max-age=3600');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

module.exports = router;
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# API Configuration
API_PORT=8080
NODE_ENV=production

# CORS
ALLOWED_ORIGINS=https://mishrashardendu22.is-a.dev

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Canonical URL
CANONICAL_URL=https://mishrashardendu22.is-a.dev
```

## Canonical URLs

All API responses that include URLs should use the canonical URL configuration:

- Base URL: `https://mishrashardendu22.is-a.dev`
- API responses should include full canonical URLs
- Sitemap generation uses canonical URLs
- Email templates should use canonical URLs

## Installation

```bash
# Install dependencies
npm install
# or
go mod download

# Set up environment variables
cp .env.example .env

# Run database migrations
npm run migrate
# or
go run migrations/migrate.go

# Start development server
npm run dev
# or
go run main.go
```

## Deployment

Deploy to your preferred hosting platform (AWS, GCP, DigitalOcean, etc.) with proper environment variable configuration.

## API Documentation

Access full API documentation at `/api/docs` when running the server.

## Contact

**Shardendu Mishra**
- GitHub: https://github.com/MishraShardendu22/MishraShardendu22-Backend-PersonalWebsite
- Email: mishrashardendu22@gmail.com

## License

MIT License
