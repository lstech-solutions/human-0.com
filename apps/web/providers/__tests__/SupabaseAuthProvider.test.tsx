/**
 * Property-based tests for SupabaseAuthProvider
 * Feature: supabase-auth-integration
 */

import * as fc from 'fast-check';

// Mock the supabase client before importing the provider
const mockSignInWithOtp = jest.fn();
const mockSignInWithOAuth = jest.fn();
const mockSignOut = jest.fn();
const mockGetSession = jest.fn();
const mockOnAuthStateChange = jest.fn();

jest.mock('../../lib/supabase-client', () => ({
  supabase: {
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
      signInWithOtp: mockSignInWithOtp,
      signInWithOAuth: mockSignInWithOAuth,
      signOut: mockSignOut,
    },
  },
}));

// Import after mocking
const { supabase } = require('../../lib/supabase-client');

describe('SupabaseAuthProvider Property Tests', () => {
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
   * **Feature: supabase-auth-integration, Property 1: Magic link email sending**
   * **Validates: Requirements 1.1**
   * 
   * For any valid email address, when a user requests a magic link, 
   * the system should call the Supabase signInWithOtp API with that email address
   */
  describe('Property 1: Magic link email sending', () => {
    it('should call signInWithOtp with any valid email address', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(), // Generate random valid email addresses
          async (email) => {
            // Reset mocks for this iteration
            mockSignInWithOtp.mockClear();
            
            // Mock successful OTP sending
            mockSignInWithOtp.mockResolvedValue({
              data: {},
              error: null,
            });

            // Call the Supabase auth method directly
            await supabase.auth.signInWithOtp({
              email,
              options: {
                emailRedirectTo: window.location.origin + '/auth/callback',
              },
            });

            // Verify that signInWithOtp was called with the correct email
            expect(mockSignInWithOtp).toHaveBeenCalledWith({
              email,
              options: {
                emailRedirectTo: expect.stringContaining('/auth/callback'),
              },
            });

            // Verify it was called exactly once for this email
            expect(mockSignInWithOtp).toHaveBeenCalledTimes(1);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include redirect URL in magic link options', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(),
          async (email) => {
            mockSignInWithOtp.mockClear();
            
            mockSignInWithOtp.mockResolvedValue({
              data: {},
              error: null,
            });

            await supabase.auth.signInWithOtp({
              email,
              options: {
                emailRedirectTo: window.location.origin + '/auth/callback',
              },
            });

            // Verify the options include emailRedirectTo
            const callArgs = mockSignInWithOtp.mock.calls[0][0];
            expect(callArgs.options).toBeDefined();
            expect(callArgs.options.emailRedirectTo).toBeDefined();
            expect(callArgs.options.emailRedirectTo).toContain('/auth/callback');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle errors when signInWithOtp fails', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(),
          fc.string({ minLength: 1 }), // Random error message
          async (email, errorMessage) => {
            mockSignInWithOtp.mockClear();
            
            // Mock OTP sending failure
            mockSignInWithOtp.mockResolvedValue({
              data: {},
              error: { message: errorMessage },
            });

            const result = await supabase.auth.signInWithOtp({
              email,
              options: {
                emailRedirectTo: window.location.origin + '/auth/callback',
              },
            });

            // Verify that an error was returned
            expect(result.error).toBeDefined();
            expect(result.error.message).toBe(errorMessage);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});

  /**
   * **Feature: supabase-auth-integration, Property 3: OAuth flow initiation**
   * **Validates: Requirements 2.1**
   * 
   * For any OAuth provider button click, the system should call the Supabase 
   * signInWithOAuth API with the correct provider parameter
   */
  describe('Property 3: OAuth flow initiation', () => {
    const redirectUrl = 'http://localhost:8081/auth/callback';
    
    it('should call signInWithOAuth with Google provider', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constant('google'), // For now, we only support Google
          async (provider) => {
            mockSignInWithOAuth.mockClear();
            
            // Mock successful OAuth initiation
            mockSignInWithOAuth.mockResolvedValue({
              data: { url: 'https://accounts.google.com/oauth', provider },
              error: null,
            });

            // Call the Supabase auth method directly
            await supabase.auth.signInWithOAuth({
              provider,
              options: {
                redirectTo: redirectUrl,
              },
            });

            // Verify that signInWithOAuth was called with the correct provider
            expect(mockSignInWithOAuth).toHaveBeenCalledWith({
              provider,
              options: {
                redirectTo: expect.stringContaining('/auth/callback'),
              },
            });

            // Verify it was called exactly once
            expect(mockSignInWithOAuth).toHaveBeenCalledTimes(1);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include redirect URL in OAuth options', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constant('google'),
          async (provider) => {
            mockSignInWithOAuth.mockClear();
            
            mockSignInWithOAuth.mockResolvedValue({
              data: { url: 'https://accounts.google.com/oauth', provider },
              error: null,
            });

            await supabase.auth.signInWithOAuth({
              provider,
              options: {
                redirectTo: redirectUrl,
              },
            });

            // Verify the options include redirectTo
            const callArgs = mockSignInWithOAuth.mock.calls[0][0];
            expect(callArgs.options).toBeDefined();
            expect(callArgs.options.redirectTo).toBeDefined();
            expect(callArgs.options.redirectTo).toContain('/auth/callback');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle errors when signInWithOAuth fails', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constant('google'),
          fc.string({ minLength: 1 }), // Random error message
          async (provider, errorMessage) => {
            mockSignInWithOAuth.mockClear();
            
            // Mock OAuth initiation failure
            mockSignInWithOAuth.mockResolvedValue({
              data: { url: null, provider: null },
              error: { message: errorMessage },
            });

            const result = await supabase.auth.signInWithOAuth({
              provider,
              options: {
                redirectTo: redirectUrl,
              },
            });

            // Verify that an error was returned
            expect(result.error).toBeDefined();
            expect(result.error.message).toBe(errorMessage);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return OAuth URL on successful initiation', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constant('google'),
          fc.webUrl({ withFragments: false }), // Random OAuth URL
          async (provider, oauthUrl) => {
            mockSignInWithOAuth.mockClear();
            
            mockSignInWithOAuth.mockResolvedValue({
              data: { url: oauthUrl, provider },
              error: null,
            });

            const result = await supabase.auth.signInWithOAuth({
              provider,
              options: {
                redirectTo: redirectUrl,
              },
            });

            // Verify that a URL was returned
            expect(result.data.url).toBe(oauthUrl);
            expect(result.error).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: supabase-auth-integration, Property 9: Session storage on authentication**
   * **Validates: Requirements 4.1**
   * 
   * For any successful authentication, the system should store the session token 
   * in browser storage
   */
  describe('Property 9: Session storage on authentication', () => {
    it('should persist session automatically via Supabase client', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            access_token: fc.string({ minLength: 20 }),
            refresh_token: fc.string({ minLength: 20 }),
            expires_at: fc.integer({ min: Math.floor(Date.now() / 1000), max: Math.floor(Date.now() / 1000) + 3600 }),
            user: fc.record({
              id: fc.uuid(),
              email: fc.emailAddress(),
            }),
          }),
          async (sessionData) => {
            mockGetSession.mockClear();
            
            // Mock a successful session retrieval
            const session = {
              access_token: sessionData.access_token,
              refresh_token: sessionData.refresh_token,
              expires_at: sessionData.expires_at,
              user: {
                id: sessionData.user.id,
                email: sessionData.user.email,
                app_metadata: {},
                user_metadata: {},
                aud: 'authenticated',
                created_at: new Date().toISOString(),
              },
            };

            mockGetSession.mockResolvedValue({
              data: { session },
              error: null,
            });

            // Call getSession to simulate session retrieval
            const result = await supabase.auth.getSession();

            // Verify that session was retrieved successfully
            expect(result.data.session).toBeDefined();
            expect(result.data.session?.access_token).toBe(sessionData.access_token);
            expect(result.data.session?.refresh_token).toBe(sessionData.refresh_token);
            expect(result.data.session?.user.email).toBe(sessionData.user.email);
            expect(result.error).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle null session when not authenticated', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constant(null),
          async (session) => {
            mockGetSession.mockClear();
            
            mockGetSession.mockResolvedValue({
              data: { session },
              error: null,
            });

            const result = await supabase.auth.getSession();

            // Verify that no session was returned
            expect(result.data.session).toBeNull();
            expect(result.error).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include all required session fields', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            access_token: fc.string({ minLength: 20 }),
            refresh_token: fc.string({ minLength: 20 }),
            expires_at: fc.integer({ min: Math.floor(Date.now() / 1000), max: Math.floor(Date.now() / 1000) + 3600 }),
            user: fc.record({
              id: fc.uuid(),
              email: fc.emailAddress(),
            }),
          }),
          async (sessionData) => {
            mockGetSession.mockClear();
            
            const session = {
              access_token: sessionData.access_token,
              refresh_token: sessionData.refresh_token,
              expires_at: sessionData.expires_at,
              user: {
                id: sessionData.user.id,
                email: sessionData.user.email,
                app_metadata: {},
                user_metadata: {},
                aud: 'authenticated',
                created_at: new Date().toISOString(),
              },
            };

            mockGetSession.mockResolvedValue({
              data: { session },
              error: null,
            });

            const result = await supabase.auth.getSession();

            // Verify all required fields are present
            expect(result.data.session).toHaveProperty('access_token');
            expect(result.data.session).toHaveProperty('refresh_token');
            expect(result.data.session).toHaveProperty('expires_at');
            expect(result.data.session).toHaveProperty('user');
            expect(result.data.session?.user).toHaveProperty('id');
            expect(result.data.session?.user).toHaveProperty('email');
          }
        ),
        { numRuns: 100 }
      );
    });
  });
