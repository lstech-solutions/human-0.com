import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AuthenticatedImpactScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Impact Tracking</Text>
      <Text style={styles.subtitle}>Your Sustainability Impact</Text>
      <View style={styles.metricContainer}>
        <Text style={styles.metric}>CO₂ Saved: 1,234 kg</Text>
        <Text style={styles.metric}>Energy Generated: 5,678 kWh</Text>
        <Text style={styles.metric}>Proofs Verified: 42</Text>
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
  metricContainer: {
    backgroundColor: '#1A1F2E',
    padding: 20,
    borderRadius: 12,
    width: '100%',
  },
  metric: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
  },
});
