import React from 'react';
import { View, Text, Platform } from 'react-native';

export default function AuthenticatedIdentityScreen() {
  // Simple fallback without theme provider to avoid dependency issues
  const isDark = false; // Default to light theme for now

  if (Platform.OS !== 'web') {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-[#0A1628] text-xl font-bold mb-4">
          Identity Available on Web
        </Text>
        <Text className="text-gray-600 text-center">
          Please use the web version to manage your identity.
        </Text>
      </View>
    );
  }

  return (
    <View className="w-full px-6 py-12 max-w-2xl mx-auto">
      {/* Header */}
      <View className="mb-8">
        <Text className="text-[#0A1628] text-4xl font-bold mb-2">
          Identity Management
        </Text>
        <Text className="text-gray-600 text-base">
          Your PoSH Identity is registered and ready to use.
        </Text>
      </View>

      {/* Status Card */}
      <View className="mb-8 bg-white border-2 border-gray-300 rounded-3xl p-6">
        <View className="items-center">
          <Text className="text-green-500 text-2xl mb-4">✅</Text>
          <Text className="text-[#0A1628] text-xl font-bold mt-4 text-center">
            Identity Connected
          </Text>
          <Text className="text-gray-600 text-center mt-2 mb-6">
            Your humanId is registered and ready to use across the PoSH ecosystem.
          </Text>
          
          <View className="w-full max-w-sm space-y-3">
            <View className="bg-gray-100 px-4 py-3 rounded-lg">
              <Text className="text-gray-700 text-sm text-center">
                Next: Link MRV sources to build your PoSH score
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View className="mb-8">
        <Text className="text-[#0A1628] text-xl font-bold mb-4">
          Available Features
        </Text>
        
        <View className="space-y-4">
          <View className="bg-white border border-gray-300 rounded-2xl p-4">
            <Text className="text-[#0A1628] font-semibold mb-2">
              📊 View Your PoSH Score
            </Text>
            <Text className="text-gray-600 text-sm">
              Track your sustainability impact and reputation score.
            </Text>
          </View>
          
          <View className="bg-white border border-gray-300 rounded-2xl p-4">
            <Text className="text-[#0A1628] font-semibold mb-2">
              🔗 Link MRV Sources
            </Text>
            <Text className="text-gray-600 text-sm">
              Connect smart meters, EVs, and renewable energy providers.
            </Text>
          </View>
          
          <View className="bg-white border border-gray-300 rounded-2xl p-4">
            <Text className="text-[#0A1628] font-semibold mb-2">
              🏆 Mint Soulbound NFTs
            </Text>
            <Text className="text-gray-600 text-sm">
              Earn and display your sustainability achievements.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
