import { NextRequest, NextResponse } from 'next/server';
import { fetchHistory } from '@/actions/fetch-history';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { month, day, bypassCache } = body;

    const data = await fetchHistory({ month, day, bypassCache });

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    const message = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
