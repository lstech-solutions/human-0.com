/**
 * Property-based tests for Supabase client initialization
 * Feature: supabase-auth-integration
 */

import * as fc from 'fast-check';
import { getRedirectUrl, validateConfig, getSupabaseConfig } from '../supabase-client';

/**
 * **Feature: supabase-auth-integration, Property 7: Environment-specific redirect URLs**
 * **Validates: Requirements 3.5, 8.1**
 * 
 * For any environment mode (development, staging, production), 
 * the system should use the correct redirect URL for that environment
 */
describe('Property 7: Environment-specific redirect URLs', () => {
  const originalEnv = process.env;
  const originalDev = (global as any).__DEV__;

  beforeEach(() => {
    // Reset environment before each test
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
    (global as any).__DEV__ = originalDev;
  });

  it('should use localhost URL in development mode', () => {
    fc.assert(
      fc.property(
        fc.boolean(), // __DEV__ flag
        fc.constantFrom('development', 'test'), // NODE_ENV values for dev
        (devFlag, nodeEnv) => {
          // Set development environment
          (global as any).__DEV__ = devFlag;
          Object.defineProperty(process.env, 'NODE_ENV', {
            value: nodeEnv,
            writable: true,
            configurable: true
          });

          const redirectUrl = getRedirectUrl();

          // In development, should always use localhost
          if (devFlag || nodeEnv === 'development') {
            expect(redirectUrl).toContain('localhost');
            expect(redirectUrl).toContain('/auth/callback');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use production URL in production mode', () => {
    fc.assert(
      fc.property(
        fc.webUrl({ withFragments: false, withQueryParameters: false }).filter(url => url.startsWith('https://')), // Random HTTPS production URLs
        (productionUrl) => {
          // Set production environment
          (global as any).__DEV__ = false;
          Object.defineProperty(process.env, 'NODE_ENV', {
            value: 'production',
            writable: true,
            configurable: true
          });
          process.env.EXPO_PUBLIC_APP_URL = productionUrl;

          // Need to re-import to get fresh environment variables
          jest.resetModules();
          const { getRedirectUrl: freshGetRedirectUrl } = require('../supabase-client');
          const redirectUrl = freshGetRedirectUrl();

          // In production, should use the configured production URL
          expect(redirectUrl).toContain(productionUrl);
          expect(redirectUrl).toContain('/auth/callback');
          expect(redirectUrl).not.toContain('localhost');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should always include /auth/callback path regardless of environment', () => {
    fc.assert(
      fc.property(
        fc.boolean(), // __DEV__ flag
        fc.constantFrom('development', 'production', 'test'), // NODE_ENV values
        fc.option(fc.webUrl({ withFragments: false, withQueryParameters: false }), { nil: undefined }), // Optional production URL
        (devFlag, nodeEnv, productionUrl) => {
          // Set environment
          (global as any).__DEV__ = devFlag;
          Object.defineProperty(process.env, 'NODE_ENV', {
            value: nodeEnv,
            writable: true,
            configurable: true
          });
          if (productionUrl) {
            process.env.EXPO_PUBLIC_APP_URL = productionUrl;
          } else {
            delete process.env.EXPO_PUBLIC_APP_URL;
          }

          const redirectUrl = getRedirectUrl();

          // Should always end with /auth/callback
          expect(redirectUrl).toMatch(/\/auth\/callback$/);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use correct protocol (http for localhost, https for production)', () => {
    fc.assert(
      fc.property(
        fc.boolean(), // __DEV__ flag
        fc.constantFrom('development', 'production'), // NODE_ENV values
        (devFlag, nodeEnv) => {
          // Set environment
          (global as any).__DEV__ = devFlag;
          Object.defineProperty(process.env, 'NODE_ENV', {
            value: nodeEnv,
            writable: true,
            configurable: true
          });
          
          if (nodeEnv === 'production') {
            process.env.EXPO_PUBLIC_APP_URL = 'https://human-0.com';
          }

          const redirectUrl = getRedirectUrl();

          if (devFlag || nodeEnv === 'development') {
            // Development should use http
            expect(redirectUrl).toMatch(/^http:\/\//);
          } else {
            // Production should use https
            expect(redirectUrl).toMatch(/^https:\/\//);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Additional property tests for configuration validation
 */
describe('Configuration validation properties', () => {
  it('should reject configurations with missing URL', () => {
    fc.assert(
      fc.property(
        fc.string(), // Random anon key
        (anonKey) => {
          const config = {
            url: undefined as any,
            anonKey,
            redirectUrl: 'http://localhost:8081/auth/callback',
          };

          const isValid = validateConfig(config);
          expect(isValid).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject configurations with missing anon key', () => {
    fc.assert(
      fc.property(
        fc.webUrl(), // Random URL
        (url) => {
          const config = {
            url,
            anonKey: undefined as any,
            redirectUrl: 'http://localhost:8081/auth/callback',
          };

          const isValid = validateConfig(config);
          expect(isValid).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should accept configurations with valid URL and anon key', () => {
    fc.assert(
      fc.property(
        fc.webUrl(), // Random valid URL
        fc.string({ minLength: 1 }), // Random non-empty anon key
        (url, anonKey) => {
          const config = {
            url,
            anonKey,
            redirectUrl: 'http://localhost:8081/auth/callback',
          };

          const isValid = validateConfig(config);
          expect(isValid).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject configurations with invalid URL format', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => {
          // Filter out strings that could be valid URLs
          try {
            new URL(s);
            return false;
          } catch {
            return true;
          }
        }),
        fc.string({ minLength: 1 }), // Random non-empty anon key
        (invalidUrl, anonKey) => {
          const config = {
            url: invalidUrl,
            anonKey,
            redirectUrl: 'http://localhost:8081/auth/callback',
          };

          const isValid = validateConfig(config);
          expect(isValid).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});
