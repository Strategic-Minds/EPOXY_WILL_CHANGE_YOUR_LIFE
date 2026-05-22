import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ status: 'approve_content_route_ready' });
}
