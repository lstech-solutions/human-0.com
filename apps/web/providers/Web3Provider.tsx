import React, { useState, useEffect } from "react";
import { Platform } from "react-native";
import { useRouter, usePathname } from "expo-router";

export default function Web3Provider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [Web3Components, setWeb3Components] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Routes that don't need Web3 and shouldn't show loading state
  const nonWeb3Routes = ['/canvas', '/pdf-download', '/privacy', '/terms'];
  const isNonWeb3Route = nonWeb3Routes.includes(pathname);

  useEffect(() => {
    setMounted(true);
    
    // Only load web3 libraries on web platform and for non-excluded routes
    if (Platform.OS === 'web' && typeof window !== 'undefined' && !isNonWeb3Route) {
      Promise.all([
        import('wagmi').catch(() => null),
        import('@tanstack/react-query').catch(() => null),
        import('../lib/wagmi-config').catch(() => null),
        import('../components/AuthModal').catch(() => null),
      ]).then(([wagmi, reactQuery, config, authModal]) => {
        if (!wagmi || !reactQuery || !config) {
          console.warn('Some web3 modules failed to load, using fallback');
          // Use fallback config to prevent context errors
          const fallbackWagmi = wagmi || { WagmiProvider: ({ children }: any) => children };
          const fallbackQuery = reactQuery || { QueryClientProvider: ({ children }: any) => children };
          
          setWeb3Components({
            WagmiProvider: fallbackWagmi.WagmiProvider,
            QueryClientProvider: fallbackQuery.QueryClientProvider,
            queryClient: reactQuery ? new reactQuery.QueryClient({
              defaultOptions: {
                queries: {
                  refetchOnWindowFocus: false,
                  retry: false,
                  staleTime: 5 * 60 * 1000,
                },
              },
            }) : { queryCache: { clear: () => {} } },
            wagmiConfig: config?.wagmiConfig || config?.fallbackConfig || null,
            AuthModal: authModal?.AuthModal,
          });
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
        // Create minimal fallback providers to prevent context errors
        setWeb3Components({
          WagmiProvider: ({ children }: any) => children,
          QueryClientProvider: ({ children }: any) => children,
          queryClient: { queryCache: { clear: () => {} } },
          wagmiConfig: null,
          AuthModal: null,
        });
      });
    } else if (isNonWeb3Route) {
      // For non-Web3 routes, set up minimal providers immediately
      setWeb3Components({
        WagmiProvider: ({ children }: any) => children,
        QueryClientProvider: ({ children }: any) => children,
        queryClient: { queryCache: { clear: () => {} } },
        wagmiConfig: null,
        AuthModal: null,
      });
    }

    return () => setMounted(false);
  }, [isNonWeb3Route]);

  // If not mounted or not on web, just render children
  if (!mounted || Platform.OS !== 'web') {
    return <>{children}</>;
  }

  // For non-Web3 routes, render children immediately without loading state
  if (isNonWeb3Route) {
    return (
      <Web3Components.WagmiProvider config={null}>
        <Web3Components.QueryClientProvider client={Web3Components.queryClient}>
          {children}
        </Web3Components.QueryClientProvider>
      </Web3Components.WagmiProvider>
    );
  }

  // Always wait for Web3Components to be set on web to prevent context errors
  if (!Web3Components) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF9C] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Web3...</p>
      </div>
    </div>;
  }

  // If no config available, use fallback provider
  if (!Web3Components.wagmiConfig) {
    return (
      <Web3Components.WagmiProvider config={null}>
        <Web3Components.QueryClientProvider client={Web3Components.queryClient}>
          {children}
        </Web3Components.QueryClientProvider>
      </Web3Components.WagmiProvider>
    );
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
