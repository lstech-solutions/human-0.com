import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, Platform } from 'react-native';
import { Fingerprint, LogOut, User } from 'lucide-react-native';

interface SecureConnectButtonProps {
  variant?: 'hero' | 'secondary' | 'compact';
  onAuthSuccess?: () => void;
}

export function SecureConnectButton({ 
  variant = 'hero',
  onAuthSuccess,
}: SecureConnectButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only render on client to avoid SSR issues
  if (!isClient || Platform.OS !== 'web') {
    return (
      <View className={getButtonClass(variant, false)}>
        <Fingerprint 
          size={variant === 'hero' ? 24 : variant === 'compact' ? 16 : 20} 
          color={variant === 'hero' ? '#050B10' : '#00FF9C'} 
        />
        <Text className={getTextClass(variant)} style={{ marginLeft: 8 }}>
          {variant === 'compact' ? 'Connect' : 'Connect Account'}
        </Text>
      </View>
    );
  }

  return <SecureConnectButtonClient variant={variant} onAuthSuccess={onAuthSuccess} />;
}

// Client-side only component
function SecureConnectButtonClient({ 
  variant = 'hero',
  onAuthSuccess,
}: SecureConnectButtonProps) {
  const [showModal, setShowModal] = useState(false);
  
  // Dynamic imports to avoid SSR issues
  const AuthModal = require('./AuthModal').AuthModal;
  const { useAuth } = require('../hooks/useAuth');
  
  const { isAuthenticated, account, method, isLoading, login, logout } = useAuth();

  const handleAuthSuccess = (account: string, method: any) => {
    login(account, method);
    onAuthSuccess?.();
  };

  const formatAccount = (acc: string) => {
    if (acc.startsWith('0x')) {
      return `${acc.slice(0, 6)}...${acc.slice(-4)}`;
    }
    if (acc.includes('@')) {
      return acc.split('@')[0];
    }
    return acc;
  };

  if (isLoading) {
    return (
      <View className={getButtonClass(variant, false)}>
        <ActivityIndicator color={variant === 'hero' ? '#050B10' : '#00FF9C'} />
      </View>
    );
  }

  if (isAuthenticated && account) {
    return (
      <View className="flex-row items-center space-x-2">
        <View className={getButtonClass(variant, true)}>
          <User 
            size={variant === 'hero' ? 20 : 16} 
            color={variant === 'hero' ? '#050B10' : '#00FF9C'} 
          />
          <Text className={getTextClass(variant)} style={{ marginLeft: 8 }}>
            {formatAccount(account)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={logout}
          className="bg-red-500/20 border border-red-500/30 rounded-xl px-3 py-2"
          activeOpacity={0.8}
        >
          <LogOut size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity 
        className={getButtonClass(variant, false)}
        onPress={() => setShowModal(true)}
        activeOpacity={0.8}
      >
        <Fingerprint 
          size={variant === 'hero' ? 24 : variant === 'compact' ? 16 : 20} 
          color={variant === 'hero' ? '#050B10' : '#00FF9C'} 
        />
        <Text className={getTextClass(variant)} style={{ marginLeft: 8 }}>
          {variant === 'compact' ? 'Connect' : 'Connect Account'}
        </Text>
      </TouchableOpacity>

      <AuthModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}

function getButtonClass(variant: string, isConnected: boolean): string {
  if (isConnected) {
    return variant === 'hero'
      ? 'bg-neon-green/20 border-2 border-neon-green rounded-2xl px-6 py-4 flex-row items-center justify-center'
      : 'bg-deep-space border border-neon-green/50 rounded-xl px-4 py-3 flex-row items-center justify-center';
  }

  switch (variant) {
    case 'hero':
      return 'bg-neon-green rounded-2xl px-6 py-4 flex-row items-center justify-center shadow-lg shadow-neon-green/20';
    case 'compact':
      return 'bg-deep-space border border-neon-green/30 rounded-lg px-3 py-2 flex-row items-center justify-center';
    default:
      return 'bg-deep-space border border-neon-green/30 rounded-xl px-4 py-3 flex-row items-center justify-center';
  }
}

function getTextClass(variant: string): string {
  switch (variant) {
    case 'hero':
      return 'text-space-dark font-semibold text-lg';
    case 'compact':
      return 'text-neon-green font-medium text-xs';
    default:
      return 'text-neon-green font-medium text-sm';
  }
}
