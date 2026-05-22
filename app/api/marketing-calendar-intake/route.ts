import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

function parseDate(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const parsed = new Date(`${value} 12:00:00 GMT-0400`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

export async function POST(request: Request) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const rows = Array.isArray(body.rows) ? body.rows : [];
  const sheetId = String(body.sheet_id ?? '');
  const sheetTab = String(body.sheet_tab ?? 'June_2026');

  if (!sheetId || rows.length === 0) {
    return NextResponse.json({ error: 'Missing sheet_id or rows' }, { status: 400 });
  }

  const calendarRows = rows.map((row: any) => ({
    sheet_id: sheetId,
    sheet_tab: sheetTab,
    row_number: Number(row.row_number),
    publish_date: parseDate(row.publish_date),
    day_of_week: row.day_of_week ?? null,
    format: row.format ?? null,
    post_contents: row.post_contents ?? null,
    status: row.status ?? 'draft',
    platform: row.platform ?? null,
    media_link: row.media_link ?? null,
    additional_notes: row.additional_notes ?? null,
    updated_at: new Date().toISOString()
  }));

  const { data, error } = await supabaseAdmin
    .from('marketing_calendar_rows')
    .upsert(calendarRows, { onConflict: 'sheet_id,sheet_tab,row_number' })
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ imported: data?.length ?? 0, timezone: 'America/New_York' });
}
