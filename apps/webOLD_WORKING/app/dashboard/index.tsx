import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Wallet, Activity, Settings, LogOut } from 'lucide-react-native';

export default function DashboardScreen() {
  const router = useRouter();
  const [account, setAccount] = useState<string | null>(null);
  const [method, setMethod] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const email = localStorage.getItem('auth_email');
      const authMethod = localStorage.getItem('auth_method');
      setAccount(email);
      setMethod(authMethod);
    }
  }, []);

  const handleLogout = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      localStorage.removeItem('auth_session');
      localStorage.removeItem('auth_email');
      localStorage.removeItem('auth_method');
    }
    router.replace('/');
  };

  return (
    <View className="flex-1 bg-gradient-to-b from-deep-space to-space-dark">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 py-8 border-b border-neon-green/20">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-bold text-white mb-2">
                Dashboard
              </Text>
              <Text className="text-gray-400">
                Welcome back, {account || 'User'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-3 flex-row items-center"
            >
              <LogOut size={16} color="#EF4444" />
              <Text className="text-red-500 ml-2 font-medium">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Grid */}
        <View className="px-6 py-8">
          <View className="flex-row flex-wrap -mx-2">
            <View className="w-1/2 px-2 mb-4">
              <View className="bg-space-dark border-2 border-neon-green/30 rounded-2xl p-6">
                <View className="bg-neon-green/20 p-3 rounded-xl w-12 h-12 items-center justify-center mb-4">
                  <User size={24} color="#00FF9C" />
                </View>
                <Text className="text-gray-400 text-sm mb-1">Identity</Text>
                <Text className="text-white text-2xl font-bold">Active</Text>
              </View>
            </View>

            <View className="w-1/2 px-2 mb-4">
              <View className="bg-space-dark border-2 border-blue-500/30 rounded-2xl p-6">
                <View className="bg-blue-500/20 p-3 rounded-xl w-12 h-12 items-center justify-center mb-4">
                  <Wallet size={24} color="#3B82F6" />
                </View>
                <Text className="text-gray-400 text-sm mb-1">Method</Text>
                <Text className="text-white text-2xl font-bold capitalize">
                  {method || 'N/A'}
                </Text>
              </View>
            </View>

            <View className="w-1/2 px-2 mb-4">
              <View className="bg-space-dark border-2 border-purple-500/30 rounded-2xl p-6">
                <View className="bg-purple-500/20 p-3 rounded-xl w-12 h-12 items-center justify-center mb-4">
                  <Activity size={24} color="#A855F7" />
                </View>
                <Text className="text-gray-400 text-sm mb-1">Actions</Text>
                <Text className="text-white text-2xl font-bold">0</Text>
              </View>
            </View>

            <View className="w-1/2 px-2 mb-4">
              <View className="bg-space-dark border-2 border-yellow-500/30 rounded-2xl p-6">
                <View className="bg-yellow-500/20 p-3 rounded-xl w-12 h-12 items-center justify-center mb-4">
                  <Settings size={24} color="#EAB308" />
                </View>
                <Text className="text-gray-400 text-sm mb-1">Status</Text>
                <Text className="text-white text-2xl font-bold">Ready</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 pb-8">
          <Text className="text-xl font-bold text-white mb-4">Quick Actions</Text>
          
          <TouchableOpacity
            onPress={() => router.push('/identity')}
            className="bg-space-dark border-2 border-neon-green/30 rounded-2xl p-4 mb-3 flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <User size={20} color="#00FF9C" />
              <Text className="text-white ml-3 font-medium">Manage Identity</Text>
            </View>
            <Text className="text-gray-400">→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/nfts')}
            className="bg-space-dark border-2 border-neon-green/30 rounded-2xl p-4 mb-3 flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <Activity size={20} color="#00FF9C" />
              <Text className="text-white ml-3 font-medium">View NFTs</Text>
            </View>
            <Text className="text-gray-400">→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/impact')}
            className="bg-space-dark border-2 border-neon-green/30 rounded-2xl p-4 flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <Settings size={20} color="#00FF9C" />
              <Text className="text-white ml-3 font-medium">Track Impact</Text>
            </View>
            <Text className="text-gray-400">→</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
