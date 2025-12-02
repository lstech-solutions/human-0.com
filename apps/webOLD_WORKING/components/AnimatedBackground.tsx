import React from "react";
import { View } from "react-native";

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  isDark: boolean;
}

// Native fallback - no animation
export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ children, isDark }) => {
  return (
    <View className={isDark ? "flex-1 bg-[#050B10]" : "flex-1 bg-white"}>
      {children}
    </View>
  );
};
