import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Fingerprint } from "lucide-react-native";

interface ConnectButtonProps {
  variant?: "hero" | "secondary";
  onPress?: () => void;
}

export function ConnectButton({ variant = "hero", onPress }: ConnectButtonProps) {
  const buttonClass = variant === "hero"
    ? "bg-neon-green rounded-2xl px-6 py-4 flex-row items-center justify-center"
    : "bg-deep-space border border-neon-green/30 rounded-xl px-4 py-3 flex-row items-center justify-center";
  
  const textClass = variant === "hero"
    ? "text-space-dark font-semibold text-lg"
    : "text-neon-green font-medium text-sm";

  return (
    <TouchableOpacity 
      className={buttonClass}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Fingerprint size={variant === "hero" ? 24 : 16} color={variant === "hero" ? "#050B10" : "#00FF9C"} />
      <Text className={textClass} style={{ marginLeft: 8 }}>
        Connect Wallet
      </Text>
    </TouchableOpacity>
  );
}
