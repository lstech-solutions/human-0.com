import { MarkdownDocumentView } from '../components/ui/MarkdownDocumentView';
import { useLanguagePicker } from '@human-0/i18n/hooks';
import { useTheme } from '../theme/ThemeProvider';
import { Platform } from 'react-native';
import { Linking } from 'react-native';
import { getMainSiteUrl } from '../lib/docs-url';
import { Text, Pressable } from 'react-native';

export default function PrivacyScreen() {
  const { currentLanguage } = useLanguagePicker();
  const { colorScheme } = useTheme();
  
  const isDark = colorScheme === 'dark';

  // Handle opening privacy page in new tab with current locale and theme
  const handleOpenInNewTab = () => {
    // Point to Docusaurus documentation instead of API
    const privacyUrl = getMainSiteUrl('/docs/privacy', currentLanguage, isDark);
    if (Platform.OS === 'web') {
      window.open(privacyUrl, '_blank');
    } else {
      Linking.openURL(privacyUrl);
    }
  };

  return (
    <MarkdownDocumentView
      endpoint="privacy"
      titleKey="legal.privacyTitle"
      defaultTitle="Privacy Policy"
      showTitle={false}
      showOpenInNewTab={false}
      headerContent={
        <Pressable 
          onPress={handleOpenInNewTab}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#00FF9C' : '#059669',
            paddingBottom: 2,
            alignSelf: 'center',
            marginTop: 8,
          })}
        >
          <Text style={{ 
            fontSize: 14, 
            fontStyle: 'italic', 
            color: isDark ? '#00FF9C' : '#059669',
            textDecorationLine: 'underline',
            textDecorationColor: isDark ? '#00FF9C' : '#059669',
          }}>
            Last updated: November 28, 2025
          </Text>
        </Pressable>
      }
    />
  );
}
