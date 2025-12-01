import { createConfig, http } from 'wagmi';
import { mainnet, baseSepolia, base, polygon } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

// Get WalletConnect project ID from environment
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

if (!projectId && process.env.NODE_ENV === 'production') {
  console.warn('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. Get one at https://cloud.walletconnect.com');
}

export const wagmiConfig = createConfig({
  chains: [mainnet, base, baseSepolia, polygon],
  connectors: [
    // Browser extension wallets (MetaMask, Brave, etc.)
    injected({
      shimDisconnect: true,
    }),
    
    // WalletConnect for mobile wallets
    walletConnect({ 
      projectId: projectId || 'demo-project-id',
      showQrModal: true,
      metadata: {
        name: 'Human Zero',
        description: 'Proof of Sustainable Humanity',
        url: process.env.NEXT_PUBLIC_APP_URL || 'https://human-0.org',
        icons: ['https://human-0.org/logo.svg'],
      },
    }),
    
    // Coinbase Wallet
    coinbaseWallet({
      appName: 'Human Zero',
      appLogoUrl: 'https://human-0.org/logo.svg',
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [polygon.id]: http(),
  },
  ssr: false,
});
