import React from 'react';
import { View, Text, Modal } from 'react-native';

// Fallback for non-web platforms
export function AuthModal({ visible, onClose }: any) {
  return (
    <Modal visible={visible} transparent onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className="bg-white dark:bg-gray-800 rounded-3xl p-6">
          <Text className="text-center text-gray-700 dark:text-gray-300">
            Authentication is only available on web
          </Text>
        </View>
      </View>
    </Modal>
  );
}
