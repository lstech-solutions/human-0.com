/**
 * Contract Registry - Support for multiple contract deployments
 * 
 * This allows the SDK to work with any PoSH-compatible contract deployment,
 * not just a single authority's contracts.
 */

import type { Address } from '../types';
import type { ContractAddresses } from './addresses';

export interface ContractDeployment {
  name: string;
  description: string;
  chainId: number;
  addresses: ContractAddresses;
  deployer?: Address;
  deployedAt?: Date;
  verified?: boolean;
}

/**
 * Registry of known PoSH contract deployments
 * Anyone can add their deployment here or use custom addresses
 */
export const KNOWN_DEPLOYMENTS: Record<string, ContractDeployment> = {
  // Official HUMAN-0 deployment on Base Sepolia (testnet)
  'human0-base-sepolia': {
    name: 'HUMAN-0 Base Sepolia',
    description: 'Official HUMAN-0 testnet deployment',
    chainId: 84532,
    addresses: {
      humanIdentity: '0x00000000000000000000000000000000000000001' as Address,
      proofRegistry: '0x00000000000000000000000000000000000000002' as Address,
      poshNFT: '0x00000000000000000000000000000000000000003' as Address,
      humanScore: '0x00000000000000000000000000000000000000004' as Address,
    },
    verified: false, // Will be true once deployed and verified
  },

  // Official HUMAN-0 deployment on Base Mainnet
  'human0-base-mainnet': {
    name: 'HUMAN-0 Base Mainnet',
    description: 'Official HUMAN-0 mainnet deployment',
    chainId: 8453,
    addresses: {
      humanIdentity: '0x00000000000000000000000000000000000000011' as Address,
      proofRegistry: '0x00000000000000000000000000000000000000012' as Address,
      poshNFT: '0x00000000000000000000000000000000000000013' as Address,
      humanScore: '0x00000000000000000000000000000000000000014' as Address,
    },
    verified: false,
  },

  // Example: Community deployment
  // 'community-optimism': {
  //   name: 'Community PoSH on Optimism',
  //   description: 'Community-run PoSH deployment',
  //   chainId: 10,
  //   addresses: { ... },
  // },
};

/**
 * Get a known deployment by name
 */
export function getDeployment(name: string): ContractDeployment | null {
  return KNOWN_DEPLOYMENTS[name] || null;
}

/**
 * Register a new deployment (for community use)
 */
export function registerDeployment(
  name: string,
  deployment: ContractDeployment
): void {
  KNOWN_DEPLOYMENTS[name] = deployment;
}

/**
 * List all known deployments
 */
export function listDeployments(): ContractDeployment[] {
  return Object.values(KNOWN_DEPLOYMENTS);
}

/**
 * Find deployments by chain ID
 */
export function getDeploymentsByChain(chainId: number): ContractDeployment[] {
  return Object.values(KNOWN_DEPLOYMENTS).filter(d => d.chainId === chainId);
}
