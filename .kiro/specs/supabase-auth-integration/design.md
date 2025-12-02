# Design Document

## Overview

This design document outlines the integration of Supabase authentication into the Human-0 web application. The system will add email magic link and Google OAuth authentication methods while preserving the existing Web3 wallet authentication. The integration uses Supabase project `pliztgzheioqxoyykiam` and the Supabase JavaScript client library.

The design follows a provider-based architecture where a SupabaseAuthProvider wraps the application and manages authentication state alongside the existing Web3Provider. The AuthModal component will be enhanced to support Supabase authentication methods, and the useAuth hook will be extended to handle multiple authentication providers.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Application Root                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              SupabaseAuthProvider                     │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │           Web3Provider                          │ │  │
│  │  │  ┌───────────────────────────────────────────┐  │ │  │
│  │  │  │        Application Components             │  │ │  │
│  │  │  │  - AuthModal (enhanced)                   │  │ │  │
│  │  │  │  - useAuth hook (extended)                │  │ │  │
│  │  │  │  - Protected routes                       │  │ │  │
│  │  │  └───────────────────────────────────────────┘  │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Flow

**Magic Link Flow:**
```
User enters email → Supabase sends magic link → User clicks link → 
Supabase validates token → Session established → Redirect to app
```

**Google OAuth Flow:**
```
User clicks Google button → Redirect to Google → User authorizes → 
Google redirects with code → Supabase exchanges code → Session established → 
Redirect to app
```

**Wallet Flow (existing):**
```
User selects wallet → Wagmi connects → Address retrieved → 
Session stored locally → User authenticated
```

### Technology Stack

- **Supabase Client**: `@supabase/supabase-js` v2.x
- **React Context**: For auth state management
- **Expo Router**: For handling OAuth callbacks
- **Wagmi/Viem**: Existing Web3 wallet integration (preserved)
- **React Native**: Cross-platform UI components

## Components and Interfaces

### 1. Supabase Client Configuration

**File**: `apps/web/lib/supabase-client.ts`

```typescript
interface SupabaseConfig {
  url: string;
  anonKey: string;
  redirectUrl: string;
}

interface SupabaseClient {
  auth: {
    signInWithOtp(params: { email: string }): Promise<AuthResponse>;
    signInWithOAuth(params: { provider: 'google' }): Promise<AuthResponse>;
    getSession(): Promise<{ data: { session: Session | null } }>;
    signOut(): Promise<void>;
    onAuthStateChange(callback: (event: string, session: Session | null) => void): Subscription;
  };
}
```

The Supabase client will be initialized with:
- URL: `https://pliztgzheioqxoyykiam.supabase.co`
- Anonymous key: From environment variable `SUPABASE_ANON_KEY`
- Redirect URL: Environment-specific (localhost for dev, production domain for prod)

### 2. SupabaseAuthProvider

**File**: `apps/web/providers/SupabaseAuthProvider.tsx`

```typescript
interface SupabaseAuthContextValue {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithMagicLink: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

interface User {
  id: string;
  email: string;
  user_metadata: Record<string, any>;
}

interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
}
```

The provider will:
- Initialize Supabase client on mount
- Listen for auth state changes
- Provide authentication methods to children
- Handle session persistence
- Manage loading states

### 3. Enhanced useAuth Hook

**File**: `apps/web/hooks/useAuth.ts`

```typescript
interface AuthState {
  isAuthenticated: boolean;
  account: string | null;
  method: AuthMethod | null;
  isLoading: boolean;
  user: User | null; // New: Supabase user object
}

type AuthMethod = 'wallet' | 'email' | 'social';

interface UseAuthReturn extends AuthState {
  login: (account: string, method: AuthMethod) => void;
  logout: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>; // New
  signInWithGoogle: () => Promise<void>; // New
}
```

The hook will:
- Check for Supabase session first
- Fall back to Web3 wallet connection
- Merge authentication state from both providers
- Provide unified logout functionality

### 4. Enhanced AuthModal Component

**File**: `apps/web/components/AuthModal.web.tsx`

The existing AuthModal will be enhanced to:
- Replace placeholder magic link implementation with Supabase
- Replace placeholder Google OAuth with Supabase
- Maintain existing wallet connection UI
- Show appropriate loading and error states
- Handle Supabase-specific errors

### 5. OAuth Callback Handler

**File**: `apps/web/app/auth/callback.tsx`

```typescript
interface CallbackParams {
  access_token?: string;
  refresh_token?: string;
  error?: string;
  error_description?: string;
}
```

This new route will:
- Handle OAuth redirect from Supabase
- Extract tokens from URL parameters
- Validate session with Supabase
- Redirect to dashboard on success
- Show error message on failure

## Data Models

### Supabase User Object

```typescript
interface SupabaseUser {
  id: string; // UUID from Supabase
  email: string;
  email_confirmed_at: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
  user_metadata: {
    avatar_url?: string;
    full_name?: string;
    provider?: string; // 'google', 'email'
  };
  app_metadata: {
    provider?: string;
    providers?: string[];
  };
}
```

### Session Storage

**LocalStorage Keys:**
- `supabase.auth.token`: Supabase session (managed by Supabase client)
- `auth_method`: Current authentication method ('wallet' | 'email' | 'social')
- `wallet_name`: Wallet name (for wallet auth only)

**Session Object:**
```typescript
interface StoredSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: SupabaseUser;
}
```

## Error Handling

### Error Types

