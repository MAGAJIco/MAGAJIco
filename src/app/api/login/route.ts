import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Redirect to Replit's login endpoint for Google authentication
  // After Replit Auth completes, it sets headers on the request
  // Then we'll be redirected back here by the middleware
  const redirectUrl = `${request.nextUrl.origin}/auth/login`;
  return NextResponse.redirect(redirectUrl);
}
