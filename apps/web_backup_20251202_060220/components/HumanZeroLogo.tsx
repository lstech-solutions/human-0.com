import React from 'react';
import { View, Text } from 'react-native';

interface HumanZeroLogoProps {
  size?: number;
  animated?: boolean;
}

const HumanZeroLogo: React.FC<HumanZeroLogoProps> = ({ size = 120, animated = false }) => {
  const logoText = 'HUMΛN-Ø';
  
  return (
    <View className="items-center justify-center">
      <View 
        className="relative"
        style={{ width: size, height: size }}
      >
        {/* Background circle with gradient effect */}
        <View 
          className="absolute inset-0 bg-gradient-to-br from-neon-green/20 to-space-dark rounded-full border-2 border-neon-green/50"
          style={{
            shadowColor: '#00FF9C',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
          }}
        />
        
        {/* Inner circle */}
        <View 
          className="absolute inset-2 bg-gradient-to-br from-space-dark to-space-darker rounded-full border border-neon-green/30"
        />
        
        {/* Logo text */}
        <View className="absolute inset-0 items-center justify-center">
          <Text 
            className="text-neon-green font-bold text-center"
            style={{ 
              fontSize: size * 0.18,
              textShadowColor: '#00FF9C',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 10,
            }}
          >
            HUMΛN
          </Text>
          <Text 
            className="text-neon-green font-bold text-center"
            style={{ 
              fontSize: size * 0.15,
              textShadowColor: '#00FF9C',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 10,
            }}
          >
            Ø
          </Text>
        </View>
        
        {/* Animated ring effect */}
        {animated && (
          <View 
            className="absolute inset-0 rounded-full border-2 border-neon-green opacity-50"
            style={{
              animation: 'pulse 2s infinite',
            }}
          />
        )}
      </View>
    </View>
  );
};

export default HumanZeroLogo;
