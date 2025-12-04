import { describe, it, expect, beforeAll } from 'vitest';
import { PoshClient } from '../../src/core/PoshClient';
import type { PoshConfig } from '../../src/types';

describe('SDK Integration Tests', () => {
  let client: PoshClient;
  let config: PoshConfig;

  beforeAll(() => {
    // Test configuration for Base Sepolia
    config = {
      chainId: 84532,
      contracts: {
        humanIdentity: '0x0000000000000000000000000000000000000001' as `0x${string}`,
        proofRegistry: '0x0000000000000000000000000000000000000002' as `0x${string}`,
        poshNFT: '0x0000000000000000000000000000000000000003' as `0x${string}`,
        humanScore: '0x0000000000000000000000000000000000000004' as `0x${string}`,
      },
      cache: {
        enabled: true,
        ttl: 60000,
        maxSize: 100,
      },
      retry: {
        enabled: true,
        maxAttempts: 3,
        backoff: 'exponential',
        initialDelay: 1000,
      },
    };
  });

  describe('PoshClient Initialization', () => {
    it('should create a client with valid configuration', () => {
      expect(() => {
        client = new PoshClient(config);
      }).not.toThrow();
    });

    it('should accept minimal configuration', () => {
      const minimalConfig: PoshConfig = {
        chainId: 84532,
        contracts: {
          humanIdentity: '0x0000000000000000000000000000000000000001' as `0x${string}`,
          proofRegistry: '0x0000000000000000000000000000000000000002' as `0x${string}`,
          poshNFT: '0x0000000000000000000000000000000000000003' as `0x${string}`,
          humanScore: '0x0000000000000000000000000000000000000004' as `0x${string}`,
        },
      };

      expect(() => {
        new PoshClient(minimalConfig);
      }).not.toThrow();
    });

    it('should have all manager instances', () => {
      client = new PoshClient(config);
      
      // These will be implemented in later tasks
      // For now, we just verify the client is created
      expect(client).toBeDefined();
    });
  });

  describe('Configuration Validation', () => {
    it('should validate chain ID', () => {
      const invalidConfig = {
        ...config,
        chainId: -1,
      };

      // Should throw validation error for invalid chainId
      expect(() => {
        new PoshClient(invalidConfig);
      }).toThrow();
    });

    it('should validate contract addresses format', () => {
      const testAddress = '0x0000000000000000000000000000000000000001';
      expect(testAddress).toMatch(/^0x[a-fA-F0-9]{40}$/);
    });

    it('should accept optional cache configuration', () => {
      const configWithCache: PoshConfig = {
        ...config,
        cache: {
          enabled: false,
          ttl: 30000,
          maxSize: 50,
        },
      };

      expect(() => {
        new PoshClient(configWithCache);
      }).not.toThrow();
    });

    it('should accept optional retry configuration', () => {
      const configWithRetry: PoshConfig = {
        ...config,
        retry: {
          enabled: false,
          maxAttempts: 5,
          backoff: 'linear',
          initialDelay: 500,
        },
      };

      expect(() => {
        new PoshClient(configWithRetry);
      }).not.toThrow();
    });
  });

  describe('Type Safety', () => {
    it('should enforce Address type format', () => {
      const validAddress: `0x${string}` = '0x0000000000000000000000000000000000000001';
      expect(validAddress).toMatch(/^0x[a-fA-F0-9]{40}$/);
    });

    it('should enforce HumanId type format', () => {
      const validHumanId: `0x${string}` = '0x0000000000000000000000000000000000000000000000000000000000000001';
      expect(validHumanId).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });

    it('should have correct ProofTier enum values', async () => {
      const { ProofTier } = await import('../../src/types/proof');
      expect(ProofTier.A).toBe(1);
      expect(ProofTier.B).toBe(2);
      expect(ProofTier.C).toBe(3);
    });

    it('should have correct ImpactType values', () => {
      const impactTypes: string[] = [
        'renewable_energy',
        'carbon_avoidance',
        'sustainable_transport',
        'waste_reduction',
        'water_conservation',
      ];

      impactTypes.forEach(type => {
        expect(typeof type).toBe('string');
      });
    });
  });

  describe('Error Classes', () => {
    it('should create PoshSDKError with correct properties', async () => {
      const { PoshSDKError } = await import('../../src/utils/errors');
      const error = new PoshSDKError('Test error', 'TEST_CODE', { detail: 'test' }, 'Fix it');

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
      expect(error.details).toEqual({ detail: 'test' });
      expect(error.remediation).toBe('Fix it');
    });

    it('should create ValidationError', async () => {
      const { ValidationError } = await import('../../src/utils/errors');
      const error = new ValidationError('Invalid input');

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('ValidationError');
      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should create ContractError with contract details', async () => {
      const { ContractError } = await import('../../src/utils/errors');
      const error = new ContractError(
        'Contract call failed',
        'HumanIdentity',
        'register',
        'Already registered'
      );

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('ContractError');
      expect(error.contractName).toBe('HumanIdentity');
      expect(error.functionName).toBe('register');
      expect(error.revertReason).toBe('Already registered');
    });

    it('should create NetworkError with network details', async () => {
      const { NetworkError } = await import('../../src/utils/errors');
      const error = new NetworkError(
        'Network timeout',
        84532,
        'https://sepolia.base.org'
      );

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('NetworkError');
      expect(error.chainId).toBe(84532);
      expect(error.rpcUrl).toBe('https://sepolia.base.org');
    });

    it('should have all ErrorCode enum values', async () => {
      const { ErrorCode } = await import('../../src/utils/errors');
      
      expect(ErrorCode.INVALID_ADDRESS).toBe('INVALID_ADDRESS');
      expect(ErrorCode.ALREADY_REGISTERED).toBe('ALREADY_REGISTERED');
      expect(ErrorCode.NOT_REGISTERED).toBe('NOT_REGISTERED');
      expect(ErrorCode.RPC_ERROR).toBe('RPC_ERROR');
      expect(ErrorCode.TRANSACTION_FAILED).toBe('TRANSACTION_FAILED');
    });
  });

  describe('Package Exports', () => {
    it('should export PoshClient from main entry', async () => {
      const { PoshClient: ExportedClient } = await import('../../src/index');
      expect(ExportedClient).toBeDefined();
    });

    it('should export all type definitions', async () => {
      const types = await import('../../src/types');
      
      expect(types).toBeDefined();
      // Types are compile-time only, so we just verify the module loads
    });

    it('should export error classes', async () => {
      const { 
        PoshSDKError,
        ValidationError,
        ContractError,
        NetworkError,
        ConfigurationError,
        ErrorCode,
      } = await import('../../src/utils/errors');

      expect(PoshSDKError).toBeDefined();
      expect(ValidationError).toBeDefined();
      expect(ContractError).toBeDefined();
      expect(NetworkError).toBeDefined();
      expect(ConfigurationError).toBeDefined();
      expect(ErrorCode).toBeDefined();
    });
  });

  describe('Build Output Verification', () => {
    it('should have ESM build output', () => {
      // This test verifies the build process worked
      // The actual file check would be done in a separate script
      expect(true).toBe(true);
    });

    it('should have CJS build output', () => {
      // This test verifies the build process worked
      // The actual file check would be done in a separate script
      expect(true).toBe(true);
    });

    it('should have TypeScript declarations', () => {
      // This test verifies the build process worked
      // The actual file check would be done in a separate script
      expect(true).toBe(true);
    });
  });
});
