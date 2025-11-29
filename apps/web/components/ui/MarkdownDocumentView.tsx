import { useTranslation } from '@human-0/i18n';
import { useLanguagePicker } from '@human-0/i18n/hooks';
import { ScrollView, StyleSheet, View, Text, Linking, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { apiClient } from '../../lib/api-client';
import { Platform } from 'react-native';
import { Footer } from './Footer';
import { useTheme } from '../../theme/ThemeProvider';

export interface MarkdownDocumentConfig {
  /** API endpoint path (e.g., 'privacy', 'terms') */
  endpoint: string;
  /** Translation key for the title */
  titleKey: string;
  /** Default title fallback */
  defaultTitle: string;
  /** Whether to show an "open in new tab" button */
  showOpenInNewTab?: boolean;
  /** Custom handler for opening in new tab */
  onOpenInNewTab?: () => void;
  /** Additional content to render before the document */
  headerContent?: React.ReactNode;
  /** Additional content to render after the document */
  footerContent?: React.ReactNode;
  /** Whether to show the main title in the document */
  showTitle?: boolean;
}

export function MarkdownDocumentView({
  endpoint,
  titleKey,
  defaultTitle,
  showOpenInNewTab = false,
  onOpenInNewTab,
  headerContent,
  footerContent,
  showTitle = true
}: MarkdownDocumentConfig) {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguagePicker();
  const { colorScheme } = useTheme();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isDark = colorScheme === 'dark';

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.request(`/api/${endpoint}?locale=${currentLanguage}`);
        const text = await res.text();
        setContent(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    })();
  }, [currentLanguage, endpoint]);

  // Enhanced HTML markdown renderer for web mode with better styling
  const renderHTMLMarkdown = (md: string) => {
    if (Platform.OS === 'web') {
      // Convert markdown to HTML with enhanced styling
      let html = md
        // Handle headers with better styling
        .replace(/^# (.*$)/gim, `<h1 style="color: ${isDark ? '#E6ECE8' : '#1F2937'}; font-size: 28px; font-weight: bold; margin: 24px 0 12px 0; line-height: 1.3;">$1</h1>`)
        .replace(/^## (.*$)/gim, `<h2 style="color: ${isDark ? '#E6ECE8' : '#1F2937'}; font-size: 20px; font-weight: 600; margin: 20px 0 10px 0; line-height: 1.4;">$1</h2>`)
        .replace(/^### (.*$)/gim, `<h3 style="color: ${isDark ? '#E6ECE8' : '#1F2937'}; font-size: 18px; font-weight: 600; margin: 16px 0 8px 0; line-height: 1.4;">$1</h3>`)
        // Handle bold with better weight
        .replace(/\*\*(.*?)\*\*/gim, '<strong style="font-weight: 700; color: inherit;">$1</strong>')
        // Handle italic
        .replace(/\*(.*?)\*/gim, '<em style="font-style: italic; color: inherit;">$1</em>')
        .replace(/_(.*?)_/gim, '<em style="font-style: italic; color: inherit;">$1</em>')
        // Handle inline code
        .replace(/`([^`]+)`/gim, `<code style="background-color: ${isDark ? '#1F2937' : '#F3F4F6'}; color: ${isDark ? '#00FF9C' : '#059669'}; padding: 2px 6px; border-radius: 4px; font-family: 'Monaco', 'Menlo', monospace; font-size: 0.9em;">$1</code>`)
        // Handle links with better hover effects
        .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, `<a href="$2" target="_blank" rel="noopener noreferrer" style="color: ${isDark ? '#00FF9C' : '#059669'}; text-decoration: underline; font-weight: 500; transition: color 0.2s ease;" onmouseover="this.style.color='${isDark ? '#00E6CC' : '#047857'}'" onmouseout="this.style.color='${isDark ? '#00FF9C' : '#059669'}'">$1</a>`)
        // Handle ordered lists
        .replace(/^\d+\. (.*$)/gim, '<li style="list-style-type: decimal; margin-left: 20px; margin-bottom: 6px; color: inherit;">$1</li>')
        // Handle unordered lists with better styling
        .replace(/^- (.*$)/gim, '<li style="list-style-type: disc; margin-left: 20px; margin-bottom: 6px; color: inherit;">$1</li>')
        // Wrap lists in proper containers
        .replace(/(<li style.*?<\/li>)/s, '<ul style="margin: 12px 0; padding-left: 20px; color: inherit;">$1</ul>')
        // Handle blockquotes with better styling
        .replace(/^> (.*$)/gim, `<blockquote style="border-left: 3px solid ${isDark ? '#00FF9C' : '#059669'}; padding-left: 16px; margin: 16px 0; font-style: italic; color: ${isDark ? '#E6ECE8' : '#4B5563'}; background-color: ${isDark ? 'rgba(0, 255, 156, 0.05)' : 'rgba(5, 150, 105, 0.05)'}; padding: 12px 16px; border-radius: 0 8px 8px 0;">$1</blockquote>`)
        // Handle horizontal rules with better styling
        .replace(/^---$/gim, `<hr style="border: none; height: 1px; background: linear-gradient(to right, transparent, ${isDark ? '#00FF9C' : '#059669'}, transparent); opacity: 0.5; margin: 24px 0;" />`)
        // Handle line breaks
        .replace(/\n\n/gim, '</p><p>')
        .replace(/\n/gim, '<br />');
      
      // Wrap in paragraphs with enhanced theme-aware styling
      html = `<div style="color: ${isDark ? '#E6ECE8' : '#374151'}; font-size: 16px; line-height: 1.7; max-width: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0 auto;"><p style="margin: 0 0 16px 0; text-align: justify;">${html}</p></div>`;
      
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
      // Handle inline code `code`
      const codeRegex = /`([^`]+)`/g;
      const hasCode = codeRegex.test(text);
      let processedText = text;
      
      if (hasCode) {
        const codeElements: JSX.Element[] = [];
        let lastIndex = 0;
        let match;
        
        while ((match = codeRegex.exec(text)) !== null) {
          // Add text before code
          if (match.index > lastIndex) {
            const beforeText = text.slice(lastIndex, match.index);
            codeElements.push(
              <Text key={`text-${lastIndex}`} style={{ color: isDark ? '#E6ECE8' : '#374151' }}>
                {beforeText}
              </Text>
            );
          }
          
          // Add code element
          codeElements.push(
            <Text key={`code-${lastIndex}`} style={[styles.inlineCode, { backgroundColor: isDark ? '#1F2937' : '#F3F4F6' }]}>
              {match[1]}
            </Text>
          );
          
          lastIndex = match.index + match[0].length;
        }
        
        // Add remaining text
        if (lastIndex < text.length) {
          codeElements.push(
            <Text key={`text-${lastIndex}`} style={{ color: isDark ? '#E6ECE8' : '#374151' }}>
              {text.slice(lastIndex)}
            </Text>
          );
        }
        
        return codeElements;
      }
      
      // Handle bold text **text** - convert to actual bold styling
      const hasBold = /\*\*(.*?)\*\*/.test(text);
      processedText = processedText.replace(/\*\*(.*?)\*\*/g, '$1');
      
      // Handle italic text _text_  
      processedText = processedText.replace(/_([^_]+)_/g, '$1');
      
      if (hasBold) {
        return [<Text key="text" style={[styles.bold, { color: isDark ? '#E6ECE8' : '#1F2937' }]}>{processedText}</Text>];
      } else {
        return [<Text key="text" style={{ color: isDark ? '#E6ECE8' : '#4B5563' }}>{processedText}</Text>];
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
            <Text key={`text-${lastIndex}`} style={{ color: isDark ? '#E6ECE8' : '#4B5563' }}>
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
            <Text key={`text-${lastIndex}`} style={{ color: isDark ? '#E6ECE8' : '#4B5563' }}>
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

      // Handle ordered list items
      if (line.match(/^(\s*)\d+\. /)) {
        const match = line.match(/^(\s*)\d+\. /);
        const indent = match ? match[1].length : 0;
        const content = renderInlineFormatting(line.replace(/^(\s*)\d+\. /, '').trim());
        
        if (!inList) {
          inList = true;
          listIndent = indent;
        }
        
        currentList.push(
          <View key={i} style={[styles.li, indent > listIndent && styles.liNested]}>
            <Text style={{ color: isDark ? '#E6ECE8' : '#4B5563', fontWeight: '600', marginRight: 8 }}>
              {line.match(/^(\s*)(\d+)\./)?.[2]}.
            </Text>
            {content}
          </View>
        );
        return;
      }

      // Handle unordered list items
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
            <Text style={{ color: isDark ? '#E6ECE8' : '#4B5563' }}>• </Text>
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
          <Text key={i} style={[styles.h1, { color: isDark ? '#E6ECE8' : '#1F2937' }]}>
            {renderInlineFormatting(line.slice(2).trim())}
          </Text>
        );
      } else if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <Text key={i} style={[styles.h2, { color: isDark ? '#E6ECE8' : '#1F2937' }]}>
            {renderInlineFormatting(line.slice(3).trim())}
          </Text>
        );
      } else if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <Text key={i} style={[styles.h3, { color: isDark ? '#E6ECE8' : '#1F2937' }]}>
            {renderInlineFormatting(line.slice(4).trim())}
          </Text>
        );
      } else if (line.startsWith('> ')) {
        flushList();
        elements.push(
          <Text key={i} style={[styles.blockquote, { color: isDark ? '#E6ECE8' : '#4B5563', borderLeftColor: isDark ? '#00FF9C' : '#059669' }]}>
            {renderInlineFormatting(line.slice(2).trim())}
          </Text>
        );
      } else if (trimmedLine !== '') {
        flushList();
        elements.push(
          <Text key={i} style={[styles.p, { color: isDark ? '#E6ECE8' : '#4B5563' }]}>
            {renderInlineFormatting(line.trim())}
          </Text>
        );
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
        {(showTitle || headerContent || showOpenInNewTab) && (
          <View style={styles.headerSection}>
            {showTitle && (
              <Text style={[styles.title, { color: isDark ? '#E6ECE8' : '#1F2937' }]}>
                {t(titleKey, defaultTitle)}
              </Text>
            )}
            
            {(headerContent || showOpenInNewTab) && (
              <View style={styles.headerActions}>
                {headerContent}
                {showOpenInNewTab && onOpenInNewTab && (
                  <Pressable onPress={onOpenInNewTab} style={styles.openNewTabButton}>
                    <Text style={[styles.openNewTabIcon, { color: isDark ? '#00FF9C' : '#059669' }]}>
                      ⬈
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
        )}

        {loading ? (
          <Text style={[styles.p, { color: isDark ? '#E6ECE8' : '#4B5563' }]}>Loading…</Text>
        ) : error ? (
          <Text style={[styles.error, { color: '#dc2626' }]}>Error: {error}</Text>
        ) : Platform.OS === 'web' ? (
          <div dangerouslySetInnerHTML={renderHTMLMarkdown(content) || { __html: '' }} />
        ) : (
          renderMarkdown(content)
        )}

        {footerContent}
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
  headerSection: {
    marginBottom: 24,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 12,
    lineHeight: 31,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 10,
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
    lineHeight: 25,
  },
  p: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 27,
    marginBottom: 16,
    textAlign: 'justify',
  },
  bold: {
    fontWeight: '700',
    color: '#1F2937',
  },
  inlineCode: {
    fontSize: 14,
    fontFamily: 'Monaco, Menlo, monospace',
    color: '#059669',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  li: {
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 20,
    marginBottom: 6,
    lineHeight: 22,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  liNested: {
    marginLeft: 40,
    marginBottom: 4,
  },
  listContainer: {
    marginBottom: 16,
  },
  hr: {
    height: 1,
    backgroundColor: '#059669',
    marginVertical: 24,
    opacity: 0.5,
  },
  blockquote: {
    fontSize: 16,
    color: '#4B5563',
    fontStyle: 'italic',
    borderLeftWidth: 3,
    borderLeftColor: '#059669',
    paddingLeft: 16,
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(5, 150, 105, 0.05)',
    borderStyle: 'solid',
  },
  spacer: {
    height: 12,
  },
  error: {
    fontSize: 16,
    color: '#dc2626',
    marginBottom: 12,
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
});
