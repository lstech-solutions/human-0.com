import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AuthenticatedNFTsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NFT Collection</Text>
      <Text style={styles.subtitle}>Your PoSH NFTs</Text>
      <View style={styles.collectionContainer}>
        <Text style={styles.nftCount}>Total NFTs: 5</Text>
        <Text style={styles.description}>
          Your soulbound PoSH NFTs represent your verified sustainability achievements.
        </Text>
      </View>
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
  collectionContainer: {
    backgroundColor: '#1A1F2E',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  nftCount: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
