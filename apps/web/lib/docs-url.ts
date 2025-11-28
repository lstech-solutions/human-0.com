/**
 * Returns the base URL for the docs site.
 * - In development: http://localhost:3001 (Docusaurus dev server)
 * - In production: /documentation (GitHub Pages subdirectory)
 */
export function getDocsBaseUrl(): string {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001';
  }
  return '/documentation';
}

/**
 * Returns a full URL for a docs path.
 * Example: getDocsUrl('/docs/intro') → '/documentation/docs/intro' in prod
 */
export function getDocsUrl(path: string): string {
  const baseUrl = getDocsBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
