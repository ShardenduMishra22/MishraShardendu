/**
 * Sitemap generation utilities
 * This file provides utilities to generate sitemap.xml for better SEO
 */

export interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Generate XML sitemap from URLs
 */
export function generateSitemap(urls: SitemapURL[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = '</urlset>';

  const urlEntries = urls.map(url => {
    const loc = `  <url>\n    <loc>${escapeXml(url.loc)}</loc>`;
    const lastmod = url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : '';
    const changefreq = url.changefreq ? `\n    <changefreq>${url.changefreq}</changefreq>` : '';
    const priority = url.priority !== undefined ? `\n    <priority>${url.priority}</priority>` : '';
    return `${loc}${lastmod}${changefreq}${priority}\n  </url>`;
  }).join('\n');

  return `${xmlHeader}\n${urlsetOpen}\n${urlEntries}\n${urlsetClose}`;
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * Get static pages for sitemap
 */
export function getStaticPages(baseUrl: string): SitemapURL[] {
  return [
    {
      loc: baseUrl,
      changefreq: 'weekly',
      priority: 1.0,
      lastmod: new Date().toISOString().split('T')[0],
    },
    {
      loc: `${baseUrl}/blog`,
      changefreq: 'daily',
      priority: 0.9,
      lastmod: new Date().toISOString().split('T')[0],
    },
    {
      loc: `${baseUrl}/login`,
      changefreq: 'monthly',
      priority: 0.3,
    },
  ];
}

/**
 * Format date for sitemap
 */
export function formatSitemapDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}
