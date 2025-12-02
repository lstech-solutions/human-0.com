/**
 * Contract addresses for different networks
 * 
 * Note: These are placeholder addresses until contracts are deployed
 */

import type { Address } from '../types';

export interface ContractAddresses {
  humanIdentity: Address;
  proofRegistry: Address;
  poshNFT: Address;
  humanScore: Address;
}

/**
 * Base Sepolia testnet addresses (placeholder)
 */
export const BASE_SEPOLIA_ADDRESSES: ContractAddresses = {
  humanIdentity: '0x00000000000000000000000000000000000000001' as Address,
  proofRegistry: '0x00000000000000000000000000000000000000002' as Address,
  poshNFT: '0x00000000000000000000000000000000000000003' as Address,
  humanScore: '0x00000000000000000000000000000000000000004' as Address,
};

/**
 * Base mainnet addresses (placeholder)
 */
export const BASE_MAINNET_ADDRESSES: ContractAddresses = {
  humanIdentity: '0x00000000000000000000000000000000000000011' as Address,
  proofRegistry: '0x00000000000000000000000000000000000000012' as Address,
  poshNFT: '0x00000000000000000000000000000000000000013' as Address,
  humanScore: '0x00000000000000000000000000000000000000014' as Address,
};

/**
 * Get contract addresses for a given chain ID
 */
export function getContractAddresses(chainId: number): ContractAddresses | null {
  switch (chainId) {
    case 84532: // Base Sepolia
      return BASE_SEPOLIA_ADDRESSES;
    case 8453: // Base Mainnet
      return BASE_MAINNET_ADDRESSES;
    default:
      return null;
  }
}
