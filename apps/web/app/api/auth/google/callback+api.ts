import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import crypto from 'crypto';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:8081/api/auth/google/callback';

// In production, use a proper database
const sessions = new Map<string, { email: string; expiresAt: number }>();

export async function GET(req: ExpoRequest): Promise<ExpoResponse> {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error) {
      return ExpoResponse.redirect(`/?error=${error}`);
    }

    if (!code) {
      return ExpoResponse.redirect('/?error=no_code');
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    const tokens = await tokenResponse.json();

    // Get user info
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      throw new Error('Failed to get user info');
    }

    const userInfo = await userInfoResponse.json();

    // Create session
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionExpiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

    sessions.set(`session:${sessionToken}`, {
      email: userInfo.email,
      expiresAt: sessionExpiresAt,
    });

    // Redirect to app with session token
    return ExpoResponse.redirect(`/?session=${sessionToken}&email=${userInfo.email}`);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return ExpoResponse.redirect('/?error=auth_failed');
  }
}
