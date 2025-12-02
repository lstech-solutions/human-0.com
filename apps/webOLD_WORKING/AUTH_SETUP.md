# Secure Authentication Setup Guide

This guide explains how to set up the secure authentication system with multiple login methods.

## Overview

The authentication system supports:
- 🔐 **Browser Wallet** (MetaMask, Coinbase Wallet, WalletConnect)
- 📧 **Email Magic Link** (passwordless login)
- 🔢 **OTP Codes** (6-digit verification)
- 🌐 **Google OAuth** (social login)

## Security Features

✅ **Production-Ready Security**
- Uses wagmi/viem for secure wallet connections
- CSRF protection for OAuth flows
- Secure session management
- Token expiration (15 min for magic links, 30 days for sessions)
- No sensitive data in localStorage (only session tokens)

✅ **Best Practices**
- Environment variable configuration
- Proper error handling
- Type-safe implementations
- Mobile and web support

## Quick Start

### 1. Install Dependencies

All required dependencies are already in `package.json`:
- `wagmi` - Secure Web3 wallet connections
- `viem` - Ethereum interactions
- `@tanstack/react-query` - Data fetching

### 2. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Required for wallet connections
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id

# Required for Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8081/api/auth/google/callback

# Required for production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
SESSION_SECRET=your-32-char-secret
```

### 3. Get WalletConnect Project ID

1. Go to https://cloud.walletconnect.com
2. Create a new project
3. Copy the Project ID
4. Add to `.env` as `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

### 4. Setup Google OAuth

1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Authorized redirect URIs:
   - Development: `http://localhost:8081/api/auth/google/callback`
   - Production: `https://yourdomain.com/api/auth/google/callback`
7. Copy Client ID and Client Secret to `.env`

### 5. Setup Email Service (Choose One)

#### Option A: SendGrid (Recommended)

```bash
# Get API key from https://sendgrid.com
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

#### Option B: Resend

```bash
# Get API key from https://resend.com
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

#### Option C: AWS SES

```bash
# Configure AWS credentials
AWS_REGION=us-east-1
AWS_SES_FROM_EMAIL=noreply@yourdomain.com
```

### 6. Implement Email Sending

Update `apps/web/app/api/auth/magic-link+api.ts`:

```typescript
// For SendGrid
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

await sgMail.send({
  to: email,
  from: process.env.SENDGRID_FROM_EMAIL!,
  subject: 'Your Magic Link - Human Zero',
  html: `
    <h2>Sign in to Human Zero</h2>
    <p>Click the link below to sign in:</p>
    <a href="${magicLink}">Sign In</a>
    <p>Or use this code: <strong>${otp}</strong></p>
    <p>This link expires in 15 minutes.</p>
  `,
});
```

## Usage

### Basic Usage

```tsx
import { SecureConnectButton } from '../components/SecureConnectButton';

function MyComponent() {
  return (
    <SecureConnectButton 
      variant="hero"
      onAuthSuccess={() => console.log('User authenticated!')}
    />
  );
}
```

### With Auth Hook

```tsx
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { isAuthenticated, account, method, logout } = useAuth();

  if (!isAuthenticated) {
    return <SecureConnectButton />;
  }

  return (
    <View>
      <Text>Connected: {account}</Text>
      <Text>Method: {method}</Text>
      <Button onPress={logout}>Disconnect</Button>
    </View>
  );
}
```

### Custom Modal

```tsx
import { AuthModal } from '../components/AuthModal';

function MyComponent() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <Button onPress={() => setShowAuth(true)}>
        Sign In
      </Button>
      
      <AuthModal
        visible={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={(account, method) => {
          console.log('Authenticated:', account, method);
        }}
      />
    </>
  );
}
```

## Production Deployment

### 1. Database Setup

Replace in-memory storage with a proper database:

```typescript
// Example with PostgreSQL
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Store magic link token
await pool.query(
  'INSERT INTO magic_links (token, email, expires_at) VALUES ($1, $2, $3)',
  [token, email, expiresAt]
);

// Store session
await pool.query(
  'INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, $3)',
  [sessionToken, userId, expiresAt]
);
```

### 2. Security Checklist

- [ ] Set strong `SESSION_SECRET` (min 32 chars)
- [ ] Use HTTPS in production
- [ ] Configure CORS properly
- [ ] Set secure cookie flags
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Use environment-specific redirect URIs
- [ ] Enable 2FA for admin accounts
- [ ] Monitor authentication logs
- [ ] Set up alerts for suspicious activity

### 3. Environment Variables

Update for production:

```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
NODE_ENV=production
```

### 4. Rate Limiting

Add rate limiting to prevent abuse:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many requests, please try again later',
});

// Apply to auth endpoints
app.use('/api/auth/', limiter);
```

## Troubleshooting

### Wallet Connection Issues

1. Check WalletConnect Project ID is set
2. Verify wallet extension is installed
3. Check browser console for errors
4. Try different wallet connector

### Email Not Sending

1. Verify email service API key
2. Check from email is verified
3. Look for errors in server logs
4. Test with a simple email first

### Google OAuth Errors

1. Verify redirect URI matches exactly
2. Check client ID and secret
3. Ensure Google+ API is enabled
4. Check authorized domains

### Session Issues

1. Clear browser localStorage
2. Check session expiration
3. Verify SESSION_SECRET is set
4. Check for CORS issues

## API Reference

### `useAuth()`

Hook for managing authentication state.

**Returns:**
- `isAuthenticated: boolean` - Whether user is authenticated
- `account: string | null` - User account (address or email)
- `method: AuthMethod | null` - Authentication method used
- `isLoading: boolean` - Loading state
- `login(account, method)` - Login function
- `logout()` - Logout function

### `<AuthModal />`

Modal component for authentication.

**Props:**
- `visible: boolean` - Show/hide modal
- `onClose: () => void` - Close callback
- `onSuccess?: (account, method) => void` - Success callback

### `<SecureConnectButton />`

Button component with built-in auth modal.

**Props:**
- `variant?: 'hero' | 'secondary' | 'compact'` - Button style
- `onAuthSuccess?: () => void` - Success callback

## Support

For issues or questions:
- Check the troubleshooting section
- Review server logs
- Check browser console
- Open an issue on GitHub

## License

MIT
