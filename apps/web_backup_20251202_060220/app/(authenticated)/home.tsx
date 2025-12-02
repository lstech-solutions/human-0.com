import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AuthenticatedHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to HUMAN-0</Text>
      <Text style={styles.subtitle}>Your PoSH Identity is Connected</Text>
      <Text style={styles.description}>
        You now have access to the full PoSH ecosystem including:
      </Text>
      <Text style={styles.feature}>• Impact tracking</Text>
      <Text style={styles.feature}>• NFT collection</Text>
      <Text style={styles.feature}>• Dashboard analytics</Text>
      <Text style={styles.feature}>• Profile management</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#050B10',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#00FF9C',
    marginBottom: 24,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 20,
    textAlign: 'center',
  },
  feature: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
});
