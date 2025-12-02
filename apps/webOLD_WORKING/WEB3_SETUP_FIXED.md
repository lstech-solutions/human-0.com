# Web3 Setup - Fixed for Expo

## Problem
The `import.meta` error was caused by wagmi/viem being ESM-only packages that don't work well with Expo's Metro bundler. This was blocking the UI and causing slow loading.

## Solution
Implemented platform-specific components and dynamic loading:

### 1. Web3Provider (apps/web/providers/Web3Provider.tsx)
- Dynamically loads wagmi and react-query only on web platform
- Uses Promise-based imports to avoid blocking
- Gracefully falls back if web3 libraries fail to load
- Doesn't block app rendering while loading

### 2. AuthModal with Platform Extensions
- **AuthModal.tsx**: Fallback for native platforms (shows message)
- **AuthModal.web.tsx**: Full web3 implementation with wagmi hooks
- React Native automatically picks the `.web.tsx` version on web

### 3. Benefits
- ✅ No more `import.meta` errors
- ✅ Non-blocking UI - app loads immediately
- ✅ Web3 features only load when needed
- ✅ Works on both web and native platforms
- ✅ Cleaner separation of concerns

## Best Practices for Expo + Web3

1. **Use platform-specific files** (`.web.tsx`) for web-only features
2. **Dynamic imports** for heavy libraries like wagmi/viem
3. **Graceful fallbacks** when libraries aren't available
4. **Don't block rendering** - load async and show UI immediately

## Testing
- Web: Full wallet connection with MetaMask, Coinbase, WalletConnect
- Native: Shows appropriate message (can be extended later)
- No blocking or slow loading issues
