import { NextRequest, NextResponse } from 'next/server';

// This endpoint returns the authenticated user info
// In production, this would fetch from the database using session info
export async function GET(request: NextRequest) {
  try {
    // For now, check if there's an X-User-ID header (set by reverse proxy after Replit Auth)
    const userId = request.headers.get('x-user-id');
    const email = request.headers.get('x-user-email');

    if (!userId && !email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Return user data
    return NextResponse.json({
      id: userId || 'user_' + Math.random().toString(36).substr(2, 9),
      email: email || undefined,
      firstName: request.headers.get('x-user-first-name') || undefined,
      lastName: request.headers.get('x-user-last-name') || undefined,
      profileImageUrl: request.headers.get('x-user-profile-image') || undefined,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
