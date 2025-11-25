import { View } from "react-native";
import { Leaf } from "lucide-react-native";

interface LogoProps {
  size?: number;
}

export default function Logo({ size = 120 }: LogoProps) {
  return (
    <View className="items-center justify-center">
      <View className="bg-neon-green/10 rounded-full items-center justify-center border-2 border-neon-green" style={{ width: size, height: size }}>
        <Leaf size={size * 0.5} color="#00FF9C" />
      </View>
    </View>
  );
}
