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

  const db = supabaseAdmin as any;

  const { data, error } = await db
    .from('review_queue')
    .select(`
      id,
      content_item_id,
      review_type,
      risk_category,
      reason,
      owner,
      decision,
      notes,
      reviewed_at,
      status,
      created_at,
      content_items (
        id,
        platform,
        content_type,
        hook,
        caption,
        script,
        thumbnail_text,
        cta,
        landing_page,
        seo_keywords,
        hashtags,
        risk_score,
        review_status,
        xyla_ready,
        scheduled_at,
        status,
        created_at
      )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(25);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    checked_at: new Date().toISOString(),
    timezone: 'America/New_York',
    count: data?.length ?? 0,
    items: data ?? []
  });
}
