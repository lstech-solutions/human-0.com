import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AuthenticatedProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Your PoSH Profile</Text>
      <View style={styles.profileContainer}>
        <Text style={styles.profileItem}>Level: Gold</Text>
        <Text style={styles.profileItem}>Score: 8,750</Text>
        <Text style={styles.profileItem}>Member Since: 2024</Text>
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
  profileContainer: {
    backgroundColor: '#1A1F2E',
    padding: 20,
    borderRadius: 12,
    width: '100%',
  },
  profileItem: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
  },
});
