
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const dynamic = 'force-dynamic';
export const revalidate = 30;

export async function GET(request: NextRequest) {
  try {
    const backendUrl = `${BACKEND_URL}/api/soccer`;
    
    const response = await fetch(backendUrl, {
      headers: { 'Accept': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Soccer API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Soccer data', matches: [] },
      { status: 500 }
    );
  }
}
