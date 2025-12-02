import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import Web3Provider from '../../providers/Web3Provider';

interface ConnectedNavigationProps {
  children?: React.ReactNode;
}

export default function ConnectedNavigation({ children }: ConnectedNavigationProps) {
  const router = useRouter();

  useEffect(() => {
    // Navigate to home page once connected
    router.replace('/');
  }, [router]);

  return (
    <Web3Provider>
      {children}
    </Web3Provider>
  );
}
