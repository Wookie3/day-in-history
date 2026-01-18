import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      wikipedia: 'ok',
      cache: 'ok',
    },
    uptime: process.uptime(),
  };

  try {
    const wikiResponse = await fetch(`${env.WIKIPEDIA_API_URL}/`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    });
    health.services.wikipedia = wikiResponse.ok ? 'ok' : 'degraded';
  } catch {
    health.services.wikipedia = 'unhealthy';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  return NextResponse.json(health, { status: statusCode });
}
