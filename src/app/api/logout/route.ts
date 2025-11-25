import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Clear all auth cookies and redirect to login
    const response = NextResponse.redirect(new URL('/en/login', request.url));
    
    // Clear cookies
    response.cookies.delete('user_username');
    response.cookies.delete('auth_code');
    response.cookies.delete('auth_state');
    response.cookies.delete('replit_auth');
    response.cookies.delete('replit_session');
    response.cookies.delete('session');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Failed to logout' },
      { status: 500 }
    );
  }
}
