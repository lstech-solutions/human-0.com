import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { TrendingUp, Calendar, Leaf, Plus } from "lucide-react-native";
import GlowButton from "@/components/GlowButton";

interface ImpactEntry {
  id: string;
  date: string;
  type: string;
  amount: number;
  unit: string;
}

export default function ImpactScreen() {
  const impactData: ImpactEntry[] = [
    { id: "1", date: "2025-01-20", type: "Solar Energy", amount: 150, unit: "kWh" },
    { id: "2", date: "2025-01-18", type: "Tree Planting", amount: 25, unit: "trees" },
    { id: "3", date: "2025-01-15", type: "Carbon Offset", amount: 500, unit: "kg CO₂" },
    { id: "4", date: "2025-01-12", type: "Recycling", amount: 75, unit: "kg" },
  ];

  return (
    <ScrollView className="flex-1 bg-deep-space">
      <View className="px-6 py-12">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-neon-green text-4xl font-bold mb-2">
            Impact Tracking
          </Text>
          <Text className="text-gray-400 text-base">
            Monitor your environmental contributions
          </Text>
        </View>

        {/* Total Impact Card */}
        <View className="bg-space-dark border-2 border-neon-green rounded-3xl p-6 mb-8">
          <View className="flex-row items-center mb-4">
            <Leaf size={28} color="#00FF9C" />
            <Text className="text-white text-xl font-bold ml-3">
              Total Impact This Month
            </Text>
          </View>
          
          <View className="flex-row justify-between items-end">
            <View>
              <Text className="text-neon-green text-5xl font-bold">2.4</Text>
              <Text className="text-gray-400 text-sm mt-1">Tons CO₂ Offset</Text>
            </View>
            
            <View className="items-end">
              <View className="flex-row items-center">
                <TrendingUp size={20} color="#00FF9C" />
                <Text className="text-neon-green text-lg font-bold ml-1">+18%</Text>
              </View>
              <Text className="text-gray-400 text-xs mt-1">vs last month</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="flex-row justify-between mb-8">
          <View className="bg-space-dark border border-neon-green/20 rounded-2xl p-4 flex-1 mr-2">
            <Text className="text-neon-green text-2xl font-bold">156</Text>
            <Text className="text-gray-400 text-xs mt-1">Total Actions</Text>
          </View>
          
          <View className="bg-space-dark border border-neon-green/20 rounded-2xl p-4 flex-1 mx-2">
            <Text className="text-neon-green text-2xl font-bold">42</Text>
            <Text className="text-gray-400 text-xs mt-1">Days Active</Text>
          </View>
          
          <View className="bg-space-dark border border-neon-green/20 rounded-2xl p-4 flex-1 ml-2">
            <Text className="text-neon-green text-2xl font-bold">12</Text>
            <Text className="text-gray-400 text-xs mt-1">NFTs Earned</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-2xl font-bold">Recent Activity</Text>
            <TouchableOpacity>
              <View className="bg-neon-green rounded-full p-2">
                <Plus size={20} color="#050B10" />
              </View>
            </TouchableOpacity>
          </View>

          {impactData.map((entry) => (
            <View
              key={entry.id}
              className="bg-space-dark border border-neon-green/20 rounded-xl p-4 mb-3"
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-white text-lg font-semibold mb-1">
                    {entry.type}
                  </Text>
                  <View className="flex-row items-center">
                    <Calendar size={14} color="#9CA3AF" />
                    <Text className="text-gray-400 text-sm ml-2">
                      {entry.date}
                    </Text>
                  </View>
                </View>
                
                <View className="items-end">
                  <Text className="text-neon-green text-xl font-bold">
                    {entry.amount}
                  </Text>
                  <Text className="text-gray-400 text-xs">{entry.unit}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Action Button */}
        <View className="items-center">
          <GlowButton variant="primary" size="lg">
            Log New Impact
          </GlowButton>
        </View>
      </View>
    </ScrollView>
  );
}
