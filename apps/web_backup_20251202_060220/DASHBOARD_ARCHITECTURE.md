# Dashboard Architecture

## Overview

The app uses a **hybrid architecture**:
- **Public pages** (canvas, landing, docs) → SSR/Static
- **Dashboard** → Client-side SPA with authentication

## Structure

```
apps/web/app/
├── index.tsx              # Landing page (public, SSR)
├── canvas.tsx             # Canvas page (public, SSR)
├── documentation.tsx      # Docs (public, SSR)
└── dashboard/
    ├── _layout.tsx        # Auth guard (client-only)
    ├── index.tsx          # Dashboard home
    └── identity.tsx       # Identity management
```

## Why This Approach?

### ✅ Benefits

1. **No SSR Issues**
   - Dashboard is pure client-side
   - Can use wagmi hooks freely
   - No hydration mismatches

2. **Better Performance**
   - Public pages are fast (SSR/static)
   - Auth code only loads when needed
   - Smaller initial bundle

3. **Cleaner Code**
   - No SSR guards everywhere
   - Simpler auth logic
   - Clear separation of concerns

4. **Better UX**
   - Fast public pages
   - Interactive dashboard
   - Smooth transitions

### ❌ Alternatives (Why Not)

**Option 1: Auth on every page**
- SSR issues everywhere
- Complex guards needed
- Slower public pages
- Larger bundles

**Option 2: Full SPA**
- Worse SEO
- Slower initial load
- No static optimization

## Usage

### Public Pages (No Auth)

```tsx
// apps/web/app/canvas.tsx
export default function CanvasScreen() {
  // No auth needed
  return <Canvas />;
}
```

### Dashboard (Auth Required)

```tsx
// apps/web/app/dashboard/index.tsx
export default function DashboardScreen() {
  // Auth checked by _layout.tsx
  // Safe to use wagmi hooks here
  const { address } = useAccount();
  return <Dashboard />;
}
```

### Landing Page (Optional Auth)

```tsx
// apps/web/app/index.tsx
import { SimpleAuthButton } from '../components/SimpleAuthButton';

export default function HomeScreen() {
  return (
    <View>
      <Text>Welcome</Text>
      <SimpleAuthButton variant="hero" />
    </View>
  );
}
```

## Authentication Flow

```
1. User visits landing page
   ↓
2. Clicks "Get Started"
   ↓
3. AuthModal opens (client-side)
   ↓
4. User authenticates (wallet/email/Google)
   ↓
5. Redirect to /dashboard
   ↓
6. _layout.tsx checks auth
   ↓
7. Dashboard loads (client-side)
```

## Components

### SimpleAuthButton
- Lightweight button for public pages
- Loads AuthModal dynamically
- Redirects to dashboard on success

### AuthModal
- Full authentication modal
- Wallet, email, OTP, Google
- Client-side only

### Dashboard Layout
- Auth guard
- Redirects to home if not authenticated
- Client-side only

## File Organization

```
components/
├── SimpleAuthButton.tsx    # Public pages
├── AuthModal.tsx           # Auth modal
└── SecureConnectButton.tsx # Dashboard (if needed)

app/
├── index.tsx               # Landing (public)
├── canvas.tsx              # Canvas (public)
└── dashboard/
    ├── _layout.tsx         # Auth guard
    ├── index.tsx           # Dashboard home
    └── identity.tsx        # Sub-pages

hooks/
└── useAuth.ts              # Auth state management
```

## Best Practices

### ✅ Do

- Use SimpleAuthButton on public pages
- Keep dashboard client-side only
- Check auth in dashboard/_layout.tsx
- Use wagmi hooks freely in dashboard
- Store session in localStorage

### ❌ Don't

- Don't add auth to public pages
- Don't use wagmi hooks in SSR pages
- Don't check auth on every page
- Don't load auth code on public pages
- Don't use complex SSR guards

## Migration Path

### Phase 1: Current (Done)
- ✅ Public pages work (SSR)
- ✅ Auth system created
- ✅ Dashboard structure ready

### Phase 2: Move Auth Features
```bash
# Move these to dashboard:
- Identity management → /dashboard/identity
- NFT viewing → /dashboard/nfts
- Impact tracking → /dashboard/impact
- Profile → /dashboard/profile
```

### Phase 3: Polish
- Add loading states
- Add error boundaries
- Add analytics
- Add onboarding flow

## Example: Moving Identity to Dashboard

**Before:**
```tsx
// apps/web/app/identity.tsx (public page with auth)
export default function IdentityScreen() {
  const { isAuthenticated } = useAuth(); // SSR issue!
  if (!isAuthenticated) return <Login />;
  return <Identity />;
}
```

**After:**
```tsx
// apps/web/app/dashboard/identity.tsx (protected)
export default function DashboardIdentityScreen() {
  // Auth checked by _layout.tsx
  // No SSR issues!
  return <Identity />;
}
```

## Testing

### Test Public Pages
```bash
# Should work without auth
curl http://localhost:8081/
curl http://localhost:8081/canvas
curl http://localhost:8081/documentation
```

### Test Dashboard
```bash
# Should redirect to home
curl http://localhost:8081/dashboard

# Should work after auth
# 1. Sign in via UI
# 2. Visit /dashboard
# 3. Should see dashboard
```

## Performance

### Public Pages
- Fast SSR/static rendering
- No auth code loaded
- Small bundle size
- Good SEO

### Dashboard
- Client-side only
- Auth code loaded on demand
- Interactive and fast
- No SEO needed (private)

## Security

### Public Pages
- No sensitive data
- No auth required
- Can be cached

### Dashboard
- Auth required
- Session checked
- Private data
- No caching

## Deployment

### Environment Variables
```bash
# Required for dashboard
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=xxx
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
SENDGRID_API_KEY=xxx
```

### Build
```bash
# Public pages → static
# Dashboard → client-side bundle
npm run build
```

## Summary

**Architecture:** Hybrid (SSR public + SPA dashboard)
**Auth:** Client-side only in dashboard
**Benefits:** Fast, clean, no SSR issues
**Trade-offs:** Dashboard not SEO-friendly (but doesn't need to be)

This is the **best approach** for your use case! 🎉
