
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const dynamic = 'force-dynamic';
export const revalidate = 30;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const source = searchParams.get('source') || 'espn';
    
    const endpoint = source === 'espn' ? '/api/espn/mlb' : '/api/mlb';
    const backendUrl = `${BACKEND_URL}${endpoint}`;
    
    const response = await fetch(backendUrl, {
      headers: { 'Accept': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('MLB API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch MLB data', matches: [] },
      { status: 500 }
    );
  }
}
