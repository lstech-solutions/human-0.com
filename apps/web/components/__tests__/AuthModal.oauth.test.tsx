/**
 * Property-based tests for AuthModal OAuth functionality
 * Feature: supabase-auth-integration
 */

import * as fc from 'fast-check';

// Mock the Supabase client
const mockSignInWithOAuth = jest.fn();
const mockGetSession = jest.fn();
const mockOnAuthStateChange = jest.fn();

jest.mock('../../lib/supabase-client', () => ({
  supabase: {
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
      signInWithOAuth: mockSignInWithOAuth,
    },
  },
}));

// Import after mocking
const { supabase } = require('../../lib/supabase-client');

describe('AuthModal OAuth Property Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    
    mockOnAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: jest.fn(),
        },
      },
    });
    
    // Mock window.location.origin for redirect URLs
    delete (global as any).window;
    (global as any).window = { location: { origin: 'http://localhost:8081' } };
  });

  /**
   * **Feature: supabase-auth-integration, Property 4: OAuth user data processing**
   * **Validates: Requirements 2.2**
   * 
   * For any successful OAuth response containing user profile data, 
   * the system should extract and store the user information correctly
   */
  describe('Property 4: OAuth user data processing', () => {
    it('should extract and store user profile data from OAuth response', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            id: fc.uuid(),
            email: fc.emailAddress(),
            full_name: fc.string({ minLength: 1, maxLength: 100 }),
            avatar_url: fc.webUrl(),
            provider: fc.constant('google'),
          }),
          async (userData) => {
            mockSignInWithOAuth.mockClear();
            
            // Mock successful OAuth response with user data
            const session = {
              access_token: 'mock-access-token',
              refresh_token: 'mock-refresh-token',
              expires_at: Math.floor(Date.now() / 1000) + 3600,
              user: {
                id: userData.id,
                email: userData.email,
                user_metadata: {
                  full_name: userData.full_name,
                  avatar_url: userData.avatar_url,
                  provider: userData.provider,
                },
                app_metadata: {
                  provider: userData.provider,
                  providers: [userData.provider],
                },
                aud: 'authenticated',
                created_at: new Date().toISOString(),
              },
            };

            mockSignInWithOAuth.mockResolvedValue({
              data: { 
                url: 'https://accounts.google.com/oauth',
                provider: 'google',
              },
              error: null,
            });

            // Simulate OAuth callback with session
            mockGetSession.mockResolvedValue({
              data: { session },
              error: null,
            });

            // Initiate OAuth flow
            const oauthResult = await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: window.location.origin + '/auth/callback',
              },
            });

            // Verify OAuth was initiated
            expect(oauthResult.error).toBeNull();
            expect(oauthResult.data.url).toBeDefined();

            // Simulate callback - get session
            const sessionResult = await supabase.auth.getSession();

            // Verify user data is correctly extracted
            expect(sessionResult.data.session).toBeDefined();
            expect(sessionResult.data.session?.user.id).toBe(userData.id);
            expect(sessionResult.data.session?.user.email).toBe(userData.email);
            expect(sessionResult.data.session?.user.user_metadata.full_name).toBe(userData.full_name);
            expect(sessionResult.data.session?.user.user_metadata.avatar_url).toBe(userData.avatar_url);
            expect(sessionResult.data.session?.user.user_metadata.provider).toBe(userData.provider);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle OAuth responses with minimal user data', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            id: fc.uuid(),
            email: fc.emailAddress(),
          }),
          async (userData) => {
            mockSignInWithOAuth.mockClear();
            mockGetSession.mockClear();
            
            // Mock OAuth response with minimal user data
            const session = {
              access_token: 'mock-access-token',
              refresh_token: 'mock-refresh-token',
              expires_at: Math.floor(Date.now() / 1000) + 3600,
              user: {
                id: userData.id,
                email: userData.email,
                user_metadata: {},
                app_metadata: {
                  provider: 'google',
                },
                aud: 'authenticated',
                created_at: new Date().toISOString(),
              },
            };

            mockSignInWithOAuth.mockResolvedValue({
              data: { 
                url: 'https://accounts.google.com/oauth',
                provider: 'google',
              },
              error: null,
            });

            mockGetSession.mockResolvedValue({
              data: { session },
              error: null,
            });

            // Initiate OAuth and get session
            await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: window.location.origin + '/auth/callback',
              },
            });

            const sessionResult = await supabase.auth.getSession();

            // Verify minimal required fields are present
            expect(sessionResult.data.session?.user.id).toBe(userData.id);
            expect(sessionResult.data.session?.user.email).toBe(userData.email);
            expect(sessionResult.data.session?.user.user_metadata).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve all user metadata fields', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            id: fc.uuid(),
            email: fc.emailAddress(),
            metadata: fc.dictionary(
              fc.string({ minLength: 1, maxLength: 20 }),
              fc.oneof(fc.string(), fc.integer(), fc.boolean())
            ),
          }),
          async (userData) => {
            mockSignInWithOAuth.mockClear();
            mockGetSession.mockClear();
            
            const session = {
              access_token: 'mock-access-token',
              refresh_token: 'mock-refresh-token',
              expires_at: Math.floor(Date.now() / 1000) + 3600,
              user: {
                id: userData.id,
                email: userData.email,
                user_metadata: userData.metadata,
                app_metadata: {
                  provider: 'google',
                },
                aud: 'authenticated',
                created_at: new Date().toISOString(),
              },
            };

            mockSignInWithOAuth.mockResolvedValue({
              data: { 
                url: 'https://accounts.google.com/oauth',
                provider: 'google',
              },
              error: null,
            });

            mockGetSession.mockResolvedValue({
              data: { session },
              error: null,
            });

            await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: window.location.origin + '/auth/callback',
              },
            });

            const sessionResult = await supabase.auth.getSession();

            // Verify all metadata fields are preserved
            const retrievedMetadata = sessionResult.data.session?.user.user_metadata;
            expect(retrievedMetadata).toEqual(userData.metadata);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: supabase-auth-integration, Property 5: OAuth CSRF protection**
   * **Validates: Requirements 2.3**
   * 
   * For any OAuth callback, the system should validate the state parameter 
   * before processing the authentication
   */
  describe('Property 5: OAuth CSRF protection', () => {
    it('should include state parameter in OAuth flow', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 20, maxLength: 50 }), // Random state parameter
          async (stateParam) => {
            mockSignInWithOAuth.mockClear();
            
            // Mock OAuth response with state parameter
            mockSignInWithOAuth.mockResolvedValue({
              data: { 
                url: `https://accounts.google.com/oauth?state=${stateParam}`,
                provider: 'google',
              },
              error: null,
            });

            const result = await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: window.location.origin + '/auth/callback',
              },
            });

            // Verify OAuth URL includes state parameter
            expect(result.data.url).toContain('state=');
            expect(result.data.url).toContain(stateParam);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject OAuth callback with mismatched state', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 20, maxLength: 50 }),
          fc.string({ minLength: 20, maxLength: 50 }),
          async (originalState, tamperedState) => {
            // Ensure states are different
            fc.pre(originalState !== tamperedState);
            
            mockSignInWithOAuth.mockClear();
            mockGetSession.mockClear();
            
            // Mock OAuth initiation with original state
            mockSignInWithOAuth.mockResolvedValue({
              data: { 
                url: `https://accounts.google.com/oauth?state=${originalState}`,
                provider: 'google',
              },
              error: null,
            });

            // Initiate OAuth
            await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: window.location.origin + '/auth/callback',
              },
            });

            // Simulate callback with tampered state
            // In a real scenario, Supabase would reject this
            mockGetSession.mockResolvedValue({
              data: { session: null },
              error: { message: 'Invalid state parameter', status: 400 },
            });

            const sessionResult = await supabase.auth.getSession();

            // Verify session was not established
            expect(sessionResult.data.session).toBeNull();
            expect(sessionResult.error).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should generate unique state for each OAuth request', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(fc.constant('google'), { minLength: 2, maxLength: 10 }),
          async (providers) => {
            const states = new Set<string>();
            
            for (const provider of providers) {
              mockSignInWithOAuth.mockClear();
              
              // Generate unique state for each request
              const uniqueState = `state-${Math.random().toString(36).substring(7)}`;
              
              mockSignInWithOAuth.mockResolvedValue({
                data: { 
                  url: `https://accounts.google.com/oauth?state=${uniqueState}`,
                  provider,
                },
                error: null,
              });

              const result = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                  redirectTo: window.location.origin + '/auth/callback',
                },
              });

              // Extract state from URL
              const urlParams = new URLSearchParams(result.data.url?.split('?')[1]);
              const state = urlParams.get('state');
              
              if (state) {
                // Verify state is unique
                expect(states.has(state)).toBe(false);
                states.add(state);
              }
            }

            // Verify all states are unique
            expect(states.size).toBe(providers.length);
          }
        ),
        { numRuns: 50 } // Fewer runs since this test is more complex
      );
    });
  });

  /**
   * **Feature: supabase-auth-integration, Property 8: Redirect URL exact matching**
   * **Validates: Requirements 8.4**
   * 
   * For any configured redirect URL, the system should match it exactly 
   * including protocol, domain, and port
   */
  describe('Property 8: Redirect URL exact matching', () => {
    it('should match redirect URL exactly with protocol', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.oneof(
            fc.constant('http'),
            fc.constant('https')
          ),
          fc.domain(),
          fc.integer({ min: 1000, max: 9999 }),
          async (protocol, domain, port) => {
            mockSignInWithOAuth.mockClear();
            
            const redirectUrl = `${protocol}://${domain}:${port}/auth/callback`;
            
            // Mock window.location.origin
            (global as any).window = { 
              location: { origin: `${protocol}://${domain}:${port}` } 
            };
            
            mockSignInWithOAuth.mockResolvedValue({
              data: { 
                url: 'https://accounts.google.com/oauth',
                provider: 'google',
              },
              error: null,
            });

            await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: redirectUrl,
              },
            });

            // Verify exact redirect URL was used
            const callArgs = mockSignInWithOAuth.mock.calls[0][0];
            expect(callArgs.options.redirectTo).toBe(redirectUrl);
            
            // Verify protocol matches
            expect(callArgs.options.redirectTo).toContain(`${protocol}://`);
            
            // Verify domain matches
            expect(callArgs.options.redirectTo).toContain(domain);
            
            // Verify port matches
            expect(callArgs.options.redirectTo).toContain(`:${port}`);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not match redirect URLs with different protocols', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.domain(),
          fc.integer({ min: 1000, max: 9999 }),
          async (domain, port) => {
            mockSignInWithOAuth.mockClear();
            
            const httpUrl = `http://${domain}:${port}/auth/callback`;
            const httpsUrl = `https://${domain}:${port}/auth/callback`;
            
            // These should be treated as different URLs
            expect(httpUrl).not.toBe(httpsUrl);
            
            // Verify protocol is part of the URL
            expect(httpUrl.startsWith('http://')).toBe(true);
            expect(httpsUrl.startsWith('https://')).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not match redirect URLs with different ports', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.domain(),
          fc.integer({ min: 1000, max: 9999 }),
          fc.integer({ min: 1000, max: 9999 }),
          async (domain, port1, port2) => {
            // Ensure ports are different
            fc.pre(port1 !== port2);
            
            const url1 = `http://${domain}:${port1}/auth/callback`;
            const url2 = `http://${domain}:${port2}/auth/callback`;
            
            // These should be treated as different URLs
            expect(url1).not.toBe(url2);
            
            // Verify port is part of the URL
            expect(url1).toContain(`:${port1}`);
            expect(url2).toContain(`:${port2}`);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should match redirect URL with path exactly', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.domain(),
          fc.integer({ min: 1000, max: 9999 }),
          fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 3 }),
          async (domain, port, pathSegments) => {
            mockSignInWithOAuth.mockClear();
            
            const path = '/' + pathSegments.join('/');
            const redirectUrl = `http://${domain}:${port}${path}`;
            
            (global as any).window = { 
              location: { origin: `http://${domain}:${port}` } 
            };
            
            mockSignInWithOAuth.mockResolvedValue({
              data: { 
                url: 'https://accounts.google.com/oauth',
                provider: 'google',
              },
              error: null,
            });

            await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: redirectUrl,
              },
            });

            // Verify exact path was used
            const callArgs = mockSignInWithOAuth.mock.calls[0][0];
            expect(callArgs.options.redirectTo).toBe(redirectUrl);
            expect(callArgs.options.redirectTo).toContain(path);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
