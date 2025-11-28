// Simple locale detection from URL parameters
export function detectLocaleFromURL(): string {
  if (typeof window === 'undefined') return 'en';
  
  const urlParams = new URLSearchParams(window.location.search);
  const urlLocale = urlParams.get('locale');
  
  return urlLocale || 'en';
}

// Simple theme detection from URL parameters
export function detectThemeFromURL(): boolean {
  if (typeof window === 'undefined') return false;
  
  const urlParams = new URLSearchParams(window.location.search);
  const darkTheme = urlParams.get('dark');
  
  return darkTheme === 'true';
}

// Apply detected locale and theme
export function applyLocaleAndTheme() {
  if (typeof window === 'undefined') return;
  
  const locale = detectLocaleFromURL();
  const isDark = detectThemeFromURL();
  
  // Store preferences
  localStorage.setItem('preferred-locale', locale);
  localStorage.setItem('preferred-theme', isDark ? 'dark' : 'light');
  
  // Apply theme
  if (isDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
  
  console.log('Applied locale:', locale, 'theme:', isDark ? 'dark' : 'light');
}

// Redirect to localized path for /docs section only
export function redirectToLocalizedPath() {
  if (typeof window === 'undefined') return;
  
  const locale = detectLocaleFromURL();
  const currentPath = window.location.pathname;
  
  // Only redirect if we're in the /docs section
  if (currentPath.startsWith('/docs/') || currentPath === '/docs') {
    // Check if we need to redirect
    if (locale !== 'en' && !currentPath.startsWith(`/${locale}/`)) {
      // Redirect to localized version
      const newPath = `/${locale}${currentPath}`;
      const currentUrl = window.location.href;
      const urlObj = new URL(currentUrl);
      
      // Remove locale from params since it's now in the path
      urlObj.searchParams.delete('locale');
      
      const finalUrl = `${urlObj.origin}${newPath}${urlObj.search}`;
      console.log('Redirecting /docs section to:', finalUrl);
      window.location.href = finalUrl;
    }
  }
}

// Initialize locale handling - different behavior for different sections
export function initializeSimpleLocale() {
  if (typeof window === 'undefined') return;
  
  applyLocaleAndTheme();
  
  const currentPath = window.location.pathname;
  
  // Check if we're in main section vs docs section
  if (currentPath.startsWith('/docs/') || currentPath === '/docs') {
    // /docs section: Use URL-based detection (no redirect)
    console.log('In /docs section - using URL-based detection, no redirect');
    // Don't redirect - just apply locale from URL parameter
  } else {
    // Main section: Use URL-based detection (no redirect)
    console.log('In main section - using URL-based detection, no redirect');
  }
}

