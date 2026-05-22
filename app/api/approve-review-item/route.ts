import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendSlackAlert } from '@/lib/slack';

const SAFE_RISK_SCORE_MAX = 2;

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
  const reviewId = String(body.review_id ?? '').trim();
  const notes = String(body.notes ?? '').trim() || 'Approved from EWL command center.';

  if (!reviewId) return NextResponse.json({ error: 'Missing review_id' }, { status: 400 });

  const db = supabaseAdmin as any;

  const { data: review, error: reviewError } = await db
    .from('review_queue')
    .select(`
      id,
      content_item_id,
      status,
      review_type,
      risk_category,
      reason,
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
        scheduled_at
      )
    `)
    .eq('id', reviewId)
    .eq('status', 'pending')
    .single();

  if (reviewError) return NextResponse.json({ error: reviewError.message }, { status: 500 });
  if (!review) return NextResponse.json({ error: 'Pending review not found' }, { status: 404 });

  const content = Array.isArray(review.content_items) ? review.content_items[0] : review.content_items;
  const riskScore = Number(content?.risk_score ?? 999);
  const safeForXylaHandoff = riskScore <= SAFE_RISK_SCORE_MAX;
  const reviewedAt = new Date().toISOString();

  const { error: reviewUpdateError } = await db
    .from('review_queue')
    .update({
      status: 'approved',
      decision: 'approved',
      notes,
      reviewed_at: reviewedAt
    })
    .eq('id', reviewId)
    .eq('status', 'pending');

  if (reviewUpdateError) return NextResponse.json({ error: reviewUpdateError.message }, { status: 500 });

  const { error: contentUpdateError } = await db
    .from('content_items')
    .update({
      review_status: 'approved',
      xyla_ready: safeForXylaHandoff
    })
    .eq('id', review.content_item_id);

  if (contentUpdateError) return NextResponse.json({ error: contentUpdateError.message }, { status: 500 });

  let xylaQueueId: string | null = null;

  if (safeForXylaHandoff) {
    const { data: xylaRow, error: xylaError } = await db
      .from('xyla_queue')
      .insert({
        content_item_id: review.content_item_id,
        platform: content?.platform ?? null,
        post_type: content?.content_type ?? null,
        caption: content?.caption ?? null,
        cta: content?.cta ?? null,
        landing_page: content?.landing_page ?? null,
        handoff_status: 'ready',
        scheduled_at: content?.scheduled_at ?? null
      })
      .select('id')
      .single();

    if (xylaError) return NextResponse.json({ error: xylaError.message }, { status: 500 });
    xylaQueueId = xylaRow.id;
  }

  await sendSlackAlert({
    title: safeForXylaHandoff ? 'Review Approved: Xyla Handoff Ready' : 'Review Approved: Human Follow-Up Required',
    message: safeForXylaHandoff
      ? 'A review item was approved and placed into the internal Xyla handoff queue. No publishing occurred.'
      : 'A review item was approved, but risk score requires human follow-up before Xyla handoff.',
    level: safeForXylaHandoff ? 'success' : 'warning',
    fields: {
      review_id: reviewId,
      content_item_id: review.content_item_id,
      risk_score: riskScore,
      xyla_queue_id: xylaQueueId,
      publishing: 'not_performed'
    }
  });

  return NextResponse.json({
    approved: true,
    safe_for_xyla_handoff: safeForXylaHandoff,
    xyla_queue_id: xylaQueueId,
    note: 'Internal approval only. No Xyla publishing occurred.'
  });
}
