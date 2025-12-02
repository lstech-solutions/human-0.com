# Requirements Document

## Introduction

This document specifies the requirements for integrating Supabase authentication into the Human-0 web application. The system currently supports Web3 wallet authentication (MetaMask, Coinbase Wallet, WalletConnect) and needs to add Supabase-powered email magic link authentication and Google OAuth authentication. The Supabase project ID is `pliztgzheioqxoyykiam`. The integration must maintain the existing wallet authentication while adding new authentication methods through Supabase, providing users with multiple secure ways to access the application.

## Glossary

- **Supabase**: An open-source Firebase alternative providing authentication, database, and storage services
- **Magic Link**: A passwordless authentication method where users receive a one-time login link via email
- **OAuth**: Open Authorization protocol allowing third-party authentication (e.g., Google)
- **Auth System**: The authentication system managing user sessions and identity verification
- **Web3 Wallet**: Cryptocurrency wallet browser extensions (MetaMask, Coinbase Wallet, etc.)
- **Session Token**: A secure token stored client-side to maintain authenticated state
- **Auth Provider**: A component that provides authentication context to the application
- **Supabase Client**: The JavaScript client library for interacting with Supabase services
- **Auth State**: The current authentication status including user identity and method

## Requirements

### Requirement 1

**User Story:** As a user, I want to sign in using my email address with a magic link, so that I can access the application without managing passwords.

#### Acceptance Criteria

1. WHEN a user enters their email address and requests a magic link THEN the Auth System SHALL send an email containing a unique authentication link to that address
2. WHEN a user clicks the magic link in their email THEN the Auth System SHALL verify the token and establish an authenticated session
3. WHEN a magic link is older than 60 minutes THEN the Auth System SHALL reject the authentication attempt and display an expiration message
4. WHEN a user is successfully authenticated via magic link THEN the Auth System SHALL store the session token and redirect to the application dashboard
5. WHEN the email sending fails THEN the Auth System SHALL display an error message and allow the user to retry

### Requirement 2

**User Story:** As a user, I want to sign in using my Google account, so that I can quickly access the application using my existing Google credentials.

#### Acceptance Criteria

1. WHEN a user clicks the Google sign-in button THEN the Auth System SHALL initiate the OAuth flow with Google's authorization server
2. WHEN Google successfully authenticates the user THEN the Auth System SHALL receive the user's profile information and create or update their account
3. WHEN the OAuth callback is received THEN the Auth System SHALL validate the state parameter to prevent CSRF attacks
4. WHEN a user completes Google authentication THEN the Auth System SHALL establish a session and redirect to the application dashboard
5. WHEN the OAuth flow fails or is cancelled THEN the Auth System SHALL display an appropriate error message and return to the login screen

### Requirement 3

**User Story:** As a developer, I want to configure Supabase with environment variables, so that the application can connect securely to the correct Supabase project.

#### Acceptance Criteria

1. WHEN the application initializes THEN the Auth System SHALL read the Supabase URL and anonymous key from environment variables
2. WHEN required environment variables are missing THEN the Auth System SHALL log a warning and prevent authentication attempts
3. WHEN the Supabase client is created THEN the Auth System SHALL use the project-specific URL `https://pliztgzheioqxoyykiam.supabase.co`
4. WHEN environment variables are updated THEN the Auth System SHALL require an application restart to apply changes
5. WHEN running in development mode THEN the Auth System SHALL use localhost redirect URLs for OAuth callbacks

### Requirement 4

**User Story:** As a user, I want my authentication state to persist across browser sessions, so that I don't have to sign in every time I visit the application.

#### Acceptance Criteria

1. WHEN a user successfully authenticates THEN the Auth System SHALL store the session token in secure browser storage
2. WHEN a user returns to the application THEN the Auth System SHALL check for a valid session token and restore the authenticated state
3. WHEN a session token expires THEN the Auth System SHALL clear the stored token and require re-authentication
4. WHEN a user explicitly logs out THEN the Auth System SHALL remove the session token and clear all authentication state
5. WHEN the application loads THEN the Auth System SHALL validate the stored session token with Supabase before restoring authenticated state

### Requirement 5

**User Story:** As a user, I want to see which authentication method I used to sign in, so that I understand how my account is secured.

#### Acceptance Criteria

1. WHEN a user authenticates via magic link THEN the Auth System SHALL set the authentication method to "email"
2. WHEN a user authenticates via Google OAuth THEN the Auth System SHALL set the authentication method to "social"
3. WHEN a user authenticates via Web3 wallet THEN the Auth System SHALL set the authentication method to "wallet"
4. WHEN the authentication state is displayed THEN the Auth System SHALL show the user's account identifier and authentication method
5. WHEN multiple authentication methods are available THEN the Auth System SHALL allow users to choose their preferred method

### Requirement 6

**User Story:** As a developer, I want to maintain the existing Web3 wallet authentication, so that current users can continue using their preferred authentication method.

#### Acceptance Criteria

1. WHEN Supabase authentication is integrated THEN the Auth System SHALL preserve all existing Web3 wallet connection functionality
2. WHEN a user connects a Web3 wallet THEN the Auth System SHALL use the existing wagmi/viem implementation without modification
3. WHEN both Supabase and wallet authentication are available THEN the Auth System SHALL allow users to choose between methods
4. WHEN a user is authenticated via wallet THEN the Auth System SHALL not require Supabase authentication
5. WHEN switching between authentication methods THEN the Auth System SHALL properly clear the previous authentication state

### Requirement 7

**User Story:** As a developer, I want to handle authentication errors gracefully, so that users receive clear feedback when authentication fails.

#### Acceptance Criteria

1. WHEN a network error occurs during authentication THEN the Auth System SHALL display a user-friendly error message
2. WHEN an invalid magic link is used THEN the Auth System SHALL display a message indicating the link is invalid or expired
3. WHEN OAuth authentication fails THEN the Auth System SHALL display the specific error reason from the provider
4. WHEN rate limiting is triggered THEN the Auth System SHALL display a message asking the user to wait before retrying
5. WHEN an error occurs THEN the Auth System SHALL log the error details for debugging while showing sanitized messages to users

### Requirement 8

**User Story:** As a system administrator, I want to configure OAuth redirect URLs for different environments, so that authentication works correctly in development, staging, and production.

#### Acceptance Criteria

1. WHEN configuring OAuth providers THEN the Auth System SHALL use environment-specific redirect URLs
2. WHEN running in development THEN the Auth System SHALL use localhost URLs for OAuth callbacks
3. WHEN running in production THEN the Auth System SHALL use the production domain for OAuth callbacks
4. WHEN the redirect URL is configured in Supabase THEN the Auth System SHALL match the URL exactly including protocol and port
5. WHEN multiple environments exist THEN the Auth System SHALL support configuring different redirect URLs for each environment
