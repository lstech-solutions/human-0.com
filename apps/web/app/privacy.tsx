import { useTranslation } from '@human-0/i18n';
import { ScrollView, StyleSheet, View, Text, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api-client';
import { Platform } from 'react-native';

export default function PrivacyScreen() {
  const { t } = useTranslation();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLocale, setCurrentLocale] = useState<string>('en');

  // Auto-detect language on mount
  useEffect(() => {
    const detectLanguage = () => {
      // Try to get stored preference first
      const stored = localStorage?.getItem('preferred-language');
      if (stored) return stored;
      
      // Auto-detect from browser
      if (Platform.OS === 'web' && navigator.language) {
        const browserLang = navigator.language.split('-')[0]; // 'es', 'en', etc.
        // Only use if we support this language
        return ['en', 'es'].includes(browserLang) ? browserLang : 'en';
      }
      
      return 'en'; // Default fallback
    };

    const detectedLocale = detectLanguage();
    setCurrentLocale(detectedLocale);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.request(`/api/privacy?locale=${currentLocale}`);
        const text = await res.text();
        setContent(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    })();
  }, [currentLocale]);

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

    const renderInlineFormatting = (text: string) => {
      const elements: JSX.Element[] = [];
      let lastIndex = 0;
      
      // Handle links [text](url) - create actual clickable links
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let match;
      
      while ((match = linkRegex.exec(text)) !== null) {
        // Add text before the link
        if (match.index > lastIndex) {
          const beforeText = text.slice(lastIndex, match.index);
          elements.push(...processTextFormatting(beforeText));
        }
        
        // Add the link
        const linkText = match[1];
        const linkUrl = match[2];
        elements.push(
          <Text 
            key={`link-${match.index}`}
            style={styles.link}
            onPress={() => Linking.openURL(linkUrl)}
          >
            {linkText}
          </Text>
        );
        
        lastIndex = match.index + match[0].length;
      }
      
      // Add remaining text
      if (lastIndex < text.length) {
        const remainingText = text.slice(lastIndex);
        elements.push(...processTextFormatting(remainingText));
      }
      
      return elements.length > 0 ? elements : processTextFormatting(text);
    };

    const processTextFormatting = (text: string) => {
      // Handle bold text **text** - convert to actual bold styling
      const hasBold = /\*\*(.*?)\*\*/.test(text);
      let processedText = text.replace(/\*\*(.*?)\*\*/g, '$1');
      
      // Handle italic text _text_  
      processedText = processedText.replace(/_([^_]+)_/g, '$1');
      
      if (hasBold) {
        return [<Text key="text" style={styles.bold}>{processedText}</Text>];
      } else {
        return [<Text key="text">{processedText}</Text>];
      }
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
        elements.push(<View key={i} style={styles.hr} />);
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
            <Text>• </Text>
            {content}
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
          <Text key={i} style={styles.h1}>
            {renderInlineFormatting(line.slice(2).trim())}
          </Text>
        );
      } else if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <Text key={i} style={styles.h2}>
            {renderInlineFormatting(line.slice(3).trim())}
          </Text>
        );
      } else if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <Text key={i} style={styles.h3}>
            {renderInlineFormatting(line.slice(4).trim())}
          </Text>
        );
      } else if (line.startsWith('> ')) {
        flushList();
        elements.push(
          <Text key={i} style={styles.blockquote}>
            {renderInlineFormatting(line.slice(2).trim())}
          </Text>
        );
      } else if (trimmedLine === '') {
        flushList();
        elements.push(<View key={i} style={styles.spacer} />);
      } else {
        // Plain paragraph with inline formatting
        flushList();
        
        // Special handling for "Last updated" line
        if (trimmedLine.includes('Last updated:')) {
          elements.push(
            <Text key={i} style={styles.lastUpdated}>
              {renderInlineFormatting(line.trim())}
            </Text>
          );
        } else {
          elements.push(
            <Text key={i} style={styles.p}>
              {renderInlineFormatting(line.trim())}
            </Text>
          );
        }
      }
    });

    // Flush any remaining list
    flushList();
    
    return elements;
  };

  const changeLanguage = (locale: string) => {
    setCurrentLocale(locale);
    // Store preference for future visits
    if (Platform.OS === 'web') {
      localStorage.setItem('preferred-language', locale);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{t('legal.privacyTitle', 'Privacy Policy')}</Text>
        {loading ? (
          <Text style={styles.p}>Loading…</Text>
        ) : error ? (
          <Text style={styles.error}>Error: {error}</Text>
        ) : Platform.OS === 'web' ? (
          <div dangerouslySetInnerHTML={renderHTMLMarkdown(content) || { __html: '' }} />
        ) : (
          renderMarkdown(content)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050B10',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E6ECE8',
    marginBottom: 24,
    textAlign: 'center',
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E6ECE8',
    marginTop: 24,
    marginBottom: 12,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E6ECE8',
    marginTop: 20,
    marginBottom: 10,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E6ECE8',
    marginTop: 16,
    marginBottom: 8,
  },
  p: {
    fontSize: 16,
    color: '#E6ECE8',
    lineHeight: 24,
    marginBottom: 12,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#00FF9C',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 16,
  },
  link: {
    color: '#00FF9C',
    textDecorationLine: 'underline',
  },
  bold: {
    fontWeight: 'bold',
    color: '#E6ECE8',
  },
  languageSwitcher: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#0A1419',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00FF9C',
  },
  languageLabel: {
    fontSize: 14,
    color: '#E6ECE8',
    fontWeight: '600',
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  languageButton: {
    fontSize: 12,
    color: '#E6ECE8',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E6ECE8',
  },
  languageButtonActive: {
    backgroundColor: '#00FF9C',
    color: '#050B10',
    borderColor: '#00FF9C',
    fontWeight: 'bold',
  },
  li: {
    fontSize: 16,
    color: '#E6ECE8',
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
    backgroundColor: '#00FF9C',
    marginVertical: 16,
    opacity: 0.3,
  },
  blockquote: {
    fontSize: 16,
    color: '#E6ECE8',
    fontStyle: 'italic',
    borderLeftWidth: 3,
    borderLeftColor: '#00FF9C',
    paddingLeft: 12,
    marginBottom: 12,
  },
  spacer: {
    height: 12,
  },
  error: {
    fontSize: 16,
    color: '#ff6b6b',
    marginBottom: 12,
  },
});
