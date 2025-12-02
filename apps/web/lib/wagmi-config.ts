import { createConfig, http } from 'wagmi';
import { mainnet, baseSepolia, base, polygon } from 'wagmi/chains';
import { injected } from '@wagmi/core';

// Get WalletConnect project ID from environment
const projectId = process.env.WALLETCONNECT_PROJECT_ID || '';

if (!projectId && process.env.NODE_ENV === 'production') {
  console.warn('WALLETCONNECT_PROJECT_ID is not set. Get one at https://cloud.walletconnect.com');
}

// Create fallback config for SSR or when modules fail to load
export const fallbackConfig = createConfig({
  chains: [baseSepolia],
  connectors: [],
  transports: {
    [baseSepolia.id]: http(),
  },
  ssr: true,
});

export const wagmiConfig = createConfig({
  chains: [mainnet, base, baseSepolia, polygon],
  connectors: [
    // Browser extension wallets (MetaMask, Brave, etc.)
    injected({
      shimDisconnect: true,
    }) as any,
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [polygon.id]: http(),
  },
  ssr: true,
});

// Export chain configuration
export const DEFAULT_CHAIN = baseSepolia;

// Contract addresses for different chains
export const CONTRACT_ADDRESSES = {
  [mainnet.id]: {
    HumanIdentity: '0x...', // TODO: Add mainnet contract addresses
    HumanScore: '0x...',
    ProofRegistry: '0x...',
    PoSHNFT: '0x...',
  },
  [base.id]: {
    HumanIdentity: '0x...', // TODO: Add base mainnet contract addresses  
    HumanScore: '0x...',
    ProofRegistry: '0x...',
    PoSHNFT: '0x...',
  },
  [baseSepolia.id]: {
    HumanIdentity: '0x...', // TODO: Add base sepolia contract addresses
    HumanScore: '0x...',
    ProofRegistry: '0x...',
    PoSHNFT: '0x...',
  },
  [polygon.id]: {
    HumanIdentity: '0x...', // TODO: Add polygon contract addresses
    HumanScore: '0x...',
    ProofRegistry: '0x...',
    PoSHNFT: '0x...',
  },
} as const;

export function getContractAddress(
  chainId: number,
  contract: keyof typeof CONTRACT_ADDRESSES[typeof baseSepolia.id]
): `0x${string}` | null {
  const chainAddresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
  if (!chainAddresses) return null;
  return chainAddresses[contract] as `0x${string}` | null;
}
