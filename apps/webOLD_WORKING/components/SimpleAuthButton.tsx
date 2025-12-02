import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View, Platform } from 'react-native';
import { Fingerprint } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface SimpleAuthButtonProps {
  variant?: 'hero' | 'secondary' | 'compact';
}

export function SimpleAuthButton({ variant = 'hero' }: SimpleAuthButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [AuthModal, setAuthModal] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      import('./AuthModal').then(m => {
        setAuthModal(() => m.AuthModal);
      });
    }
  }, []);

  const handleSuccess = (account: string, method: string) => {
    // Redirect to dashboard
    router.push('/dashboard');
  };

  const buttonClass = variant === 'hero'
    ? 'bg-neon-green rounded-2xl px-6 py-4 flex-row items-center justify-center shadow-lg shadow-neon-green/20'
    : variant === 'compact'
    ? 'bg-deep-space border border-neon-green/30 rounded-lg px-3 py-2 flex-row items-center justify-center'
    : 'bg-deep-space border border-neon-green/30 rounded-xl px-4 py-3 flex-row items-center justify-center';

  const textClass = variant === 'hero'
    ? 'text-space-dark font-semibold text-lg'
    : variant === 'compact'
    ? 'text-neon-green font-medium text-xs'
    : 'text-neon-green font-medium text-sm';

  return (
    <>
      <TouchableOpacity 
        className={buttonClass}
        onPress={() => setShowModal(true)}
        activeOpacity={0.8}
      >
        <Fingerprint 
          size={variant === 'hero' ? 24 : variant === 'compact' ? 16 : 20} 
          color={variant === 'hero' ? '#050B10' : '#00FF9C'} 
        />
        <Text className={textClass} style={{ marginLeft: 8 }}>
          {variant === 'compact' ? 'Sign In' : 'Get Started'}
        </Text>
      </TouchableOpacity>

      {AuthModal && (
        <AuthModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
