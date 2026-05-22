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
    .from('marketing_calendar_rows')
    .select('id, sheet_id, sheet_tab, row_number, publish_date, day_of_week, format, post_contents, status, platform, media_link, additional_notes, content_item_id, created_at, updated_at')
    .is('content_item_id', null)
    .order('publish_date', { ascending: true })
    .order('row_number', { ascending: true })
    .limit(25);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    checked_at: new Date().toISOString(),
    timezone: 'America/New_York',
    count: data?.length ?? 0,
    rows: data ?? []
  });
}
