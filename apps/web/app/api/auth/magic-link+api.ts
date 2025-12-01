import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import crypto from 'crypto';

// In production, use a proper database (PostgreSQL, MongoDB, etc.)
// This is a simple in-memory store for demonstration
const magicLinkTokens = new Map<string, { email: string; expiresAt: number }>();

export async function POST(req: ExpoRequest): Promise<ExpoResponse> {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return ExpoResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Store token (in production, use a database with TTL)
    magicLinkTokens.set(token, { email, expiresAt });

    // Generate magic link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8081';
    const magicLink = `${baseUrl}/api/auth/verify?token=${token}`;

    // In production, send email using a service like SendGrid, Resend, or AWS SES
    console.log('Magic link for', email, ':', magicLink);
    
    // TODO: Send email
    // await sendEmail({
    //   to: email,
    //   subject: 'Your Magic Link',
    //   html: `<a href="${magicLink}">Click here to sign in</a>`,
    // });

    // Also generate OTP for alternative verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    magicLinkTokens.set(`otp:${email}`, { email, expiresAt });
    magicLinkTokens.set(`otp:${email}:code`, { email: otp, expiresAt });

    console.log('OTP for', email, ':', otp);

    return ExpoResponse.json({
      success: true,
      message: 'Magic link sent to your email',
    });
  } catch (error) {
    console.error('Magic link error:', error);
    return ExpoResponse.json(
      { error: 'Failed to send magic link' },
      { status: 500 }
    );
  }
}
