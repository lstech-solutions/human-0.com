/**
 * Property-based tests for SupabaseAuthProvider
 * Feature: supabase-auth-integration
 */

import * as fc from 'fast-check';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { SupabaseAuthProvider, useSupabaseAuth } from '../SupabaseAuthProvider';

// Mock the supabase client
jest.mock('../../lib/supabase-client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      signInWithOtp: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

const mockSupabase = require('../../lib/supabase-client').supabase;

describe('SupabaseAuthProvider Property Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: jest.fn(),
        },
      },
    });
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
            // Mock successful OTP sending
            mockSupabase.auth.signInWithOtp.mockResolvedValue({
              data: {},
              error: null,
            });

            // Render the hook with provider
            const wrapper = ({ children }: { children: React.ReactNode }) => (
              <SupabaseAuthProvider>{children}</SupabaseAuthProvider>
            );

            const { result } = renderHook(() => useSupabaseAuth(), { wrapper });

            // Wait for initial loading to complete
            await waitFor(() => {
              expect(result.current.isLoading).toBe(false);
            });

            // Call signInWithMagicLink with the generated email
            await act(async () => {
              await result.current.signInWithMagicLink(email);
            });

            // Verify that signInWithOtp was called with the correct email
            expect(mockSupabase.auth.signInWithOtp).toHaveBeenCalledWith({
              email,
              options: {
                emailRedirectTo: expect.stringContaining('/auth/callback'),
              },
            });

            // Verify it was called exactly once for this email
            expect(mockSupabase.auth.signInWithOtp).toHaveBeenCalledTimes(1);
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
            mockSupabase.auth.signInWithOtp.mockResolvedValue({
              data: {},
              error: null,
            });

            const wrapper = ({ children }: { children: React.ReactNode }) => (
              <SupabaseAuthProvider>{children}</SupabaseAuthProvider>
            );

            const { result } = renderHook(() => useSupabaseAuth(), { wrapper });

            await waitFor(() => {
              expect(result.current.isLoading).toBe(false);
            });

            await act(async () => {
              await result.current.signInWithMagicLink(email);
            });

            // Verify the options include emailRedirectTo
            const callArgs = mockSupabase.auth.signInWithOtp.mock.calls[0][0];
            expect(callArgs.options).toBeDefined();
            expect(callArgs.options.emailRedirectTo).toBeDefined();
            expect(callArgs.options.emailRedirectTo).toContain('/auth/callback');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should throw error when signInWithOtp fails', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(),
          fc.string({ minLength: 1 }), // Random error message
          async (email, errorMessage) => {
            // Mock OTP sending failure
            mockSupabase.auth.signInWithOtp.mockResolvedValue({
              data: {},
              error: { message: errorMessage },
            });

            const wrapper = ({ children }: { children: React.ReactNode }) => (
              <SupabaseAuthProvider>{children}</SupabaseAuthProvider>
            );

            const { result } = renderHook(() => useSupabaseAuth(), { wrapper });

            await waitFor(() => {
              expect(result.current.isLoading).toBe(false);
            });

            // Expect the function to throw
            await expect(
              act(async () => {
                await result.current.signInWithMagicLink(email);
              })
            ).rejects.toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
