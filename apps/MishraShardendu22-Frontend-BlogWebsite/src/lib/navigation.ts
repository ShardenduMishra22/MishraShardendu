/**
 * Get the base path for navigation
 * Works for both standalone deployment (root) and microfrontend (/blog prefix)
 */
export function getBasePath(): string {
  if (typeof window === 'undefined') return '';
  return window.location.pathname.startsWith('/blog') ? '/blog' : '';
}

/**
 * Navigate to a path with proper base path handling
 */
export function navigateTo(path: string): void {
  const basePath = getBasePath();
  const targetPath = path.startsWith('/') ? path : `/${path}`;
  window.location.href = `${basePath}${targetPath}`;
}
