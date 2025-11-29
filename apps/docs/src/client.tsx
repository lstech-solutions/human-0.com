// Client module for locale persistence
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Initialize locale persistence
export default function () {
  if (!ExecutionEnvironment.canUseDOM) {
    return;
  }

  // Save locale preference to localStorage when it changes
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function(...args) {
    const result = originalPushState.apply(this, args);
    saveLocalePreference();
    return result;
  };

  history.replaceState = function(...args) {
    const result = originalReplaceState.apply(this, args);
    saveLocalePreference();
    return result;
  };

  // Save current locale on load
  saveLocalePreference();

  // Listen for navigation changes
  window.addEventListener('popstate', saveLocalePreference);
}

function saveLocalePreference() {
  const pathname = window.location.pathname;
  const localeMatch = pathname.match(/^\/([a-z]{2})(?:\/|$)/);
  
  if (localeMatch) {
    const locale = localeMatch[1];
    localStorage.setItem('docusaurus.locale', locale);
  }
}
