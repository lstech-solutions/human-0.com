// Simple translation component using JSON files
import React, { useState, useEffect } from 'react';

// Simple translation cache
const translationCache = new Map<string, Record<string, any>>();

// Load translation JSON file
async function loadTranslations(locale: string): Promise<Record<string, any>> {
  if (translationCache.has(locale)) {
    return translationCache.get(locale)!;
  }
  
  try {
    // Import the JSON file dynamically
    const translations = await import(`../../../locales/${locale}.json`);
    translationCache.set(locale, translations.default || translations);
    return translations.default || translations;
  } catch (error) {
    console.warn(`Failed to load translations for locale: ${locale}`, error);
    return {};
  }
}

interface TranslateProps {
  id: string;
  description?: string;
  children?: React.ReactNode;
  values?: Record<string, any>;
  locale?: string;
}

export function Translate({ id, description, children, values, locale }: TranslateProps) {
  const [translation, setTranslation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTranslation = async () => {
      const currentLocale = locale || 'en';
      const translations = await loadTranslations(currentLocale);
      
      // Get translation by key path (supports nested keys like "homepage.hero.title")
      const keys = id.split('.');
      let value: any = translations;
      
      for (const key of keys) {
        value = value?.[key];
        if (value === undefined) break;
      }
      
      // Apply values if provided
      if (typeof value === 'string' && values) {
        const replacedValue = value.replace(/\{\{(\w+)\}\}/g, (match, key) => {
          return values[key]?.toString() || match;
        });
        setTranslation(replacedValue);
      } else if (typeof value === 'string') {
        setTranslation(value);
      } else {
        setTranslation(undefined);
      }
      setIsLoading(false);
    };

    loadTranslation();
  }, [id, values, locale]);

  if (isLoading) {
    return <>{children}</>;
  }

  return <>{translation || children}</>;
}

// Hook for getting current locale (SSR-safe)
export function useLocale(): string {
  // For SSR, return 'en' as default
  if (typeof window === 'undefined') return 'en';
  
  const [locale, setLocale] = React.useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('locale') || 'en';
  });

  React.useEffect(() => {
    // Listen for locale changes from language switcher
    const handleLocaleChange = (event: CustomEvent) => {
      if (event.detail && event.detail.locale) {
        setLocale(event.detail.locale);
      }
    };

    // Listen for URL changes (when user navigates)
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const newLocale = urlParams.get('locale') || 'en';
      setLocale(newLocale);
    };

    window.addEventListener('localeChanged', handleLocaleChange as EventListener);
    window.addEventListener('popstate', handleUrlChange);
    
    // Also check for URL changes periodically
    const interval = setInterval(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const newLocale = urlParams.get('locale') || 'en';
      if (newLocale !== locale) {
        setLocale(newLocale);
      }
    }, 1000);

    return () => {
      window.removeEventListener('localeChanged', handleLocaleChange as EventListener);
      window.removeEventListener('popstate', handleUrlChange);
      clearInterval(interval);
    };
  }, [locale]);

  return locale;
}

export default Translate;
