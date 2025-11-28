/**
 * Returns the base URL for the docs site.
 * - In development: http://localhost:3001 (Docusaurus dev server)
 * - In production: /documentation (GitHub Pages subdirectory)
 */
export function getDocsBaseUrl(): string {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001/documentation';
  }
  return '/documentation';
}

/**
 * Returns a full URL for a docs path with locale and theme support.
 * Example: getDocsUrl('/intro', 'es', true) → '/documentation/intro?locale=es&dark=true' in prod
 */
export function getDocsUrl(path: string, locale?: string, isDark?: boolean): string {
  const baseUrl = getDocsBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Remove /docs prefix if present (since we're going to /intro not /docs/intro)
  const cleanPath = normalizedPath.replace('/docs/', '/');
  
  const url = `${baseUrl}${cleanPath}`;
  const params = new URLSearchParams();
  
  // Always include locale parameter (even for English)
  if (locale) {
    params.append('locale', locale);
  }
  
  if (isDark !== undefined) {
    params.append('dark', isDark.toString());
  }
  
  const paramString = params.toString();
  return paramString ? `${url}?${paramString}` : url;
}

/**
 * Returns the base URL for the main site from documentation.
 * - In development: http://localhost:8081 (Next.js dev server)
 * - In production: https://human-0.com (main site)
 */
export function getMainSiteBaseUrl(): string {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8081';
  }
  return 'https://human-0.com';
}

/**
 * Returns a full URL for the main site with locale and theme support.
 * Example: getMainSiteUrl('/privacy', 'es', true) → 'http://localhost:8081/privacy?locale=es&dark=true' in dev
 */
export function getMainSiteUrl(path?: string, locale?: string, isDark?: boolean): string {
  const baseUrl = getMainSiteBaseUrl();
  if (!path) return baseUrl;
  
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${baseUrl}${normalizedPath}`;
  const params = new URLSearchParams();
  
  // Always include locale parameter (even for English)
  if (locale) {
    params.append('locale', locale);
  }
  
  if (isDark !== undefined) {
    params.append('dark', isDark.toString());
  }
  
  const paramString = params.toString();
  return paramString ? `${url}?${paramString}` : url;
}

/**
 * Gets current locale from URL or browser
 */
export function getCurrentLocale(): string {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('locale') || 'en';
  }
  return 'en';
}

/**
 * Gets current theme from URL or defaults to light
 */
export function getCurrentTheme(): boolean {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const darkParam = urlParams.get('dark');
    return darkParam === 'true';
  }
  return false;
}
