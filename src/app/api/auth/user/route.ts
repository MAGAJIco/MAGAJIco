import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check for Replit Auth headers that are set by Replit's proxy
    // These headers are automatically set when a user is authenticated via Replit Auth
    const userId = request.headers.get('x-user-id');
    const email = request.headers.get('x-user-email');
    const firstName = request.headers.get('x-user-first-name');
    const lastName = request.headers.get('x-user-last-name');
    const profileImageUrl = request.headers.get('x-user-profile-image');

    // Check for username in cookies
    const usernameCookie = request.cookies.get('user_username')?.value;

    if (!userId && !email) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Return authenticated user info
    return NextResponse.json({
      id: userId,
      email,
      firstName,
      lastName,
      profileImageUrl,
      username: usernameCookie,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
