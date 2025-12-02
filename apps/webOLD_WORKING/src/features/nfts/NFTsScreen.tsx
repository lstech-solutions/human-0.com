import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NFTsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NFTs</Text>
      <Text style={styles.subtitle}>Your PoSH NFTs will appear here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#050B10',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
  },
});
