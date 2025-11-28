import { useCallback } from "react";
import { useTranslation as useI18nTranslation } from "react-i18next";
import { I18nManager } from "react-native";
import {
  changeLanguage,
  getCurrentLanguage,
  isRTL,
  LANGUAGE_META,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "./index";

/**
 * Enhanced translation hook with RTL and language metadata support
 */
export function useTranslation(namespace?: string) {
  const { t, i18n, ready } = useI18nTranslation(namespace);

  const currentLanguage = getCurrentLanguage() as SupportedLocale;
  const languageMeta = LANGUAGE_META[currentLanguage] || LANGUAGE_META.en;
  const rtl = isRTL();

  const setLanguage = useCallback(async (locale: SupportedLocale) => {
    await changeLanguage(locale);
    const newRtl = LANGUAGE_META[locale]?.rtl ?? false;
    
    // Handle RTL layout changes (requires app restart on native)
    if (I18nManager.isRTL !== newRtl) {
      I18nManager.allowRTL(newRtl);
      I18nManager.forceRTL(newRtl);
    }
  }, []);

  return {
    t,
    i18n,
    ready,
    currentLanguage,
    languageMeta,
    rtl,
    setLanguage,
    supportedLocales: SUPPORTED_LOCALES,
    languageOptions: LANGUAGE_META,
  };
}

/**
 * Hook for language picker component
 */
export function useLanguagePicker() {
  const { currentLanguage, setLanguage } = useTranslation();

  const languages = SUPPORTED_LOCALES.map((locale) => ({
    code: locale,
    ...LANGUAGE_META[locale],
  }));

  return {
    currentLanguage,
    languages,
    setLanguage,
  };
}

export type { SupportedLocale };
