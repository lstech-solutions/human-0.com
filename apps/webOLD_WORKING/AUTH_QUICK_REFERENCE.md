# Authentication Quick Reference

## 🚀 Quick Start

```tsx
import { SecureConnectButton } from '../components/SecureConnectButton';

// That's it! 
<SecureConnectButton variant="hero" />
```

## 🎯 Common Use Cases

### 1. Simple Connect Button
```tsx
<SecureConnectButton variant="hero" />
```

### 2. Check If User Is Authenticated
```tsx
import { useAuth } from '../hooks/useAuth';

const { isAuthenticated, account } = useAuth();

if (isAuthenticated) {
  return <Text>Welcome {account}!</Text>;
}
```

### 3. Logout
```tsx
const { logout } = useAuth();

<Button onPress={logout}>Sign Out</Button>
```

### 4. Custom Auth Modal
```tsx
import { AuthModal } from '../components/AuthModal';

const [show, setShow] = useState(false);

<AuthModal
  visible={show}
  onClose={() => setShow(false)}
  onSuccess={(account, method) => {
    console.log('Logged in:', account, method);
  }}
/>
```

### 5. Protect Routes
```tsx
const { isAuthenticated, isLoading } = useAuth();

if (isLoading) return <Loading />;
if (!isAuthenticated) return <SecureConnectButton />;

return <ProtectedContent />;
```

## 🔧 Configuration

### Minimum Required (.env)
```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
```

### Full Configuration (.env)
```bash
# Wallet
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret
GOOGLE_REDIRECT_URI=http://localhost:8081/api/auth/google/callback

# Email
SENDGRID_API_KEY=your-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:8081
SESSION_SECRET=your-32-char-secret
```

## 📦 Button Variants

```tsx
// Large hero button
<SecureConnectButton variant="hero" />

// Medium secondary button
<SecureConnectButton variant="secondary" />

// Small compact button
<SecureConnectButton variant="compact" />
```

## 🎨 Styling

Buttons use Tailwind classes and adapt to dark mode automatically:
- `variant="hero"` - Green background, dark text
- `variant="secondary"` - Dark background, green border
- `variant="compact"` - Small, minimal style

## 🔐 Auth Methods

| Method | Icon | Description |
|--------|------|-------------|
| `wallet` | 🔐 | MetaMask, Coinbase, WalletConnect |
| `email` | 📧 | Magic link sent to email |
| `otp` | 🔢 | 6-digit verification code |
| `social` | 🌐 | Google OAuth |

## 📊 useAuth() Hook

```tsx
const {
  isAuthenticated,  // boolean - Is user logged in?
  account,          // string | null - User account
  method,           // AuthMethod | null - How they logged in
  isLoading,        // boolean - Loading state
  login,            // Function - Manual login
  logout,           // Function - Sign out
} = useAuth();
```

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Wallet won't connect | Check WalletConnect Project ID |
| Email not sending | Configure email service API |
| Google OAuth fails | Verify redirect URI |
| Session lost on reload | Check localStorage permissions |

## 📚 Full Documentation

- [AUTH_SETUP.md](./AUTH_SETUP.md) - Complete setup guide
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Migration from old system

## 🎯 Production Checklist

- [ ] Set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- [ ] Configure email service
- [ ] Set up Google OAuth
- [ ] Generate strong `SESSION_SECRET`
- [ ] Use HTTPS
- [ ] Add rate limiting
- [ ] Set up database for sessions
- [ ] Configure CORS
- [ ] Enable monitoring

## 💡 Tips

1. **Always wrap app with Web3Provider**
   ```tsx
   <Web3Provider>
     <App />
   </Web3Provider>
   ```

2. **Use useAuth() for state**
   Don't manage auth state manually

3. **Test all methods**
   Wallet, email, OTP, and Google

4. **Check method type**
   ```tsx
   if (method === 'wallet') {
     // account is 0x... address
   }
   ```

5. **Handle loading states**
   ```tsx
   if (isLoading) return <Spinner />;
   ```

## 🚨 Security Notes

- ✅ Never commit `.env` files
- ✅ Use environment-specific configs
- ✅ Rotate secrets regularly
- ✅ Monitor auth logs
- ✅ Implement rate limiting
- ✅ Use HTTPS in production
- ✅ Validate all inputs
- ✅ Set secure cookie flags

## 📞 Support

Need help? Check:
1. Browser console for errors
2. Server logs for API issues
3. [Troubleshooting guide](./AUTH_SETUP.md#troubleshooting)
4. GitHub issues

---

**Quick Links:**
- [Setup Guide](./AUTH_SETUP.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [WalletConnect Cloud](https://cloud.walletconnect.com)
- [Google Console](https://console.cloud.google.com)
