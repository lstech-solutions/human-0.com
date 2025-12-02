import React from "react";
import { View } from "react-native";

export type BackgroundType = 'pulsar-grid' | 'retro-grid' | 'none';

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  isDark: boolean;
  type?: BackgroundType;
  gridColor?: string;
  showScanlines?: boolean;
  glowEffect?: boolean;
}

// Native fallback - no animation (retro grid not supported on native)
export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  children, 
  isDark, 
  type = 'pulsar-grid',
  gridColor,
  showScanlines,
  glowEffect
}) => {
  // For native, just render a simple background
  return (
    <View className={isDark ? "flex-1 bg-[#050B10]" : "flex-1 bg-white"}>
      {children}
    </View>
  );
};
