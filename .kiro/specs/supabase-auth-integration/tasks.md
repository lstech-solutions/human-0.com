# Implementation Plan

- [x] 1. Set up Supabase client and configuration
  - Install @supabase/supabase-js package
  - Create supabase-client.ts with client initialization
  - Add environment variables to .env.example (SUPABASE_URL, SUPABASE_ANON_KEY)
  - Configure Supabase client with project URL https://pliztgzheioqxoyykiam.supabase.co
  - Add environment variable validation and warning logs
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 1.1 Write property test for Supabase client initialization
  - **Property 7: Environment-specific redirect URLs**
  - **Validates: Requirements 3.5, 8.1**

- [x] 2. Create SupabaseAuthProvider component
  - Create SupabaseAuthProvider.tsx with React Context
  - Implement auth state management (user, session, isLoading)
  - Add signInWithMagicLink method using Supabase signInWithOtp
  - Add signInWithGoogle method using Supabase signInWithOAuth
  - Add signOut method
  - Implement onAuthStateChange listener for session updates
  - Handle session persistence in browser storage
  - _Requirements: 1.1, 2.1, 4.1, 4.2_

- [x] 2.1 Write property test for magic link email sending
  - **Property 1: Magic link email sending**
  - **Validates: Requirements 1.1**

- [x] 2.2 Write property test for OAuth flow initiation
  - **Property 3: OAuth flow initiation**
  - **Validates: Requirements 2.1**

- [x] 2.3 Write property test for session storage
  - **Property 9: Session storage on authentication**
  - **Validates: Requirements 4.1**

- [ ] 3. Integrate SupabaseAuthProvider into application
  - Wrap application root with SupabaseAuthProvider in _layout.tsx
  - Ensure SupabaseAuthProvider wraps Web3Provider to maintain hierarchy
  - Test that both providers coexist without conflicts
  - _Requirements: 6.1, 6.2_

- [ ] 4. Extend useAuth hook for Supabase integration
  - Import SupabaseAuthContext in useAuth.ts
  - Add Supabase user and session to auth state
  - Implement signInWithMagicLink wrapper
  - Implement signInWithGoogle wrapper
  - Update logout to handle both Supabase and wallet disconnection
  - Prioritize Supabase session over wallet connection in auth state
  - _Requirements: 4.2, 4.4, 5.1, 5.2, 5.3, 6.5_

- [ ] 4.1 Write property test for session restoration
  - **Property 10: Session restoration on load**
  - **Validates: Requirements 4.2, 4.5**

- [ ] 4.2 Write property test for logout cleanup
  - **Property 11: Logout state cleanup**
  - **Validates: Requirements 4.4**

- [ ] 4.3 Write property test for auth method assignment
  - **Property 12: Auth method assignment**
  - **Validates: Requirements 5.1, 5.2, 5.3**

- [ ] 4.4 Write property test for auth method switching
  - **Property 16: Auth method switching cleanup**
  - **Validates: Requirements 6.5**

- [ ] 5. Update AuthModal for Supabase magic link
  - Replace placeholder magic link implementation with Supabase signInWithMagicLink
  - Update handleEmailMagicLink to use SupabaseAuthContext
  - Add proper error handling for Supabase errors
  - Update success flow to use Supabase session
  - Remove old API route references (/api/auth/magic-link)
  - _Requirements: 1.1, 1.2, 1.4, 7.1, 7.2_

- [ ] 5.1 Write property test for magic link token validation
  - **Property 2: Magic link token validation**
  - **Validates: Requirements 1.2**

- [ ] 5.2 Write property test for session establishment
  - **Property 6: Successful authentication session establishment**
  - **Validates: Requirements 1.4, 2.4**

- [ ] 6. Update AuthModal for Supabase Google OAuth
  - Replace placeholder Google OAuth with Supabase signInWithOAuth
  - Update handleGoogleLogin to use SupabaseAuthContext
  - Configure OAuth redirect URLs based on environment
  - Add proper error handling for OAuth errors
  - Remove old API route references (/api/auth/google)
  - _Requirements: 2.1, 2.2, 2.4, 7.3, 8.1_

- [ ] 6.1 Write property test for OAuth user data processing
  - **Property 4: OAuth user data processing**
  - **Validates: Requirements 2.2**

- [ ] 6.2 Write property test for OAuth CSRF protection
  - **Property 5: OAuth CSRF protection**
  - **Validates: Requirements 2.3**

- [ ] 6.3 Write property test for redirect URL matching
  - **Property 8: Redirect URL exact matching**
  - **Validates: Requirements 8.4**

- [ ] 7. Create OAuth callback route handler
  - Create apps/web/app/auth/callback.tsx route
  - Extract access_token and refresh_token from URL parameters
  - Handle error and error_description parameters
  - Validate session with Supabase
  - Redirect to dashboard on success
  - Display error message and redirect to login on failure
  - _Requirements: 2.2, 2.3, 2.4, 2.5_

- [ ] 8. Add comprehensive error handling
  - Create error type definitions (AuthError, AuthErrorDetails)
  - Implement user-friendly error messages for each error type
  - Add error logging for debugging
  - Implement retry logic for network errors
  - Add rate limit handling with countdown timer
  - Handle expired token errors with session cleanup
  - _Requirements: 1.5, 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 8.1 Write property test for error message sanitization
  - **Property 17: Error message sanitization**
  - **Validates: Requirements 7.5**

- [ ] 9. Configure environment-specific settings
  - Add development redirect URL (localhost) to .env.example
  - Add production redirect URL configuration
  - Update Supabase client to use environment-specific URLs
  - Document redirect URL configuration in Supabase dashboard
  - Test OAuth flow in both development and production environments
  - _Requirements: 3.5, 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 10. Ensure backward compatibility with wallet auth
  - Test existing wallet connection flows (MetaMask, Coinbase, WalletConnect)
  - Verify wallet auth works independently without Supabase
  - Test switching between wallet and Supabase auth methods
  - Ensure wallet auth state is preserved when Supabase is unavailable
  - Verify no breaking changes to existing wallet functionality
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 10.1 Write property test for wallet functionality preservation
  - **Property 14: Wallet functionality preservation**
  - **Validates: Requirements 6.1**

- [ ] 10.2 Write property test for wallet authentication independence
  - **Property 15: Wallet authentication independence**
  - **Validates: Requirements 6.4**

- [ ] 11. Update authentication UI and state display
  - Update AuthModal to show all three auth methods clearly
  - Display current auth method in user profile/settings
  - Show account identifier (email or wallet address) in UI
  - Add visual indicators for each auth method type
  - Ensure consistent styling across all auth methods
  - _Requirements: 5.4, 5.5_

- [ ] 11.1 Write property test for auth state display
  - **Property 13: Auth state display completeness**
  - **Validates: Requirements 5.4**

- [ ] 12. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Update documentation
  - Update AUTH_SETUP.md with Supabase configuration steps
  - Document environment variable requirements
  - Add Supabase dashboard configuration instructions
  - Document OAuth redirect URL setup for each environment
  - Add troubleshooting section for common Supabase issues
  - Update README with new authentication methods
  - _Requirements: All_
