import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { User, Wallet, Settings, Download, LogOut, Shield } from "lucide-react-native";

export default function ProfileScreen() {
  return (
    <ScrollView className="flex-1 bg-deep-space">
      <View className="px-6 py-12">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-neon-green text-4xl font-bold mb-2">Profile</Text>
          <Text className="text-gray-400 text-base">
            Manage your account and settings
          </Text>
        </View>

        {/* Profile Card */}
        <View className="bg-space-dark border-2 border-neon-green rounded-3xl p-6 mb-8">
          <View className="items-center mb-6">
            <View className="bg-neon-green/20 rounded-full p-6 mb-4">
              <User size={48} color="#00FF9C" />
            </View>
            <Text className="text-white text-2xl font-bold mb-1">
              Climate Champion
            </Text>
            <Text className="text-gray-400 text-sm">Member since Jan 2025</Text>
          </View>

          {/* Stats Grid */}
          <View className="flex-row justify-around border-t border-neon-green/20 pt-6">
            <View className="items-center">
              <Text className="text-neon-green text-3xl font-bold">156</Text>
              <Text className="text-gray-400 text-xs mt-1">Actions</Text>
            </View>
            
            <View className="items-center">
              <Text className="text-neon-green text-3xl font-bold">12</Text>
              <Text className="text-gray-400 text-xs mt-1">NFTs</Text>
            </View>
            
            <View className="items-center">
              <Text className="text-neon-green text-3xl font-bold">2.4</Text>
              <Text className="text-gray-400 text-xs mt-1">Tons CO₂</Text>
            </View>
          </View>
        </View>

        {/* Wallet Section */}
        <View className="mb-8">
          <Text className="text-white text-xl font-bold mb-4">Wallet</Text>
          
          <View className="bg-space-dark border border-neon-green/20 rounded-2xl p-4 mb-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="bg-neon-green/20 rounded-full p-3 mr-3">
                  <Wallet size={20} color="#00FF9C" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-base font-semibold mb-1">
                    Connected Wallet
                  </Text>
                  <Text className="text-gray-400 text-xs">
                    0x742d...3f8a
                  </Text>
                </View>
              </View>
              <TouchableOpacity>
                <Text className="text-neon-green text-sm font-semibold">
                  Change
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="bg-space-dark border border-neon-green/20 rounded-2xl p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="bg-neon-green/20 rounded-full p-3 mr-3">
                  <Shield size={20} color="#00FF9C" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-base font-semibold mb-1">
                    Network
                  </Text>
                  <Text className="text-gray-400 text-xs">
                    Ethereum Mainnet
                  </Text>
                </View>
              </View>
              <TouchableOpacity>
                <Text className="text-neon-green text-sm font-semibold">
                  Switch
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Actions Section */}
        <View className="mb-8">
          <Text className="text-white text-xl font-bold mb-4">Actions</Text>
          
          <TouchableOpacity>
            <View className="bg-space-dark border border-neon-green/20 rounded-2xl p-4 mb-3">
              <View className="flex-row items-center">
                <Settings size={20} color="#00FF9C" />
                <Text className="text-white text-base font-semibold ml-3">
                  Settings
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View className="bg-space-dark border border-neon-green/20 rounded-2xl p-4 mb-3">
              <View className="flex-row items-center">
                <Download size={20} color="#00FF9C" />
                <Text className="text-white text-base font-semibold ml-3">
                  Export Impact Report
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View className="bg-space-dark border border-red-500/20 rounded-2xl p-4">
              <View className="flex-row items-center">
                <LogOut size={20} color="#EF4444" />
                <Text className="text-red-500 text-base font-semibold ml-3">
                  Disconnect Wallet
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Impact History */}
        <View className="mb-8">
          <Text className="text-white text-xl font-bold mb-4">
            Recent Achievements
          </Text>
          
          <View className="bg-space-dark border border-neon-green/20 rounded-2xl p-4 mb-3">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white text-base font-semibold mb-1">
                  🏆 Carbon Warrior
                </Text>
                <Text className="text-gray-400 text-xs">
                  Offset 1000kg CO₂
                </Text>
              </View>
              <Text className="text-neon-green text-sm">Jan 20, 2025</Text>
            </View>
          </View>

          <View className="bg-space-dark border border-neon-green/20 rounded-2xl p-4 mb-3">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white text-base font-semibold mb-1">
                  🌱 Tree Planter
                </Text>
                <Text className="text-gray-400 text-xs">
                  Planted 50 trees
                </Text>
              </View>
              <Text className="text-neon-green text-sm">Jan 18, 2025</Text>
            </View>
          </View>

          <View className="bg-space-dark border border-neon-green/20 rounded-2xl p-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white text-base font-semibold mb-1">
                  ⚡ Solar Pioneer
                </Text>
                <Text className="text-gray-400 text-xs">
                  Generated 500 kWh
                </Text>
              </View>
              <Text className="text-neon-green text-sm">Jan 15, 2025</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center">
          <Text className="text-gray-500 text-xs text-center mb-4">
            Version 1.0.0 • HUMΛN-Ø Platform
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
