
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const source = searchParams.get('source') || 'espn';
    
    const endpoint = source === 'espn' ? '/api/espn/nfl' : '/api/nfl';
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
    console.error('NFL API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NFL data', matches: [] },
      { status: 500 }
    );
  }
}
