import { NextRequest, NextResponse } from 'next/server';
import { fetchHistory } from '@/actions/fetch-history';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { month, day, bypassCache } = body;

    const data = await fetchHistory({ month, day, bypassCache });

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    logger.error('API Error', {
      error: error instanceof Error ? error.message : String(error),
      message,
      month: body.month,
      day: body.day,
    });
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
