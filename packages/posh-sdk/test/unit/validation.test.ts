import { describe, it, expect } from 'vitest';
import {
  isValidAddress,
  isValidHumanId,
  validateConfig,
  createDefaultConfig,
  validateAddress,
  validateHumanId,
} from '../../src/utils/validation';
import { ValidationError } from '../../src/utils/errors';
import type { PoshConfig } from '../../src/types';

describe('Validation Utilities', () => {
  describe('isValidAddress', () => {
    it('should validate correct addresses', () => {
      expect(isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0')).toBe(true);
      expect(isValidAddress('0x0000000000000000000000000000000000000001')).toBe(true);
      expect(isValidAddress('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF')).toBe(true);
    });

    it('should reject invalid addresses', () => {
      expect(isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')).toBe(false); // Too short
      expect(isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb00')).toBe(false); // Too long
      expect(isValidAddress('742d35Cc6634C0532925a3b844Bc9e7595f0bEb0')).toBe(false); // Missing 0x
      expect(isValidAddress('0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG')).toBe(false); // Invalid hex
      expect(isValidAddress('')).toBe(false);
    });
  });

  describe('isValidHumanId', () => {
    it('should validate correct humanIds', () => {
      expect(isValidHumanId('0x0000000000000000000000000000000000000000000000000000000000000001')).toBe(true);
      expect(isValidHumanId('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF')).toBe(true);
    });

    it('should reject invalid humanIds', () => {
      expect(isValidHumanId('0x00000000000000000000000000000000000000000000000000000000000001')).toBe(false); // Too short
      expect(isValidHumanId('0x000000000000000000000000000000000000000000000000000000000000000001')).toBe(false); // Too long
      expect(isValidHumanId('0000000000000000000000000000000000000000000000000000000000000001')).toBe(false); // Missing 0x
      expect(isValidHumanId('')).toBe(false);
    });
  });

  describe('validateConfig', () => {
    const validConfig: PoshConfig = {
      chainId: 84532,
      contracts: {
        humanIdentity: '0x0000000000000000000000000000000000000001' as `0x${string}`,
        proofRegistry: '0x0000000000000000000000000000000000000002' as `0x${string}`,
        poshNFT: '0x0000000000000000000000000000000000000003' as `0x${string}`,
        humanScore: '0x0000000000000000000000000000000000000004' as `0x${string}`,
      },
    };

    it('should validate correct configuration', () => {
      expect(() => validateConfig(validConfig)).not.toThrow();
    });

    it('should throw on invalid chainId', () => {
      expect(() => validateConfig({ ...validConfig, chainId: -1 })).toThrow(ValidationError);
      expect(() => validateConfig({ ...validConfig, chainId: 0 })).toThrow(ValidationError);
      expect(() => validateConfig({ ...validConfig, chainId: NaN })).toThrow(ValidationError);
    });

    it('should throw on missing contracts', () => {
      expect(() => validateConfig({ ...validConfig, contracts: undefined as any })).toThrow(ValidationError);
    });

    it('should throw on missing contract address', () => {
      const invalidConfig = {
        ...validConfig,
        contracts: {
          ...validConfig.contracts,
          humanIdentity: undefined as any,
        },
      };
      expect(() => validateConfig(invalidConfig)).toThrow(ValidationError);
    });

    it('should throw on invalid contract address', () => {
      const invalidConfig = {
        ...validConfig,
        contracts: {
          ...validConfig.contracts,
          humanIdentity: 'invalid' as any,
        },
      };
      expect(() => validateConfig(invalidConfig)).toThrow(ValidationError);
    });

    it('should throw on invalid RPC URL', () => {
      expect(() => validateConfig({ ...validConfig, rpcUrl: '' })).toThrow(ValidationError);
      expect(() => validateConfig({ ...validConfig, rpcUrl: 'not-a-url' })).toThrow(ValidationError);
    });

    it('should accept valid RPC URL', () => {
      expect(() => validateConfig({ ...validConfig, rpcUrl: 'https://sepolia.base.org' })).not.toThrow();
    });

    it('should validate cache configuration', () => {
      expect(() => validateConfig({
        ...validConfig,
        cache: { enabled: true, ttl: 60000, maxSize: 1000 },
      })).not.toThrow();

      expect(() => validateConfig({
        ...validConfig,
        cache: { enabled: 'yes' as any, ttl: 60000, maxSize: 1000 },
      })).toThrow(ValidationError);

      expect(() => validateConfig({
        ...validConfig,
        cache: { enabled: true, ttl: -1, maxSize: 1000 },
      })).toThrow(ValidationError);

      expect(() => validateConfig({
        ...validConfig,
        cache: { enabled: true, ttl: 60000, maxSize: 0 },
      })).toThrow(ValidationError);
    });

    it('should validate retry configuration', () => {
      expect(() => validateConfig({
        ...validConfig,
        retry: { enabled: true, maxAttempts: 3, backoff: 'exponential', initialDelay: 1000 },
      })).not.toThrow();

      expect(() => validateConfig({
        ...validConfig,
        retry: { enabled: 'yes' as any, maxAttempts: 3, backoff: 'exponential', initialDelay: 1000 },
      })).toThrow(ValidationError);

      expect(() => validateConfig({
        ...validConfig,
        retry: { enabled: true, maxAttempts: 0, backoff: 'exponential', initialDelay: 1000 },
      })).toThrow(ValidationError);

      expect(() => validateConfig({
        ...validConfig,
        retry: { enabled: true, maxAttempts: 3, backoff: 'invalid' as any, initialDelay: 1000 },
      })).toThrow(ValidationError);

      expect(() => validateConfig({
        ...validConfig,
        retry: { enabled: true, maxAttempts: 3, backoff: 'exponential', initialDelay: -1 },
      })).toThrow(ValidationError);
    });
  });

  describe('createDefaultConfig', () => {
    it('should create default configuration', () => {
      const config = createDefaultConfig();
      expect(config.chainId).toBe(84532);
      expect(config.contracts).toBeDefined();
      expect(config.cache).toBeDefined();
      expect(config.retry).toBeDefined();
    });

    it('should merge overrides', () => {
      const config = createDefaultConfig({
        chainId: 8453,
        rpcUrl: 'https://mainnet.base.org',
      });
      expect(config.chainId).toBe(8453);
      expect(config.rpcUrl).toBe('https://mainnet.base.org');
      expect(config.cache).toBeDefined(); // Should still have defaults
    });

    it('should merge contract overrides', () => {
      const config = createDefaultConfig({
        contracts: {
          humanIdentity: '0x1111111111111111111111111111111111111111' as `0x${string}`,
          proofRegistry: '0x0000000000000000000000000000000000000002' as `0x${string}`,
          poshNFT: '0x0000000000000000000000000000000000000003' as `0x${string}`,
          humanScore: '0x0000000000000000000000000000000000000004' as `0x${string}`,
        },
      });
      expect(config.contracts.humanIdentity).toBe('0x1111111111111111111111111111111111111111');
    });
  });

  describe('validateAddress', () => {
    it('should return valid address', () => {
      const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0';
      expect(validateAddress(address)).toBe(address);
    });

    it('should throw on invalid address', () => {
      expect(() => validateAddress('invalid')).toThrow(ValidationError);
      expect(() => validateAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')).toThrow(ValidationError);
    });

    it('should use custom parameter name in error', () => {
      try {
        validateAddress('invalid', 'walletAddress');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).message).toContain('walletAddress');
      }
    });
  });

  describe('validateHumanId', () => {
    it('should return valid humanId', () => {
      const humanId = '0x0000000000000000000000000000000000000000000000000000000000000001';
      expect(validateHumanId(humanId)).toBe(humanId);
    });

    it('should throw on invalid humanId', () => {
      expect(() => validateHumanId('invalid')).toThrow(ValidationError);
      expect(() => validateHumanId('0x00000000000000000000000000000000000000000000000000000000000001')).toThrow(ValidationError);
    });

    it('should use custom parameter name in error', () => {
      try {
        validateHumanId('invalid', 'userId');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).message).toContain('userId');
      }
    });
  });
});
