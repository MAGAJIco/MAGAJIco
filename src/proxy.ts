import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest): Promise<NextResponse> {
  return NextResponse.next();
}
