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
  const reviewId = String(body.review_id ?? '').trim();
  const notes = String(body.notes ?? '').trim() || 'Rejected from EWL command center.';

  if (!reviewId) return NextResponse.json({ error: 'Missing review_id' }, { status: 400 });

  const db = supabaseAdmin as any;

  const { data: review, error: reviewError } = await db
    .from('review_queue')
    .select('id, content_item_id, status, review_type, risk_category, reason')
    .eq('id', reviewId)
    .eq('status', 'pending')
    .single();

  if (reviewError) return NextResponse.json({ error: reviewError.message }, { status: 500 });
  if (!review) return NextResponse.json({ error: 'Pending review not found' }, { status: 404 });

  const reviewedAt = new Date().toISOString();

  const { error: reviewUpdateError } = await db
    .from('review_queue')
    .update({
      status: 'rejected',
      decision: 'rejected',
      notes,
      reviewed_at: reviewedAt
    })
    .eq('id', reviewId)
    .eq('status', 'pending');

  if (reviewUpdateError) return NextResponse.json({ error: reviewUpdateError.message }, { status: 500 });

  const { error: contentUpdateError } = await db
    .from('content_items')
    .update({
      review_status: 'rejected',
      xyla_ready: false
    })
    .eq('id', review.content_item_id);

  if (contentUpdateError) return NextResponse.json({ error: contentUpdateError.message }, { status: 500 });

  await sendSlackAlert({
    title: 'Review Rejected',
    message: 'A review item was rejected inside the EWL command center. No publishing occurred.',
    level: 'warning',
    fields: {
      review_id: reviewId,
      content_item_id: review.content_item_id,
      review_type: review.review_type,
      risk_category: review.risk_category,
      publishing: 'not_performed'
    }
  });

  return NextResponse.json({
    rejected: true,
    content_item_id: review.content_item_id,
    note: 'Internal rejection only. No publishing occurred.'
  });
}
