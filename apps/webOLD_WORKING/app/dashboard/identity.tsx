import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { IdentityCard } from '../../features/identity/components/IdentityCard';

export default function DashboardIdentityScreen() {
  return (
    <View className="flex-1 bg-gradient-to-b from-deep-space to-space-dark">
      <ScrollView className="flex-1 px-6 py-8">
        <Text className="text-3xl font-bold text-white mb-6">
          Your Identity
        </Text>
        
        <IdentityCard onCreateIdentity={() => console.log('Create identity')} />
      </ScrollView>
    </View>
  );
}
