import { mainnet, base, baseSepolia, polygon } from 'viem/chains';
import Constants from 'expo-constants';

const projectId = Constants.expoConfig?.extra?.EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID || '3a3268fbb7f767b88c3f7a7e9b7c3e7a'; // Fallback demo project ID

const metadata = {
  name: 'HUMAN-0 PoSH',
  description: 'Proof of Sustainable Humanity - Cross-platform identity dApp',
  url: 'https://human-0.com',
  icons: ['https://human-0.com/icon.png'],
  redirect: {
    native: 'human0://',
    universal: 'https://human-0.com',
  },
};

const chains = [mainnet, base, baseSepolia, polygon];

export { projectId, metadata, chains };
