import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AuthenticatedDashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Analytics & Insights</Text>
      <View style={styles.statsContainer}>
        <Text style={styles.stat}>Total Impact: High</Text>
        <Text style={styles.stat}>Ranking: Top 10%</Text>
        <Text style={styles.stat}>Next Milestone: Platinum</Text>
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
  statsContainer: {
    backgroundColor: '#1A1F2E',
    padding: 20,
    borderRadius: 12,
    width: '100%',
  },
  stat: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
  },
});