```typescript
type AuthError =
  | 'network_error'
  | 'invalid_credentials'
  | 'expired_token'
  | 'rate_limit'
  | 'provider_error'
  | 'configuration_error';

interface AuthErrorDetails {
  type: AuthError;
  message: string;
  originalError?: Error;
}
```

### Error Handling Strategy

1. **Network Errors**: Retry with exponential backoff (max 3 attempts)
2. **Invalid/Expired Tokens**: Clear session and prompt re-authentication
3. **Rate Limiting**: Show countdown timer before allowing retry
4. **Provider Errors**: Display provider-specific error message
5. **Configuration Errors**: Log to console, show generic error to user

### User-Facing Error Messages

- Network error: "Connection failed. Please check your internet and try again."
- Invalid magic link: "This link is invalid or has expired. Please request a new one."
- Expired session: "Your session has expired. Please sign in again."
- Rate limit: "Too many attempts. Please wait {seconds} seconds before trying again."
- OAuth error: "Authentication with {provider} failed. Please try again."
- Configuration error: "Authentication is temporarily unavailable. Please try again later."

## Testing Strategy

### Unit Testing

The testing strategy will use Jest and React Testing Library for unit tests, and fast-check for property-based tests.

**Unit Test Coverage:**
- Supabase client initialization with valid/invalid config
- SupabaseAuthProvider state management
- useAuth hook state transitions
- AuthModal component interactions
- OAuth callback parameter parsing
- Error message formatting

**Example Unit Tests:**
- Test that SupabaseAuthProvider initializes client with correct URL
- Test that useAuth returns correct auth state for each method
- Test that AuthModal shows error when email is invalid
- Test that callback handler extracts tokens correctly
- Test that logout clears all stored session data

### Property-Based Testing

Property-based tests will verify universal properties across all authentication methods and inputs.

**Property Test Configuration:**
- Library: fast-check (JavaScript/TypeScript property testing)
- Minimum iterations: 100 per property
- Each test tagged with: `**Feature: supabase-auth-integration, Property {number}: {property_text}**`

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified the following redundancies:
- Properties 1.4 and 2.4 both test session establishment and redirect after successful auth - these can be combined into a single property covering all auth methods
- Properties 5.1, 5.2, and 5.3 all test auth method assignment - these can be combined into one property
- Properties 8.2 and 8.3 are specific examples that can be covered by property 8.1

### Authentication Flow Properties

**Property 1: Magic link email sending**
*For any* valid email address, when a user requests a magic link, the system should call the Supabase signInWithOtp API with that email address
**Validates: Requirements 1.1**

**Property 2: Magic link token validation**
*For any* valid magic link token, when a user clicks the link, the system should validate the token with Supabase and establish an authenticated session
**Validates: Requirements 1.2**

**Property 3: OAuth flow initiation**
*For any* OAuth provider button click, the system should call the Supabase signInWithOAuth API with the correct provider parameter
**Validates: Requirements 2.1**

**Property 4: OAuth user data processing**
*For any* successful OAuth response containing user profile data, the system should extract and store the user information correctly
**Validates: Requirements 2.2**

**Property 5: OAuth CSRF protection**
*For any* OAuth callback, the system should validate the state parameter before processing the authentication
**Validates: Requirements 2.3**

**Property 6: Successful authentication session establishment**
*For any* successful authentication (magic link, OAuth, or wallet), the system should store the session token and redirect to the dashboard
**Validates: Requirements 1.4, 2.4**

### Configuration Properties

**Property 7: Environment-specific redirect URLs**
*For any* environment mode (development, staging, production), the system should use the correct redirect URL for that environment
**Validates: Requirements 3.5, 8.1**

**Property 8: Redirect URL exact matching**
*For any* configured redirect URL, the system should match it exactly including protocol, domain, and port
**Validates: Requirements 8.4**

### Session Management Properties

**Property 9: Session storage on authentication**
*For any* successful authentication, the system should store the session token in browser storage
**Validates: Requirements 4.1**

**Property 10: Session restoration on load**
*For any* stored valid session token, when the application loads, the system should validate the token with Supabase and restore the authenticated state
**Validates: Requirements 4.2, 4.5**

**Property 11: Logout state cleanup**
*For any* authenticated state, when a user logs out, the system should remove all session tokens and clear all authentication state
**Validates: Requirements 4.4**

### Authentication Method Properties

**Property 12: Auth method assignment**
*For any* authentication flow, the system should set the auth method to "email" for magic links, "social" for OAuth, and "wallet" for Web3 wallets
**Validates: Requirements 5.1, 5.2, 5.3**

**Property 13: Auth state display completeness**
*For any* authenticated state, when displayed to the user, the system should include both the account identifier and the authentication method
**Validates: Requirements 5.4**

### Backward Compatibility Properties

**Property 14: Wallet functionality preservation**
*For any* Web3 wallet connection that worked before Supabase integration, the same connection should work after integration with identical behavior
**Validates: Requirements 6.1**

**Property 15: Wallet authentication independence**
*For any* user authenticated via Web3 wallet, the system should not require or attempt Supabase authentication
**Validates: Requirements 6.4**

**Property 16: Auth method switching cleanup**
*For any* authentication method switch, the system should clear all state from the previous authentication method before establishing the new one
**Validates: Requirements 6.5**

### Error Handling Properties

**Property 17: Error message sanitization**
*For any* error that occurs during authentication, the system should log detailed error information for debugging while displaying sanitized, user-friendly messages to users
**Validates: Requirements 7.5**

