import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'metrics_sync_ready' });
}
