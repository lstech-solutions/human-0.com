import { View, Text } from "react-native";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <View className="bg-space-dark border border-neon-green/20 rounded-2xl p-6 mb-4">
      <View className="mb-4 items-center justify-center">{icon}</View>
      <Text className="text-neon-green text-xl font-bold mb-2">{title}</Text>
      <Text className="text-gray-300 text-sm leading-6">{description}</Text>
    </View>
  );
}
