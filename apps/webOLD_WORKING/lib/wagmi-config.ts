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
    HumanIdentity: '0x00000000000000000000000000000000000000011', // TODO: Deploy mainnet contracts
    HumanScore: '0x00000000000000000000000000000000000000014',
    ProofRegistry: '0x00000000000000000000000000000000000000012',
    PoSHNFT: '0x00000000000000000000000000000000000000013',
  },
  [base.id]: {
    HumanIdentity: '0x00000000000000000000000000000000000000021', // TODO: Deploy base mainnet contracts  
    HumanScore: '0x00000000000000000000000000000000000000024',
    ProofRegistry: '0x00000000000000000000000000000000000000022',
    PoSHNFT: '0x00000000000000000000000000000000000000023',
  },
  [baseSepolia.id]: {
    HumanIdentity: '0x00000000000000000000000000000000000000001', // TODO: Deploy actual contracts
    HumanScore: '0x00000000000000000000000000000000000000004',
    ProofRegistry: '0x00000000000000000000000000000000000000002',
    PoSHNFT: '0x00000000000000000000000000000000000000003',
  },
  [polygon.id]: {
    HumanIdentity: '0x00000000000000000000000000000000000000031', // TODO: Deploy polygon contracts
    HumanScore: '0x00000000000000000000000000000000000000034',
    ProofRegistry: '0x00000000000000000000000000000000000000032',
    PoSHNFT: '0x00000000000000000000000000000000000000033',
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
