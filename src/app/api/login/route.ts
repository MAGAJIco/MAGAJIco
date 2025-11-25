import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Redirect to Replit's login endpoint
  // This will be handled by Replit's authentication system
  const redirectUrl = `${request.nextUrl.origin}/auth/login`;
  return NextResponse.redirect(redirectUrl);
}
