import { NextRequest, NextResponse } from 'next/server';
import { fetchHistory } from '@/actions/fetch-history';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  let requestBody: { month: number; day: number; bypassCache?: boolean } | null = null;

  try {
    const body = await request.json();
    requestBody = body;

    const data = await fetchHistory({
      month: body.month,
      day: body.day,
      bypassCache: body.bypassCache,
    });

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    logger.error('API Error', {
      error: error instanceof Error ? error.message : String(error),
      message,
      month: requestBody?.month,
      day: requestBody?.day,
    });
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
