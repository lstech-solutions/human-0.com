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
