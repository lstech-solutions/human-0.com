import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

interface BackButtonProps {
  onPress?: () => void;
  tintColor?: string;
}

export function BackButton({ onPress, tintColor }: BackButtonProps) {
  const { colorScheme } = useTheme();
  const iconColor = tintColor || (colorScheme === 'dark' ? '#00FF9C' : '#0A1628');

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <ArrowLeft size={24} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    marginRight: 8,
  },
});
