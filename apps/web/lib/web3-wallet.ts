// Web3 wallet utilities using native browser APIs
// No external dependencies - works with any bundler

// EIP-1193 Provider interface
interface EthereumProvider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on(event: string, callback: (...args: unknown[]) => void): void;
  removeListener(event: string, callback: (...args: unknown[]) => void): void;
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  isStatus?: boolean;
  isBraveWallet?: boolean;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider & {
      isMetaMask?: boolean;
      isCoinbaseWallet?: boolean;
      isStatus?: boolean;
      isBraveWallet?: boolean;
      autoRefreshOnNetworkChange?: boolean;
      chainId?: string;
      networkVersion?: string;
      selectedAddress?: string;
    };
    UnicornStudio?: {
      isInitialized?: boolean;
      init: () => Promise<any>;
      destroy: () => void;
    };
  }
}

/**
 * Safely access the Ethereum provider
 * @returns The Ethereum provider or null if not available
 */
function getEthereumProvider(): EthereumProvider | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  if (!window.ethereum) {
    return null;
  }
  
  // Disable auto refresh on network change to prevent infinite loops
  if (window.ethereum.autoRefreshOnNetworkChange) {
    window.ethereum.autoRefreshOnNetworkChange = false;
  }
  
  return window.ethereum;
}

/**
 * Connect to user's Web3 wallet
 * @returns Connected account address or null
 */
export async function connectWallet(): Promise<string | null> {
  const provider = getEthereumProvider();
  
  if (!provider) {
    console.warn('No Web3 wallet detected. Please install MetaMask or another Web3 wallet.');
    return null;
  }

  try {
    const result = await provider.request({
      method: 'eth_requestAccounts',
    });
    
    if (Array.isArray(result) && result.length > 0) {
      return result[0] as string;
    }
    
    return null;
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
      const ethError = error as { code: number; message?: string };
      
      if (ethError.code === 4001) {
        console.info('User rejected wallet connection');
        return null;
      }
    }
    
    console.error('Failed to connect wallet:', error);
    return null;
  }
}

/**
 * Get currently connected account without prompting
 * @returns Connected account address or null
 */
export async function getConnectedAccount(): Promise<string | null> {
  const provider = getEthereumProvider();
  
  if (!provider) {
    return null;
  }

  try {
    const result = await provider.request({
      method: 'eth_accounts',
    });
    
    if (Array.isArray(result) && result.length > 0) {
      return result[0] as string;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get account:', error);
    return null;
  }
}

/**
 * Subscribe to account changes
 * @param callback Function to call when accounts change
 * @returns Cleanup function to remove the listener
 */
export function onAccountsChanged(callback: (accounts: string[]) => void): () => void {
  const provider = getEthereumProvider();
  
  if (!provider) {
    return () => {};
  }

  const wrappedCallback = (accounts: unknown) => {
    if (Array.isArray(accounts)) {
      callback(accounts as string[]);
    }
  };

  provider.on('accountsChanged', wrappedCallback);
  
  return () => {
    provider.removeListener('accountsChanged', wrappedCallback);
  };
}

/**
 * Subscribe to chain changes
 * @param callback Function to call when chain changes
 * @returns Cleanup function to remove the listener
 */
export function onChainChanged(callback: (chainId: string) => void): () => void {
  const provider = getEthereumProvider();
  
  if (!provider) {
    return () => {};
  }

  const handleChainChanged = (...args: unknown[]) => {
    const chainId = args[0];
    if (typeof chainId === 'string') {
      callback(chainId);
    }
  };

  provider.on('chainChanged', handleChainChanged);
  
  return () => {
    provider.removeListener('chainChanged', handleChainChanged);
  };
}

/**
 * Get current chain ID
 * @returns Chain ID as number or null
 */
export async function getChainId(): Promise<number | null> {
  const provider = getEthereumProvider();
  
  if (!provider) {
    return null;
  }

  try {
    const chainId = await provider.request({ method: 'eth_chainId' }) as string;
    return chainId ? parseInt(chainId, 16) : null;
  } catch (error) {
    console.error('Failed to get chain ID:', error);
    return null;
  }
}

export function formatAddress(address: string, start = 6, end = 4): string {
  if (!address || typeof address !== 'string' || address.length < start + end) {
    return address || '';
  }
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}
