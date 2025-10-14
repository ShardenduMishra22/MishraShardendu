/**
 * Get the base path for navigation
 * Always use /blog prefix for microfrontend deployment
 */
export function getBasePath(): string {
  if (typeof window === 'undefined') return '';
  return '/blog';
}

/**
 * Navigate to a path with proper base path handling
 */
export function navigateTo(path: string): void {
  const basePath = getBasePath();
  const targetPath = path.startsWith('/') ? path : `/${path}`;
  window.location.href = `${basePath}${targetPath}`;
}
