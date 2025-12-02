import React, { useState, useEffect } from "react";
import { Platform } from "react-native";

export default function Web3Provider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [Web3Components, setWeb3Components] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    
    // Only load web3 libraries on web platform
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      Promise.all([
        import('wagmi').catch(() => null),
        import('@tanstack/react-query').catch(() => null),
        import('../lib/wagmi-config').catch(() => null),
        import('../components/AuthModal').catch(() => null),
      ]).then(([wagmi, reactQuery, config, authModal]) => {
        if (!wagmi || !reactQuery || !config) {
          console.warn('Some web3 modules failed to load');
          return;
        }
        const queryClient = new reactQuery.QueryClient({
          defaultOptions: {
            queries: {
              refetchOnWindowFocus: false,
              retry: false,
              staleTime: 5 * 60 * 1000,
            },
          },
        });

        setWeb3Components({
          WagmiProvider: wagmi.WagmiProvider,
          QueryClientProvider: reactQuery.QueryClientProvider,
          queryClient,
          wagmiConfig: config.wagmiConfig,
          AuthModal: authModal?.AuthModal,
        });
      }).catch(err => {
        console.warn('Failed to load web3 providers:', err);
      });
    }

    return () => setMounted(false);
  }, []);

  // If not mounted or not on web, just render children
  if (!mounted || Platform.OS !== 'web') {
    return <>{children}</>;
  }

  // If web3 providers not loaded yet, render children without web3
  if (!Web3Components) {
    return <>{children}</>;
  }

  // Render with web3 providers
  const { WagmiProvider, QueryClientProvider, queryClient, wagmiConfig } = Web3Components;
  
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
