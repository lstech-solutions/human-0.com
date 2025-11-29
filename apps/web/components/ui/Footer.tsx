import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { useLanguagePicker } from '@human-0/i18n/hooks';
import { useTheme } from '../../theme/ThemeProvider';
import { getDocsUrl } from '../../lib/docs-url';
import { useRouter } from 'expo-router';
import { getLegalDocumentUrl, getLegalDocumentHistoryUrl, useVersionInfo } from '../../lib/version-utils';
import VersionDrawer from '../VersionDrawer';
import { useState } from 'react';

export function Footer() {
  const { currentLanguage, languages, setLanguage } = useLanguagePicker();
  const { colorScheme } = useTheme();
  const router = useRouter();
  const { version } = useVersionInfo();
  const [isVersionDrawerOpen, setIsVersionDrawerOpen] = useState(false);

  const isDark = colorScheme === 'dark';

  // Get current language info
  const currentLang = languages.find(l => l.code === currentLanguage) || languages[0];

  // URL building functions
  const buildDocsUrl = (path: string) => {
    return getDocsUrl(path, currentLanguage, isDark);
  };

  // Handle navigation
  const handleNavigation = (path: string) => {
    // Build URL with locale and theme params
    const params = new URLSearchParams();
    if (currentLanguage && currentLanguage !== 'en') {
      params.append('locale', currentLanguage);
    }
    params.append('dark', isDark.toString());

    const paramString = params.toString();
    const fullPath = paramString ? `${path}?${paramString}` : path;

    // Use client-side routing for internal pages - cast to any to bypass TypeScript strict typing
    router.push(fullPath as any);
  };

  const handleExternalLink = (url: string) => {
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      // For native platforms, you might want to use Linking or other navigation
      console.log('Navigate to:', url);
    }
  };

  // Handle legal document links with version awareness
  const handleLegalLink = (documentType: 'terms' | 'privacy') => {
    if (Platform.OS === 'web') {
      // Check if we're in development mode
      const isDevelopment = process.env.NODE_ENV === 'development' ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

      if (isDevelopment) {
        // In development, use client-side routing instead of opening new tab
        handleNavigation(`/${documentType}`);
      } else {
        // In production, use versioned documentation in new tab
        const docsUrl = getLegalDocumentUrl(documentType, 'docs', undefined, {
          locale: currentLanguage,
          isDark: isDark
        });
        window.open(docsUrl, '_blank');
      }
    } else {
      // For native, navigate to internal page
      handleNavigation(`/${documentType}`);
    }
  };

  return (
    <View className={`w-full py-4 px-3 border-t ${isDark ? 'bg-[#050B10] border-gray-800' : 'bg-white border-gray-200'}`}>
      <View className="w-full px-4 sm:px-6 lg:px-8">
        {/* Mobile: Minimal branding */}
        <View className="flex flex-col items-center gap-2 lg:hidden">
          <Pressable onPress={() => handleNavigation('/')}>
            <Text className={`text-base font-bold ${isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-[#0A1628] hover:text-gray-900'}`}>
              HUMΛN-Ø
            </Text>
          </Pressable>
          <Text className={`text-xs text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Sustainable impact through Web3 technology
          </Text>
          <Text className={`text-xs text-center ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            © 2025 LSTS SAS. All rights reserved.
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Built with ❤️ and Web3 technology
          </Text>
          {version && (
            <Pressable onPress={() => setIsVersionDrawerOpen(true)}>
              <Text className={`text-xs ${isDark ? 'text-gray-500 hover:text-gray-400 underline decoration-dotted underline-offset-2 transition-colors' : 'text-gray-500 hover:text-gray-600 underline decoration-dotted underline-offset-2 transition-colors'}`}>
                v{version}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Desktop: Full footer */}
        <View className="hidden lg:flex lg:flex-col lg:gap-6">
          {/* Main footer content */}
          <View className="flex flex-row justify-between items-start gap-8">
            {/* Company section */}
            <View className="flex flex-col gap-3 flex-1">
              <Pressable onPress={() => handleNavigation('/')}>
                <Text className={`text-lg font-bold ${isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-[#0A1628] hover:text-gray-900'}`}>
                  HUMΛN-Ø
                </Text>
              </Pressable>
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-xs`}>
                Sustainable impact through Web3 technology
              </Text>
            </View>

            {/* Links section */}
            <View className="flex flex-row gap-8 flex-2">
              {/* Product links */}
              <View className="flex flex-col gap-2">
                <Text className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Product
                </Text>
                <Pressable onPress={() => handleNavigation('/')}>
                  <Text className={`text-sm ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                    Home
                  </Text>
                </Pressable>
                <Pressable onPress={() => handleExternalLink(buildDocsUrl('/'))}>
                  <Text className={`text-sm ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                    Documentation
                  </Text>
                </Pressable>
              </View>

              {/* Legal links */}
              <View className="flex flex-col gap-2">
                <Text className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Legal
                </Text>
                <Pressable onPress={() => handleLegalLink('terms')}>
                  <Text className={`text-sm ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                    Terms of Service
                  </Text>
                </Pressable>
                <Pressable onPress={() => handleLegalLink('privacy')}>
                  <Text className={`text-sm ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                    Privacy Policy
                  </Text>
                </Pressable>
              </View>

              {/* Language selector */}
              <View className="flex flex-col gap-2">
                <Text className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Language
                </Text>
                {languages.slice(0, 3).map((lang) => (
                  <Pressable key={lang.code} onPress={() => setLanguage(lang.code)}>
                    <Text className={`text-sm ${currentLanguage === lang.code ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : (isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900')}`}>
                      {lang.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          {/* Bottom bar */}
          <View className="flex flex-row justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <View className="flex flex-col gap-1">
              <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                © 2025 LSTS SAS. All rights reserved.
              </Text>
              <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Built with ❤️ and Web3 technology
              </Text>
            </View>
            {version && (
              <Pressable onPress={() => setIsVersionDrawerOpen(true)}>
                <Text className={`text-xs ${isDark ? 'text-gray-500 hover:text-gray-400 underline decoration-dotted underline-offset-2 transition-colors' : 'text-gray-500 hover:text-gray-600 underline decoration-dotted underline-offset-2 transition-colors'}`}>
                  v{version}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
      <VersionDrawer
        isOpen={isVersionDrawerOpen}
        appVersion={version || ''}
        onClose={() => setIsVersionDrawerOpen(false)}
      />
    </View>
  );
}
