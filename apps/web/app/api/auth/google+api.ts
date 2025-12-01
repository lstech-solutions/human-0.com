import { ExpoRequest, ExpoResponse } from 'expo-router/server';

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:8081/api/auth/google/callback';

export async function GET(req: ExpoRequest): Promise<ExpoResponse> {
  try {
    // Generate state for CSRF protection
    const state = Math.random().toString(36).substring(7);
    
    // Store state in session (in production, use proper session management)
    // For now, we'll pass it through the OAuth flow
    
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    googleAuthUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid email profile');
    googleAuthUrl.searchParams.set('state', state);
    googleAuthUrl.searchParams.set('access_type', 'offline');
    googleAuthUrl.searchParams.set('prompt', 'consent');

    // Redirect to Google OAuth
    return ExpoResponse.redirect(googleAuthUrl.toString());
  } catch (error) {
    console.error('Google OAuth error:', error);
    return ExpoResponse.json(
      { error: 'Failed to initiate Google login' },
      { status: 500 }
    );
  }
}
