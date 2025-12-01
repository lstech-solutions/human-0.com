import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import crypto from 'crypto';

// In production, use a proper database
const magicLinkTokens = new Map<string, { email: string; expiresAt: number }>();

export async function POST(req: ExpoRequest): Promise<ExpoResponse> {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return ExpoResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Check if OTP exists and is valid
    const otpData = magicLinkTokens.get(`otp:${email}:code`);
    
    if (!otpData) {
      return ExpoResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 401 }
      );
    }

    if (Date.now() > otpData.expiresAt) {
      magicLinkTokens.delete(`otp:${email}:code`);
      magicLinkTokens.delete(`otp:${email}`);
      return ExpoResponse.json(
        { error: 'Verification code has expired' },
        { status: 401 }
      );
    }

    if (otpData.email !== otp) {
      return ExpoResponse.json(
        { error: 'Invalid verification code' },
        { status: 401 }
      );
    }

    // OTP is valid, clean up
    magicLinkTokens.delete(`otp:${email}:code`);
    magicLinkTokens.delete(`otp:${email}`);

    // Generate session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionExpiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

    // Store session (in production, use a database)
    magicLinkTokens.set(`session:${sessionToken}`, {
      email,
      expiresAt: sessionExpiresAt,
    });

    return ExpoResponse.json({
      success: true,
      userId: email, // In production, return actual user ID
      sessionToken,
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return ExpoResponse.json(
      { error: 'Failed to verify code' },
      { status: 500 }
    );
  }
}
