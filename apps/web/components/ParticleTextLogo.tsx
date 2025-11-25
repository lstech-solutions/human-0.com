import React from 'react';
import { View, Text } from 'react-native';

const ParticleTextLogo: React.FC = () => {
  return (
    <View className="flex-1 bg-deep-space justify-center items-center">
      <Text className="text-neon-green text-4xl font-bold mb-2">
        HUMΛN-Ø
      </Text>
      <Text className="text-gray-400 text-sm text-center max-w-xs">
        Canvas del Modelo de Negocio
      </Text>
      <Text className="text-gray-500 text-xs text-center max-w-xs mt-1">
        Plataforma Web3 para impacto climático Net Zero
      </Text>
    </View>
  );
};

export default ParticleTextLogo;
