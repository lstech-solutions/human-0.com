import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import crypto from 'crypto';

// Mock session store
const sessions = new Map<string, { email: string; expiresAt: number }>();

export async function GET(req: ExpoRequest): Promise<Response> {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error) {
      return Response.redirect(`/?error=${error}`);
    }

    if (!code) {
      return Response.redirect('/?error=no_code');
    }

    // Mock user data for testing
    const mockUserInfo = {
      email: 'user@example.com',
      name: 'Test User',
      picture: 'https://via.placeholder.com/150'
    };

    // Create session
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionExpiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

    sessions.set(`session:${sessionToken}`, {
      email: mockUserInfo.email,
      expiresAt: sessionExpiresAt,
    });

    // Redirect to app with session token
    return Response.redirect(`/?session=${sessionToken}&email=${mockUserInfo.email}`);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return Response.redirect('/?error=auth_failed');
  }
}
