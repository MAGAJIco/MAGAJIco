import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      console.error('Auth error:', errorDescription || error);
      return NextResponse.redirect(new URL('/en/login?error=' + error, request.url));
    }

    if (!code) {
      console.error('No authorization code received');
      return NextResponse.redirect(new URL('/en/login?error=no_code', request.url));
    }

    // Store the auth code and state for later use
    // In a production app, you'd exchange this code for tokens
    const response = NextResponse.redirect(new URL('/en/login', request.url));
    
    // Store the code in a secure, httpOnly cookie
    response.cookies.set('auth_code', code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600, // 1 hour
    });

    if (state) {
      response.cookies.set('auth_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600,
      });
    }

    return response;
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(new URL('/en/login?error=callback_failed', request.url));
  }
}
