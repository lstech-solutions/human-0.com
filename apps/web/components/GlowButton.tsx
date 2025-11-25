import { TouchableOpacity, Text, View } from "react-native";
import { ReactNode } from "react";

interface GlowButtonProps {
  onPress?: () => void;
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

export default function GlowButton({
  onPress,
  children,
  variant = "primary",
  size = "md",
}: GlowButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2",
    md: "px-6 py-3",
    lg: "px-8 py-4",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View
        className={`${sizeClasses[size]} rounded-full ${
          variant === "primary"
            ? "bg-neon-green"
            : "bg-transparent border-2 border-neon-green"
        }`}
        style={
          variant === "primary"
            ? {
                shadowColor: "#00FF9C",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 20,
                elevation: 10,
              }
            : undefined
        }
      >
        <Text
          className={`${textSizeClasses[size]} font-bold text-center ${
            variant === "primary" ? "text-deep-space" : "text-neon-green"
          }`}
        >
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
