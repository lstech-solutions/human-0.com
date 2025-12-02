import { ExpoRequest, ExpoResponse } from 'expo-router/server';

export async function GET(req: ExpoRequest): Promise<Response> {
  try {
    // Mock Google OAuth - redirect to a mock callback
    const state = Math.random().toString(36).substring(7);
    const mockCallbackUrl = `http://localhost:8081/api/auth/google/callback?code=mock_code&state=${state}`;
    
    return Response.redirect(mockCallbackUrl);
  } catch (error) {
    console.error('Google OAuth error:', error);
    // Return a simple Response object as fallback
    return new Response(
      JSON.stringify({ error: 'Failed to initiate Google login' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
