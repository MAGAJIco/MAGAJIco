
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const dynamic = 'force-dynamic';
export const revalidate = 30;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const source = searchParams.get('source') || 'espn';
    
    const endpoint = source === 'espn' ? '/api/espn/nfl' : '/api/nfl';
    const backendUrl = `${BACKEND_URL}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(backendUrl, {
      headers: { 
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      signal: controller.signal,
      next: { revalidate: 30 }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  } catch (error) {
    console.error('NFL API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch NFL data', 
        matches: [],
        timestamp: new Date().toISOString()
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
}
