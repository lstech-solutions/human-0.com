# Mock Authentication APIs

This directory contains mock authentication APIs that prevent the app from crashing during development.

## Fixed Issues

### 1. Server Runtime Errors
The original APIs were using `ExpoResponse.json()` which was undefined and causing server errors:
```
Cannot read properties of undefined (reading 'json')
```

### 2. TypeScript Lint Errors
The original code was using `ExpoResponse` as a value (constructor) when it's only a type:
```
'ExpoResponse' only refers to a type, but is being used as a value here.
```

## Solutions Applied

### 1. Response Method Fix
- **Before**: `ExpoResponse.json()` (undefined)
- **After**: `new Response(JSON.stringify(data), options)` (standard Web API)

### 2. TypeScript Fix
- **Before**: `Promise<ExpoResponse>` and `ExpoResponse.redirect()`
- **After**: `Promise<Response>` and `Response.redirect()`

## Mock APIs

### 1. Google OAuth (`/api/auth/google`)
- **Mock Behavior**: Redirects to mock callback with test code
- **Purpose**: Prevents OAuth initialization errors
- **Response**: Redirects to `/api/auth/google/callback?code=mock_code&state=random`

### 2. Google OAuth Callback (`/api/auth/google/callback`)
- **Mock Behavior**: Returns mock user data and creates session
- **Purpose**: Handles OAuth callback without real Google integration
- **Response**: Redirects to home with session token and mock email

### 3. Magic Link (`/api/auth/magic-link`)
- **Mock Behavior**: Generates mock magic link and OTP
- **Purpose**: Allows email-based authentication testing
- **Response**: Returns success with mock OTP for testing

### 4. Verify OTP (`/api/auth/verify-otp`)
- **Mock Behavior**: Validates mock OTP and creates session
- **Purpose**: Complete email authentication flow
- **Response**: Returns session token on successful verification

## Usage

These APIs work with the existing authentication flow:
1. User enters email → Magic link API generates mock OTP
2. User enters OTP → Verify OTP API validates and creates session
3. User is redirected to authenticated layout

## Technical Details

### Response Pattern
```typescript
// For JSON responses
return new Response(
  JSON.stringify({ success: true, data: '...' }),
  {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  }
);

// For redirects
return Response.redirect('/target-url');
```

### Type Safety
```typescript
// Correct return type
export async function POST(req: ExpoRequest): Promise<Response> {
  // Implementation
}
```

## Next Steps

To implement real authentication:
1. Replace mock data with actual Google OAuth configuration
2. Add real email sending service
3. Replace in-memory token store with database
4. Add proper session management

## Security Notes

- These are **development-only** mock APIs
- Do not use in production
- Tokens are stored in memory and reset on server restart
- No real email sending or OAuth integration
