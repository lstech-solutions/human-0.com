import { useTranslation } from '@human-0/i18n';
import { useLanguagePicker } from '@human-0/i18n/hooks';
import { ScrollView, StyleSheet, View, Text, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api-client';
import { Platform } from 'react-native';
import { Footer } from '../components/ui/Footer';
import { useTheme } from '../theme/ThemeProvider';

export default function TermsScreen() {
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
        const res = await apiClient.request(`/api/terms?locale=${currentLanguage}`);
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

  // Simple markdown-to-text rendering for now.
  // In the future you can swap in a proper markdown renderer.
  const renderMarkdown = (md: string) => {
    const lines = md.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('# ')) {
        return (
          <Text key={i} style={[styles.h1, { color: isDark ? '#E6ECE8' : '#0A1628' }]}>
            {line.slice(2).trim()}
          </Text>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <Text key={i} style={[styles.h2, { color: isDark ? '#E6ECE8' : '#0A1628' }]}>
            {line.slice(3).trim()}
          </Text>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <Text key={i} style={[styles.h3, { color: isDark ? '#E6ECE8' : '#0A1628' }]}>
            {line.slice(4).trim()}
          </Text>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <Text key={i} style={[styles.li, { color: isDark ? '#E6ECE8' : '#374151' }]}>
            • {line.slice(2).trim()}
          </Text>
        );
      }
      if (line.startsWith('> ')) {
        return (
          <Text key={i} style={[styles.blockquote, { color: isDark ? '#E6ECE8' : '#374151', borderLeftColor: isDark ? '#00FF9C' : '#059669' }]}>
            {line.slice(2).trim()}
          </Text>
        );
      }
      if (line.trim() === '') {
        return <View key={i} style={styles.spacer} />;
      }
      // Plain paragraph
      return (
        <Text key={i} style={[styles.p, { color: isDark ? '#E6ECE8' : '#374151' }]}>
          {line.trim()}
        </Text>
      );
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#050B10' : '#ffffff' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: isDark ? '#E6ECE8' : '#0A1628' }]}>
          {t('legal.termsTitle', 'Terms of Service')}
        </Text>
        {loading ? (
          <Text style={[styles.p, { color: isDark ? '#E6ECE8' : '#374151' }]}>Loading…</Text>
        ) : error ? (
          <Text style={[styles.error, { color: '#dc2626' }]}>Error: {error}</Text>
        ) : Platform.OS === 'web' ? (
          <div dangerouslySetInnerHTML={renderHTMLMarkdown(content) || { __html: '' }} />
        ) : (
          renderMarkdown(content)
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
  li: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 20,
    marginBottom: 6,
    lineHeight: 22,
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
