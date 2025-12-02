# Migration Guide: Secure Authentication

This guide helps you migrate from the old insecure wallet connection to the new secure authentication system.

## What Changed?

### Before (Insecure ❌)
- Direct `window.ethereum` access
- No proper error handling
- Security warnings in production
- Only MetaMask support
- No alternative login methods

### After (Secure ✅)
- wagmi/viem for secure connections
- Multiple wallet support (MetaMask, Coinbase, WalletConnect)
- Email magic links
- Google OAuth
- OTP verification
- Proper session management
- Production-ready security

## Step-by-Step Migration

### 1. Replace Old Components

#### Old Code (Remove):
```tsx
import { Web3ConnectButton } from '../components/Web3ConnectButton';
import { ConnectButton } from '../components/ConnectButton';
import { connectWallet } from '../lib/web3-wallet';

// Old usage
<Web3ConnectButton />
<ConnectButton onPress={handleConnect} />
```

#### New Code (Use):
```tsx
import { SecureConnectButton } from '../components/SecureConnectButton';
import { useAuth } from '../hooks/useAuth';

// New usage
<SecureConnectButton variant="hero" />

// Or with auth hook
const { isAuthenticated, account, logout } = useAuth();
```

### 2. Update Identity Components

#### Before:
```tsx
// apps/web/features/identity/components/IdentityCard.tsx
import { ConnectButton } from "../../../components/ConnectButton";

<SimpleConnectButton variant="hero" onPress={onCreateIdentity} />
```

#### After:
```tsx
import { SecureConnectButton } from "../../../components/SecureConnectButton";

<SecureConnectButton 
  variant="hero" 
  onAuthSuccess={onCreateIdentity}
/>
```

### 3. Update Canvas Page

#### Before:
```tsx
// No authentication button
```

#### After:
```tsx
import { SecureConnectButton } from '../components/SecureConnectButton';

<View className="flex-row items-center justify-between">
  <View className="flex-1">
    <Text>Canvas Title</Text>
  </View>
  <SecureConnectButton variant="compact" />
</View>
```

### 4. Replace Direct Wallet Calls

#### Before:
```tsx
import { connectWallet, getConnectedAccount } from '../lib/web3-wallet';

const handleConnect = async () => {
  const account = await connectWallet();
  if (account) {
    setAccount(account);
  }
};
```

#### After:
```tsx
import { useAuth } from '../hooks/useAuth';

const { isAuthenticated, account, login } = useAuth();

// Authentication is handled by SecureConnectButton
// Just check the state
if (isAuthenticated) {
  console.log('Connected:', account);
}
```

### 5. Update Web3Provider Usage

The Web3Provider is already configured correctly. Just ensure it wraps your app:

```tsx
// apps/web/app/_layout.tsx
import Web3Provider from '../providers/Web3Provider';

export default function RootLayout() {
  return (
    <Web3Provider>
      {/* Your app */}
    </Web3Provider>
  );
}
```

## Component Replacement Table

| Old Component | New Component | Notes |
|--------------|---------------|-------|
| `Web3ConnectButton` | `SecureConnectButton` | Drop-in replacement |
| `ConnectButton` | `SecureConnectButton` | More features |
| `connectWallet()` | `useAuth()` hook | Better state management |
| `getConnectedAccount()` | `useAuth()` hook | Automatic updates |
| `onAccountsChanged()` | `useAuth()` hook | Built-in |

## API Changes

### Old API:
```tsx
// Direct function calls
const account = await connectWallet();
const current = await getConnectedAccount();
const cleanup = onAccountsChanged((accounts) => {
  setAccount(accounts[0]);
});
```

### New API:
```tsx
// React hook
const { 
  isAuthenticated,  // boolean
  account,          // string | null
  method,           // 'wallet' | 'email' | 'otp' | 'social'
  isLoading,        // boolean
  login,            // (account, method) => void
  logout            // () => void
} = useAuth();
```

## Breaking Changes

### 1. No Direct Window.ethereum Access
**Before:** Direct access to `window.ethereum`
**After:** Use wagmi hooks

```tsx
// ❌ Old (Don't use)
if (window.ethereum) {
  await window.ethereum.request({ method: 'eth_requestAccounts' });
}

// ✅ New (Use this)
import { useConnect } from 'wagmi';
const { connect, connectors } = useConnect();
```

### 2. Account Format
**Before:** Always Ethereum address (0x...)
**After:** Can be address or email depending on auth method

```tsx
// Check auth method
if (method === 'wallet') {
  // account is 0x... address
} else {
  // account is email or user ID
}
```

### 3. Session Persistence
**Before:** No session persistence
**After:** Sessions persist across page reloads

```tsx
// Automatically restored on page load
const { isAuthenticated } = useAuth();
```

## Testing Your Migration

### 1. Test Wallet Connection
```tsx
// Test all wallet types
- MetaMask
- Coinbase Wallet
- WalletConnect (mobile)
```

### 2. Test Email Login
```tsx
// Test magic link flow
1. Enter email
2. Check email received
3. Click link
4. Verify logged in
```

### 3. Test Google OAuth
```tsx
// Test social login
1. Click Google button
2. Authorize
3. Verify logged in
```

### 4. Test Session Persistence
```tsx
// Test session survives reload
1. Log in
2. Refresh page
3. Verify still logged in
```

## Rollback Plan

If you need to rollback:

1. Keep old files as `.backup`:
```bash
mv apps/web/lib/web3-wallet.ts apps/web/lib/web3-wallet.ts.backup
mv apps/web/components/Web3ConnectButton.tsx apps/web/components/Web3ConnectButton.tsx.backup
```

2. Restore if needed:
```bash
mv apps/web/lib/web3-wallet.ts.backup apps/web/lib/web3-wallet.ts
mv apps/web/components/Web3ConnectButton.tsx.backup apps/web/components/Web3ConnectButton.tsx
```

## Common Issues

### Issue: "No connectors found"
**Solution:** Check Web3Provider wraps your app

### Issue: "WalletConnect not working"
**Solution:** Set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in `.env`

### Issue: "Email not sending"
**Solution:** Configure email service in magic-link API

### Issue: "Google OAuth fails"
**Solution:** Check redirect URI matches exactly

## Need Help?

1. Check [AUTH_SETUP.md](./AUTH_SETUP.md) for configuration
2. Review [Troubleshooting section](./AUTH_SETUP.md#troubleshooting)
3. Check browser console for errors
4. Open an issue on GitHub

## Next Steps

After migration:
1. ✅ Test all authentication methods
2. ✅ Configure production environment variables
3. ✅ Set up email service
4. ✅ Configure Google OAuth
5. ✅ Add rate limiting
6. ✅ Set up monitoring
7. ✅ Deploy to production

## Security Improvements

The new system provides:
- ✅ CSRF protection
- ✅ Secure session management
- ✅ Token expiration
- ✅ Multiple authentication methods
- ✅ Production-ready security
- ✅ Proper error handling
- ✅ Type safety
- ✅ Mobile support

Congratulations! Your authentication is now secure and production-ready. 🎉
