import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    // Validate username
    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { message: 'Username is required' },
        { status: 400 }
      );
    }

    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
      return NextResponse.json(
        { message: 'Username must be between 3 and 30 characters' },
        { status: 400 }
      );
    }

    // Check username format (alphanumeric and underscore only)
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      return NextResponse.json(
        { message: 'Username can only contain letters, numbers, and underscores' },
        { status: 400 }
      );
    }

    // Get user from headers (set by Replit Auth reverse proxy)
    const userId = request.headers.get('x-user-id');
    const email = request.headers.get('x-user-email');

    if (!userId && !email) {
      return NextResponse.json(
        { message: 'User not authenticated' },
        { status: 401 }
      );
    }

    // In a production app, you would:
    // 1. Query database to check if username is taken
    // 2. Update user record with username
    // 3. Return success
    
    // For now, we just return success and the client can store it in localStorage or cookies
    return NextResponse.json(
      { 
        success: true,
        username: trimmedUsername,
        message: 'Username set successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error setting username:', error);
    return NextResponse.json(
      { message: 'Failed to set username' },
      { status: 500 }
    );
  }
}
