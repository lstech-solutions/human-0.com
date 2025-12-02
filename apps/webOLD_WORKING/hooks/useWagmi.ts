import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

// Fallback hooks for when wagmi is not available
const fallbackHooks = {
  useConnect: () => ({ 
    connectAsync: async () => { throw new Error('Wagmi not loaded'); }, 
    connectors: [], 
    isPending: false 
  }),
  useAccount: () => ({ 
    address: undefined, 
    isConnected: false 
  }),
  useDisconnect: () => ({ 
    disconnect: () => {} 
  }),
};

export function useWagmiHooks() {
  const [hooks, setHooks] = useState<any>(fallbackHooks);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      import('wagmi')
        .then((wagmi) => {
          setHooks({
            useConnect: wagmi.useConnect,
            useAccount: wagmi.useAccount,
            useDisconnect: wagmi.useDisconnect,
          });
          setIsLoaded(true);
        })
        .catch((err) => {
          console.warn('Failed to load wagmi:', err);
          setIsLoaded(true);
        });
    } else {
      setIsLoaded(true);
    }
  }, []);

  return { ...hooks, isLoaded };
}
