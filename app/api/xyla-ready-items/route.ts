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
    .from('xyla_queue')
    .select(`
      id,
      content_item_id,
      platform,
      post_type,
      caption,
      asset_url,
      cta,
      landing_page,
      handoff_status,
      scheduled_at,
      created_at,
      content_items (
        id,
        platform,
        content_type,
        hook,
        caption,
        cta,
        landing_page,
        risk_score,
        review_status,
        xyla_ready,
        status,
        scheduled_at
      )
    `)
    .eq('handoff_status', 'ready')
    .order('created_at', { ascending: true })
    .limit(25);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const items = (data ?? []).filter((item: any) => {
    const content = Array.isArray(item.content_items) ? item.content_items[0] : item.content_items;
    return content?.review_status === 'approved' && content?.xyla_ready === true;
  });

  return NextResponse.json({
    checked_at: new Date().toISOString(),
    timezone: 'America/New_York',
    count: items.length,
    items
  });
}
