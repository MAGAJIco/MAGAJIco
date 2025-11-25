import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Clear auth session and redirect home
  const response = NextResponse.redirect(new URL('/', request.url));
  
  // Clear all auth-related cookies
  response.cookies.delete('replit_auth');
  response.cookies.delete('replit_session');
  response.cookies.delete('session');
  
  return response;
}
