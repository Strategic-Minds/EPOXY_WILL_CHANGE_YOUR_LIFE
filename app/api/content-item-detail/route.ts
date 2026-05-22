import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

function isAuthorized(request: Request) {
  const headerCode = request.headers.get('x-ui-access-code') ?? '';
  const expectedCode = process.env.UI_ACCESS_CODE;
  return Boolean(expectedCode && headerCode === expectedCode);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const contentItemId = String(searchParams.get('content_item_id') ?? '').trim();

  if (!contentItemId) {
    return NextResponse.json({ error: 'Missing content_item_id' }, { status: 400 });
  }

  const db = supabaseAdmin as any;

  const { data, error } = await db
    .from('content_items')
    .select('id, platform, content_type, hook, caption, script, thumbnail_text, cta, landing_page, seo_keywords, hashtags, risk_score, review_status, xyla_ready, scheduled_at, published_url, status, created_at')
    .eq('id', contentItemId)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Content item not found' }, { status: 404 });

  return NextResponse.json({
    checked_at: new Date().toISOString(),
    timezone: 'America/New_York',
    item: data
  });
}
