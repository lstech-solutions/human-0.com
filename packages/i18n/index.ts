import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

// Import all locale files
import en from "./locales/en.json";
import es from "./locales/es.json";
import esCO from "./locales/es-CO.json";
import esMX from "./locales/es-MX.json";
import esES from "./locales/es-ES.json";
import ptBR from "./locales/pt-BR.json";
import frFR from "./locales/fr-FR.json";
import arSA from "./locales/ar-SA.json";
import zhCN from "./locales/zh-CN.json";
import deDE from "./locales/de-DE.json";

// Supported locales with region variants
export const SUPPORTED_LOCALES = [
  "en",
  "de-DE",
  "es",
  "es-CO",
  "es-MX", 
  "es-ES",
  "pt-BR",
  "fr-FR",
  "ar-SA",
  "zh-CN",
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

// Language metadata for UI display
export const LANGUAGE_META: Record<SupportedLocale, { name: string; nativeName: string; rtl?: boolean }> = {
  en: { name: "English", nativeName: "English" },
  "de-DE": { name: "German (Germany)", nativeName: "Deutsch" },
  es: { name: "Spanish", nativeName: "Español" },
  "es-CO": { name: "Spanish (Colombia)", nativeName: "Español (Colombia)" },
  "es-MX": { name: "Spanish (Mexico)", nativeName: "Español (México)" },
  "es-ES": { name: "Spanish (Spain)", nativeName: "Español (España)" },
  "pt-BR": { name: "Portuguese (Brazil)", nativeName: "Português (Brasil)" },
  "fr-FR": { name: "French (France)", nativeName: "Français (France)" },
  "ar-SA": { name: "Arabic (Saudi Arabia)", nativeName: "العربية", rtl: true },
  "zh-CN": { name: "Chinese (Simplified)", nativeName: "简体中文" },
};

// Get device locale with fallback
function getDeviceLocale(): string {
  try {
    const locales = Localization.getLocales();
    if (locales && locales.length > 0) {
      const deviceLocale = locales[0];
      // Try full locale (e.g., es-CO)
      const fullLocale = `${deviceLocale.languageCode}-${deviceLocale.regionCode}`;
      if (SUPPORTED_LOCALES.includes(fullLocale as SupportedLocale)) {
        return fullLocale;
      }
      // Fall back to language code only
      if (deviceLocale.languageCode && SUPPORTED_LOCALES.includes(deviceLocale.languageCode as SupportedLocale)) {
        return deviceLocale.languageCode;
      }
    }
  } catch (error) {
    console.warn("[i18n] Could not detect device locale:", error);
  }
  return "en";
}

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v4",
    lng: getDeviceLocale(),
    fallbackLng: {
      "es-CO": ["es", "en"],
      "es-MX": ["es", "en"],
      "es-ES": ["es", "en"],
      "pt-BR": ["pt", "en"],
      "fr-FR": ["fr", "en"],
      "de-DE": ["de", "en"],
      "ar-SA": ["ar", "en"],
      "zh-CN": ["zh", "en"],
      default: ["en"],
    },
    resources: {
      en: { translation: en },
      es: { translation: es },
      "es-CO": { translation: esCO },
      "es-MX": { translation: esMX },
      "es-ES": { translation: esES },
      "pt-BR": { translation: ptBR },
      "fr-FR": { translation: frFR },
      "ar-SA": { translation: arSA },
      "zh-CN": { translation: zhCN },
      "de-DE": { translation: deDE },
    },
    interpolation: {
      escapeValue: false, // React already escapes
    },
    react: {
      useSuspense: false, // Disable suspense for Expo compatibility
    },
  });

export default i18n;

// Re-export hooks for convenience
export { useTranslation, Trans } from "react-i18next";

// Utility: Change language dynamically
export async function changeLanguage(locale: SupportedLocale): Promise<void> {
  await i18n.changeLanguage(locale);
}

// Utility: Get current language
export function getCurrentLanguage(): string {
  return i18n.language;
}

// Utility: Check if current language is RTL
export function isRTL(): boolean {
  const current = i18n.language as SupportedLocale;
  return LANGUAGE_META[current]?.rtl ?? false;
}
