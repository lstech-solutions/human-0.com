import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Fallback page for /documentation.
 * In production, GitHub Pages serves static Docusaurus files from /documentation.
 * This component only renders if the static files are missing (e.g., local dev or misconfiguration).
 */
export default function DocumentationFallback() {
  const router = useRouter();

  useEffect(() => {
    // If running in production and the docs are expected to be static, do nothing.
    // Otherwise, redirect to the running docs server.
    if (process.env.NODE_ENV === 'development') {
      // In development, docs run on port 3001
      window.location.href = 'http://localhost:3001';
      return;
    }

    // In production, we expect static files to be served from /documentation.
    // If this page renders, it means the static files are missing.
    // You can optionally redirect to the docs root or show an error.
    // Example: window.location.href = '/documentation/';
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Documentation</Text>
      <Text style={styles.message}>
        {process.env.NODE_ENV === 'development'
          ? 'Redirecting to local docs server...'
          : 'Documentation not found. Please ensure the docs are built and deployed.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#050B10',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E6ECE8',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#8b949e',
    textAlign: 'center',
    marginBottom: 24,
  },
});
