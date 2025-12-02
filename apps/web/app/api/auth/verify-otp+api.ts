import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import crypto from 'crypto';

// Mock token store
const magicLinkTokens = new Map<string, { email: string; expiresAt: number }>();

export async function POST(req: ExpoRequest): Promise<Response> {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return new Response(
        JSON.stringify({ error: 'Email and OTP are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if OTP exists and is valid
    const otpData = magicLinkTokens.get(`otp:${email}:code`);
    
    if (!otpData) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired verification code' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (Date.now() > otpData.expiresAt) {
      magicLinkTokens.delete(`otp:${email}:code`);
      magicLinkTokens.delete(`otp:${email}`);
      return new Response(
        JSON.stringify({ error: 'Verification code has expired' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (otpData.email !== otp) {
      return new Response(
        JSON.stringify({ error: 'Invalid verification code' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // OTP is valid, clean up
    magicLinkTokens.delete(`otp:${email}:code`);
    magicLinkTokens.delete(`otp:${email}`);

    // Generate session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionExpiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

    // Store session
    magicLinkTokens.set(`session:${sessionToken}`, {
      email,
      expiresAt: sessionExpiresAt,
    });

    return new Response(
      JSON.stringify({
        success: true,
        userId: email,
        sessionToken,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('OTP verification error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to verify code' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
