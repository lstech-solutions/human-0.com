import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { useLanguagePicker } from '@human-0/i18n/hooks';
import { useTheme } from '../../theme/ThemeProvider';
import { getDocsUrl } from '../../lib/docs-url';
import { useRouter } from 'expo-router';
import { getLegalDocumentUrl, getLegalDocumentHistoryUrl, useVersionInfo } from '../../lib/version-utils';

export function Footer() {
  const { currentLanguage, languages, setLanguage } = useLanguagePicker();
  const { colorScheme } = useTheme();
  const router = useRouter();
  const { version } = useVersionInfo();
  
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
        {/* Main content - HUMΛN-Ø left, legal/resources right in 3x2 grid */}
        <View className="flex flex-col lg:flex-row gap-4 lg:gap-8 mb-4">
          
          {/* HUMΛN-Ø section - left side */}
          <View className="lg:w-1/3">
            <Pressable onPress={() => handleNavigation('/')}>
              <Text className={`text-base font-bold mb-2 ${isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-[#0A1628] hover:text-gray-900'}`}>
                HUMΛN-Ø
              </Text>
            </Pressable>
            <Text className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Sustainable impact through Web3 technology
            </Text>
            <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              © 2025 LSTS SAS. All rights reserved.
            </Text>
          </View>

          {/* Legal & Resources sections - right side in same row */}
          <View className="lg:w-2/3 flex flex-col sm:flex-row gap-4">
            
            {/* Legal section */}
            <View className="flex-1">
              <Text className={`text-base font-bold mb-2 ${isDark ? 'text-emerald-400' : 'text-[#0A1628]'}`}>
                Legal
              </Text>
              <Pressable onPress={() => handleNavigation('privacy')}>
                <Text className={`text-xs mb-1 ${isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-700 hover:text-[#0A1628]'}`}>
                  Privacy Policy
                </Text>
              </Pressable>
              <Pressable onPress={() => handleNavigation('terms')}>
                <Text className={`text-xs mb-1 ${isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-900 hover:text-[#0A1628]'}`}>
                  Terms of Service
                </Text>
              </Pressable>
            </View>

            {/* Resources section */}
            <View className="flex-1">
              <Text className={`text-base font-bold mb-2 ${isDark ? 'text-emerald-400' : 'text-[#0A1628]'}`}>
                Resources
              </Text>
              <Pressable onPress={() => handleExternalLink(buildDocsUrl('/intro'))}>
                <Text className={`text-xs mb-1 ${isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-700 hover:text-[#0A1628]'}`}>
                  Introduction
                </Text>
              </Pressable>
              <Pressable onPress={() => handleExternalLink(buildDocsUrl('/architecture'))}>
                <Text className={`text-xs mb-1 ${isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-700 hover:text-[#0A1628]'}`}>
                  Architecture
                </Text>
              </Pressable>
              <Pressable onPress={() => handleExternalLink('https://github.com/lstech-solutions/human-0.com')}>
                <Text className={`text-xs mb-1 ${isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-700 hover:text-[#0A1628]'}`}>
                  GitHub
                </Text>
              </Pressable>
            </View>

            {/* Connect section */}
            <View className="flex-1">
              <Text className={`text-base font-bold mb-2 ${isDark ? 'text-emerald-400' : 'text-[#0A1628]'}`}>
                Connect
              </Text>
              <Pressable onPress={() => handleNavigation('/impact')}>
                <Text className={`text-xs mb-1 ${isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-700 hover:text-[#0A1628]'}`}>
                  Impact Tracking
                </Text>
              </Pressable>
              <Pressable onPress={() => handleNavigation('/profile')}>
                <Text className={`text-xs mb-1 ${isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-700 hover:text-[#0A1628]'}`}>
                  Profile
                </Text>
              </Pressable>
              <Pressable onPress={() => handleNavigation('/nfts')}>
                <Text className={`text-xs mb-1 ${isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-700 hover:text-[#0A1628]'}`}>
                  NFT Collection
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Bottom bar - more compact on mobile */}
        <View className={`pt-3 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <View className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Built with ❤️ and Web3 technology
            </Text>
            <View className="flex flex-row items-center gap-2 sm:gap-4">
              <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                v{version}
              </Text>
              <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Language: {currentLang?.nativeName || currentLanguage?.toUpperCase()}
              </Text>
              <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Theme: {isDark ? '🌙 Dark' : '☀️ Light'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
