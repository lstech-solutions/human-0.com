import { TouchableOpacity, View, Text } from "react-native";
import { ReactNode } from "react";

interface QuickAccessCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  onPress?: () => void;
}

export default function QuickAccessCard({
  icon,
  title,
  description,
  onPress,
}: QuickAccessCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View className="bg-space-dark border border-neon-green/30 rounded-2xl p-5 mb-4">
        <View className="flex-row items-center">
          <View className="bg-neon-green/20 rounded-full p-3 mr-4">
            {icon}
          </View>
          <View className="flex-1">
            <Text className="text-white text-lg font-bold mb-1">{title}</Text>
            <Text className="text-gray-400 text-sm">{description}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
