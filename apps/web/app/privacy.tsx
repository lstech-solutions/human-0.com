import { useTranslation } from '@human-0/i18n';
import { useLanguagePicker } from '@human-0/i18n/hooks';
import { ScrollView, StyleSheet, View, Text, Linking, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api-client';
import { Platform } from 'react-native';
import { Footer } from '../components/ui/Footer';
import { useTheme } from '../theme/ThemeProvider';
import { getMainSiteUrl } from '../lib/docs-url';

export default function PrivacyScreen() {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguagePicker();
  const { colorScheme } = useTheme();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isDark = colorScheme === 'dark';

  // Handle opening privacy page in new tab with current locale and theme
  const handleOpenInNewTab = () => {
    const privacyUrl = getMainSiteUrl('/privacy', currentLanguage, isDark);
    if (Platform.OS === 'web') {
      window.open(privacyUrl, '_blank');
    } else {
      Linking.openURL(privacyUrl);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.request(`/api/privacy?locale=${currentLanguage}`);
        const text = await res.text();
        setContent(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    })();
  }, [currentLanguage]);

  // HTML markdown renderer for web mode
  const renderHTMLMarkdown = (md: string) => {
    if (Platform.OS === 'web') {
      // Convert markdown to HTML for web
      let html = md
        // Handle headers
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        // Handle bold
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        // Handle italic
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        .replace(/_(.*?)_/gim, '<em>$1</em>')
        // Handle links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #00FF9C; text-decoration: underline;">$1</a>')
        // Handle lists
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        // Handle blockquotes
        .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
        // Handle horizontal rules
        .replace(/^---$/gim, '<hr style="border: 1px solid #00FF9C; opacity: 0.3; margin: 16px 0;" />')
        // Handle line breaks
        .replace(/\n\n/gim, '</p><p>')
        .replace(/\n/gim, '<br />');
      
      // Wrap in paragraphs
      html = `<div style="color: #E6ECE8; font-size: 16px; line-height: 24px; max-width: 100%;"><p>${html}</p></div>`;
      
      return {
        __html: html
      };
    }
    return null;
  };

  // Enhanced markdown-to-text rendering with inline formatting
  const renderMarkdown = (md: string) => {
    const lines = md.split('\n');
    const elements: JSX.Element[] = [];
    let currentList: JSX.Element[] = [];
    let inList = false;
    let listIndent = 0;

    const processTextFormatting = (text: string) => {
      // Handle bold text **text** - convert to actual bold styling
      const hasBold = /\*\*(.*?)\*\*/.test(text);
      let processedText = text.replace(/\*\*(.*?)\*\*/g, '$1');
      
      // Handle italic text _text_  
      processedText = processedText.replace(/_([^_]+)_/g, '$1');
      
      if (hasBold) {
        return [<Text key="text" style={[styles.bold, { color: isDark ? '#E6ECE8' : '#0A1628' }]}>{processedText}</Text>];
      } else {
        return [<Text key="text" style={{ color: isDark ? '#E6ECE8' : '#374151' }}>{processedText}</Text>];
      }
    };

    const renderInlineFormatting = (text: string) => {
      const elements: JSX.Element[] = [];
      let lastIndex = 0;
      
      // Handle links [text](url) - create actual clickable links
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let match: RegExpExecArray | null;
      
      while ((match = linkRegex.exec(text)) !== null) {
        // Add text before the link
        if (match.index > lastIndex) {
          const beforeText = text.slice(lastIndex, match.index);
          elements.push(
            <Text key={`text-${lastIndex}`} style={{ color: isDark ? '#E6ECE8' : '#374151' }}>
              {text.slice(lastIndex, match.index)}
            </Text>
          );
        }
        
        // Add the clickable link
        elements.push(
          <Text 
            key={`link-${lastIndex}`} 
            style={{ color: isDark ? '#00FF9C' : '#059669', textDecorationLine: 'underline' }}
            onPress={() => match && Linking.openURL(match[2])}
          >
            {match ? match[1] : ''}
          </Text>
        );
        
        lastIndex = match ? match.index + match[0].length : lastIndex;
      }
      
      // Add remaining text
      if (lastIndex < text.length) {
        const remainingText = text.slice(lastIndex);
        if (remainingText.trim()) {
          elements.push(
            <Text key={`text-${lastIndex}`} style={{ color: isDark ? '#E6ECE8' : '#374151' }}>
              {remainingText}
            </Text>
          );
        }
      }
      
      return elements.length > 0 ? elements : processTextFormatting(text);
    };

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <View key={`list-${elements.length}`} style={styles.listContainer}>
            {currentList}
          </View>
        );
        currentList = [];
        inList = false;
      }
    };

    lines.forEach((line, i) => {
      const trimmedLine = line.trim();
      
      // Handle horizontal rules
      if (trimmedLine === '---') {
        flushList();
        elements.push(
          <View 
            key={i} 
            style={[styles.hr, { backgroundColor: isDark ? '#00FF9C' : '#059669' }]} 
          />
        );
        return;
      }

      // Handle list items
      if (line.match(/^(\s*)- /)) {
        const match = line.match(/^(\s*)- /);
        const indent = match ? match[1].length : 0;
        const content = renderInlineFormatting(line.replace(/^(\s*)- /, '').trim());
        
        if (!inList) {
          inList = true;
          listIndent = indent;
        }
        
        currentList.push(
          <View key={i} style={[styles.li, indent > listIndent && styles.liNested]}>
            <Text style={{ color: isDark ? '#E6ECE8' : '#374151' }}>• </Text>
            {renderInlineFormatting(line.replace(/^(\s*)- /, '').trim())}
          </View>
        );
        return;
      }

      // If we were in a list and now we're not, flush it
      if (inList && !line.startsWith(' ') && trimmedLine !== '') {
        flushList();
      }

      // Handle headings
      if (line.startsWith('# ')) {
        flushList();
        elements.push(
          <Text key={i} style={[styles.h1, { color: isDark ? '#E6ECE8' : '#0A1628' }]}>
            {renderInlineFormatting(line.slice(2).trim())}
          </Text>
        );
      } else if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <Text key={i} style={[styles.h2, { color: isDark ? '#E6ECE8' : '#0A1628' }]}>
            {renderInlineFormatting(line.slice(3).trim())}
          </Text>
        );
      } else if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <Text key={i} style={[styles.h3, { color: isDark ? '#E6ECE8' : '#0A1628' }]}>
            {renderInlineFormatting(line.slice(4).trim())}
          </Text>
        );
      } else if (line.startsWith('> ')) {
        flushList();
        elements.push(
          <Text key={i} style={[styles.blockquote, { color: isDark ? '#E6ECE8' : '#374151', borderLeftColor: isDark ? '#00FF9C' : '#059669' }]}>
            {renderInlineFormatting(line.slice(2).trim())}
          </Text>
        );
      } else if (trimmedLine !== '') {
        flushList();
        if (line.includes('Last updated:')) {
          elements.push(
            <Text key={i} style={[styles.lastUpdated, { color: isDark ? '#00FF9C' : '#059669' }]}>
              {renderInlineFormatting(line.trim())}
            </Text>
          );
        } else {
          elements.push(
            <Text key={i} style={[styles.p, { color: isDark ? '#E6ECE8' : '#374151' }]}>
              {renderInlineFormatting(line.trim())}
            </Text>
          );
        }
      } else {
        flushList();
        elements.push(<View key={i} style={styles.spacer} />);
      }
    });

    // Flush any remaining list
    flushList();

    return elements;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#050B10' : '#ffffff' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <Text style={[styles.title, { color: isDark ? '#E6ECE8' : '#0A1628' }]}>
            Loading...
          </Text>
        ) : error ? (
          <View>
            <Text style={[styles.title, { color: isDark ? '#E6ECE8' : '#0A1628' }]}>
              Error
            </Text>
            <Text style={[styles.error, { color: '#dc2626' }]}>
              {error}
            </Text>
          </View>
        ) : (
          <View>
            <Text style={[styles.title, { color: isDark ? '#E6ECE8' : '#0A1628' }]}>
              {t('privacy.title')}
            </Text>
            <View style={styles.lastUpdatedContainer}>
              <Text style={[styles.lastUpdated, { color: isDark ? '#00FF9C' : '#059669' }]}>
                {t('privacy.lastUpdated')}
              </Text>
              <Pressable onPress={handleOpenInNewTab} style={styles.openNewTabButton}>
                <Text style={[styles.openNewTabIcon, { color: isDark ? '#00FF9C' : '#059669' }]}>
                  ⬈
                </Text>
              </Pressable>
            </View>
            {renderMarkdown(content)}
          </View>
        )}
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0A1628',
    marginBottom: 24,
    textAlign: 'center',
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A1628',
    marginTop: 24,
    marginBottom: 12,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0A1628',
    marginTop: 20,
    marginBottom: 10,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0A1628',
    marginTop: 16,
    marginBottom: 8,
  },
  p: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 12,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#059669',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 16,
  },
  lastUpdatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  openNewTabButton: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  openNewTabIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#059669',
    textDecorationLine: 'underline',
  },
  bold: {
    fontWeight: 'bold',
    color: '#0A1628',
  },
  li: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 20,
    marginBottom: 6,
    lineHeight: 22,
  },
  liNested: {
    marginLeft: 40,
    marginBottom: 4,
  },
  listContainer: {
    marginBottom: 12,
  },
  hr: {
    height: 1,
    backgroundColor: '#059669',
    marginVertical: 16,
    opacity: 0.3,
  },
  blockquote: {
    fontSize: 16,
    color: '#374151',
    fontStyle: 'italic',
    borderLeftWidth: 3,
    borderLeftColor: '#059669',
    paddingLeft: 12,
    marginBottom: 12,
  },
  spacer: {
    height: 12,
  },
  error: {
    fontSize: 16,
    color: '#dc2626',
    marginBottom: 12,
  },
});
