import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendSlackAlert } from '@/lib/slack';

function isAuthorized(request: Request) {
  const headerCode = request.headers.get('x-ui-access-code') ?? '';
  const expectedCode = process.env.UI_ACCESS_CODE;
  return Boolean(expectedCode && headerCode === expectedCode);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const handoffId = String(body.handoff_id ?? '').trim();

  if (!handoffId) {
    return NextResponse.json({ error: 'Missing handoff_id' }, { status: 400 });
  }

  const db = supabaseAdmin as any;

  const { data: existing, error: existingError } = await db
    .from('xyla_queue')
    .select('id, content_item_id, platform, post_type, caption, handoff_status')
    .eq('id', handoffId)
    .eq('handoff_status', 'ready')
    .single();

  if (existingError) return NextResponse.json({ error: existingError.message }, { status: 500 });
  if (!existing) return NextResponse.json({ error: 'Ready handoff not found' }, { status: 404 });

  const { data: updated, error: updateError } = await db
    .from('xyla_queue')
    .update({ handoff_status: 'reviewed' })
    .eq('id', handoffId)
    .eq('handoff_status', 'ready')
    .select('id, content_item_id, platform, post_type, handoff_status')
    .single();

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  await sendSlackAlert({
    title: 'Xyla Handoff Reviewed',
    message: 'A Xyla-ready item was marked internally reviewed. No Xyla publishing was performed.',
    level: 'info',
    fields: {
      handoff_id: updated.id,
      content_item_id: updated.content_item_id,
      platform: updated.platform,
      post_type: updated.post_type,
      handoff_status: updated.handoff_status
    }
  });

  return NextResponse.json({
    reviewed: true,
    item: updated,
    note: 'Internal handoff status updated only. No Xyla publishing occurred.'
  });
}
