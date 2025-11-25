import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const hostname = request.headers.get('host') || 'localhost:5000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const replId = process.env.REPL_ID;

    if (!replId) {
      return NextResponse.json(
        { error: 'REPL_ID environment variable not set' },
        { status: 500 }
      );
    }

    // Redirect to Replit's OpenID Connect endpoint
    const redirectUri = `${protocol}://${hostname}/api/auth/callback`;
    const authUrl = new URL('https://replit.com/auth_with_replit_site');
    
    authUrl.searchParams.set('client_id', replId);
    authUrl.searchParams.set('scope', 'email profile openid');
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('provider', 'google');

    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate login' },
      { status: 500 }
    );
  }
}
