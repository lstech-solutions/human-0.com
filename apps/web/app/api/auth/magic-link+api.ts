import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import crypto from 'crypto';

// Mock token store
const magicLinkTokens = new Map<string, { email: string; expiresAt: number }>();

export async function POST(req: ExpoRequest): Promise<Response> {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Store token
    magicLinkTokens.set(token, { email, expiresAt });

    // Generate magic link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8081';
    const magicLink = `${baseUrl}/api/auth/verify?token=${token}`;

    // Mock email sending
    console.log('Magic link for', email, ':', magicLink);
    
    // Generate OTP for alternative verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    magicLinkTokens.set(`otp:${email}`, { email, expiresAt });
    magicLinkTokens.set(`otp:${email}:code`, { email: otp, expiresAt });

    console.log('OTP for', email, ':', otp);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Magic link sent to your email',
        otp: otp, // Include OTP in mock for testing
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Magic link error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send magic link' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
