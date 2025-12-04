/**
 * Validation utilities for SDK inputs
 */

import type { PoshConfig, Address, HumanId } from '../types';
import { ValidationError } from './errors';

/**
 * Validates an Ethereum address format
 */
export function isValidAddress(address: string): address is Address {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validates a humanId format (bytes32)
 */
export function isValidHumanId(_humanId: string): _humanId is HumanId {
  return /^0x[a-fA-F0-9]{64}$/.test(_humanId);
}

/**
 * Validates SDK configuration
 */
export function validateConfig(config: PoshConfig): void {
  // Validate chainId
  if (typeof config.chainId !== 'number' || config.chainId <= 0 || Number.isNaN(config.chainId)) {
    throw new ValidationError(
      'Invalid chainId: must be a positive number',
      { chainId: config.chainId },
      'Provide a valid chainId (e.g., 84532 for Base Sepolia, 8453 for Base Mainnet)'
    );
  }

  // Validate contract addresses
  if (!config.contracts) {
    throw new ValidationError(
      'Missing contracts configuration',
      undefined,
      'Provide contract addresses for humanIdentity, proofRegistry, poshNFT, and humanScore'
    );
  }

  const requiredContracts = ['humanIdentity', 'proofRegistry', 'poshNFT', 'humanScore'] as const;
  for (const contractName of requiredContracts) {
    const address = config.contracts[contractName];
    if (!address) {
      throw new ValidationError(
        `Missing contract address: ${contractName}`,
        { contractName },
        `Provide a valid address for ${contractName} contract`
      );
    }
    if (!isValidAddress(address)) {
      throw new ValidationError(
        `Invalid contract address for ${contractName}: ${address}`,
        { contractName, address },
        'Provide a valid Ethereum address (0x followed by 40 hexadecimal characters)'
      );
    }
  }

  // Validate RPC URL if provided
  if (config.rpcUrl !== undefined) {
    if (typeof config.rpcUrl !== 'string' || config.rpcUrl.trim() === '') {
      throw new ValidationError(
        'Invalid rpcUrl: must be a non-empty string',
        { rpcUrl: config.rpcUrl },
        'Provide a valid RPC URL (e.g., https://sepolia.base.org)'
      );
    }
    try {
      new URL(config.rpcUrl);
    } catch {
      throw new ValidationError(
        `Invalid rpcUrl format: ${config.rpcUrl}`,
        { rpcUrl: config.rpcUrl },
        'Provide a valid URL for the RPC endpoint'
      );
    }
  }

  // Validate cache configuration if provided
  if (config.cache !== undefined) {
    if (typeof config.cache.enabled !== 'boolean') {
      throw new ValidationError(
        'Invalid cache.enabled: must be a boolean',
        { enabled: config.cache.enabled },
        'Set cache.enabled to true or false'
      );
    }
    if (typeof config.cache.ttl !== 'number' || config.cache.ttl < 0) {
      throw new ValidationError(
        'Invalid cache.ttl: must be a non-negative number',
        { ttl: config.cache.ttl },
        'Set cache.ttl to a positive number in milliseconds (e.g., 60000 for 1 minute)'
      );
    }
    if (typeof config.cache.maxSize !== 'number' || config.cache.maxSize <= 0) {
      throw new ValidationError(
        'Invalid cache.maxSize: must be a positive number',
        { maxSize: config.cache.maxSize },
        'Set cache.maxSize to a positive number (e.g., 1000)'
      );
    }
  }

  // Validate retry configuration if provided
  if (config.retry !== undefined) {
    if (typeof config.retry.enabled !== 'boolean') {
      throw new ValidationError(
        'Invalid retry.enabled: must be a boolean',
        { enabled: config.retry.enabled },
        'Set retry.enabled to true or false'
      );
    }
    if (typeof config.retry.maxAttempts !== 'number' || config.retry.maxAttempts < 1) {
      throw new ValidationError(
        'Invalid retry.maxAttempts: must be at least 1',
        { maxAttempts: config.retry.maxAttempts },
        'Set retry.maxAttempts to a positive number (e.g., 3)'
      );
    }
    if (config.retry.backoff !== 'linear' && config.retry.backoff !== 'exponential') {
      throw new ValidationError(
        'Invalid retry.backoff: must be "linear" or "exponential"',
        { backoff: config.retry.backoff },
        'Set retry.backoff to either "linear" or "exponential"'
      );
    }
    if (typeof config.retry.initialDelay !== 'number' || config.retry.initialDelay < 0) {
      throw new ValidationError(
        'Invalid retry.initialDelay: must be a non-negative number',
        { initialDelay: config.retry.initialDelay },
        'Set retry.initialDelay to a positive number in milliseconds (e.g., 1000 for 1 second)'
      );
    }
  }
}

/**
 * Creates default configuration for Base Sepolia testnet
 */
export function createDefaultConfig(overrides?: Partial<PoshConfig>): PoshConfig {
  const defaultConfig: PoshConfig = {
    chainId: 84532, // Base Sepolia
    contracts: {
      // These are placeholder addresses - should be replaced with actual deployed addresses
      humanIdentity: '0x0000000000000000000000000000000000000001' as Address,
      proofRegistry: '0x0000000000000000000000000000000000000002' as Address,
      poshNFT: '0x0000000000000000000000000000000000000003' as Address,
      humanScore: '0x0000000000000000000000000000000000000004' as Address,
    },
    cache: {
      enabled: true,
      ttl: 60000, // 1 minute
      maxSize: 1000,
    },
    retry: {
      enabled: true,
      maxAttempts: 3,
      backoff: 'exponential',
      initialDelay: 1000, // 1 second
    },
  };

  return {
    ...defaultConfig,
    ...overrides,
    contracts: {
      ...defaultConfig.contracts,
      ...overrides?.contracts,
    },
    cache: overrides?.cache ? {
      ...defaultConfig.cache,
      ...overrides.cache,
    } : defaultConfig.cache,
    retry: overrides?.retry ? {
      ...defaultConfig.retry,
      ...overrides.retry,
    } : defaultConfig.retry,
  };
}

/**
 * Create configuration from a deployment name
 * This allows using pre-registered deployments
 */
export async function createConfigFromDeployment(
  deploymentName: string,
  overrides?: Partial<PoshConfig>
): Promise<PoshConfig> {
  // Import dynamically to avoid circular dependency
  const { getDeployment } = await import('../contracts/registry');
  const deployment = getDeployment(deploymentName);
  
  if (!deployment) {
    throw new ValidationError(
      `Unknown deployment: ${deploymentName}`,
      { deploymentName },
      'Use a known deployment name or provide custom contract addresses'
    );
  }

  return createDefaultConfig({
    chainId: deployment.chainId,
    contracts: deployment.addresses,
    ...overrides,
  });
}

/**
 * Validates an address and throws if invalid
 */
export function validateAddress(address: string, paramName: string = 'address'): Address {
  if (!isValidAddress(address)) {
    throw new ValidationError(
      `Invalid ${paramName}: ${address}`,
      { [paramName]: address },
      'Provide a valid Ethereum address (0x followed by 40 hexadecimal characters)'
    );
  }
  return address;
}

/**
 * Validates a humanId and throws if invalid
 */
export function validateHumanId(_humanId: string, _paramName: string = 'humanId'): HumanId {
  if (!isValidHumanId(_humanId)) {
    throw new ValidationError(
      `Invalid ${_paramName}: ${_humanId}`,
      { [_paramName]: _humanId },
      'Provide a valid humanId (0x followed by 64 hexadecimal characters)'
    );
  }
  return _humanId;
}
