import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import { Wallet } from 'lucide-react-native';
import { useAccount } from 'wagmi';

interface Web3ModalButtonProps {
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function Web3ModalButton({ onPress, disabled = false, isLoading = false }: Web3ModalButtonProps) {
  const { isConnected } = useAccount();
  const [web3ModalAvailable, setWeb3ModalAvailable] = useState(false);

  useEffect(() => {
    // Check if Web3Modal is available (web components loaded)
    if (typeof window !== 'undefined') {
      const checkWeb3Modal = () => {
        const w3mButton = customElements.get('w3m-button');
        setWeb3ModalAvailable(!!w3mButton);
      };
      
      // Check immediately and also after a delay
      checkWeb3Modal();
      setTimeout(checkWeb3Modal, 1000);
    }
  }, []);

  if (!web3ModalAvailable) {
    return (
      <TouchableOpacity
        onPress={() => {
          // Show coming soon message
          alert('Web3Modal integration coming soon! Please use MetaMask or other injected wallets for now.');
        }}
        disabled={disabled}
        className="bg-gradient-to-r from-purple-500 to-blue-500 border-2 border-purple-300/30 rounded-2xl p-4 flex-row items-center opacity-75"
        activeOpacity={0.7}
      >
        <View className="bg-white/20 p-3 rounded-xl">
          <Wallet size={24} color="#FFFFFF" />
        </View>
        <View className="flex-1 ml-4">
          <Text className="text-lg font-semibold text-white">
            Web3Modal (Coming Soon)
          </Text>
          <Text className="text-sm text-white/80">
            Connect any wallet - MetaMask, WalletConnect, Rainbow, more
          </Text>
        </View>
        {isLoading && <ActivityIndicator color="#FFFFFF" />}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className="bg-gradient-to-r from-purple-500 to-blue-500 border-2 border-purple-300/30 rounded-2xl p-4 flex-row items-center"
      activeOpacity={0.7}
    >
      <View className="bg-white/20 p-3 rounded-xl">
        <Wallet size={24} color="#FFFFFF" />
      </View>
      <View className="flex-1 ml-4">
        <Text className="text-lg font-semibold text-white">
          Web3Modal
        </Text>
        <Text className="text-sm text-white/80">
          Connect any wallet - MetaMask, WalletConnect, Rainbow, more
        </Text>
      </View>
      {isLoading && <ActivityIndicator color="#FFFFFF" />}
    </TouchableOpacity>
  );
}
