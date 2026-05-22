import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendSlackAlert } from '@/lib/slack';

function isAuthorized(request: Request) {
  const headerCode = request.headers.get('x-ui-access-code') ?? '';
  const expectedCode = process.env.UI_ACCESS_CODE;
  return Boolean(expectedCode && headerCode === expectedCode);
}

function mapFormatToContentType(format: string | null): string {
  const value = (format ?? '').toLowerCase().trim();
  if (value.includes('reel')) return 'short_form_video';
  if (value.includes('story')) return 'story';
  if (value.includes('carousel')) return 'carousel';
  if (value.includes('video')) return 'video';
  return value || 'social_post';
}

function defaultLandingPage(topic: string | null): string {
  const value = (topic ?? '').toLowerCase();
  if (value.includes('tool')) return '/free-tools';
  if (value.includes('training')) return '/training';
  if (value.includes('shopify') || value.includes('product')) return '/product-systems';
  return '/start-here';
}

function defaultCta(topic: string | null): string {
  const value = (topic ?? '').toLowerCase();
  if (value.includes('tool')) return 'Get the free tool';
  if (value.includes('training')) return 'Explore training';
  if (value.includes('product')) return 'Explore the product path';
  return 'Start here';
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const rowId = String(body.marketing_calendar_row_id ?? '').trim();

  if (!rowId) return NextResponse.json({ error: 'Missing marketing_calendar_row_id' }, { status: 400 });

  const db = supabaseAdmin as any;

  const { data: row, error: rowError } = await db
    .from('marketing_calendar_rows')
    .select('id, publish_date, format, post_contents, platform, media_link, additional_notes, content_item_id')
    .eq('id', rowId)
    .is('content_item_id', null)
    .single();

  if (rowError) return NextResponse.json({ error: rowError.message }, { status: 500 });
  if (!row) return NextResponse.json({ error: 'Waiting calendar row not found' }, { status: 404 });

  const topic = row.post_contents || row.additional_notes || `${row.format ?? 'Post'} for ${row.publish_date ?? 'scheduled date'}`;
  const contentType = mapFormatToContentType(row.format);
  const landingPage = defaultLandingPage(topic);
  const cta = defaultCta(topic);

  const { data: contentItem, error: contentError } = await db
    .from('content_items')
    .insert({
      platform: row.platform ?? 'instagram, facebook, tiktok',
      content_type: contentType,
      hook: `Draft hook for: ${topic}`,
      caption: `Draft caption for: ${topic}`,
      script: `Draft script for ${contentType}: ${topic}`,
      thumbnail_text: topic,
      cta,
      landing_page: landingPage,
      seo_keywords: [topic, 'epoxy', 'decorative concrete'],
      hashtags: ['#EpoxyWillChangeYourLife', '#Epoxy', '#Concrete'],
      risk_score: 0,
      review_status: 'draft',
      xyla_ready: false,
      scheduled_at: row.publish_date ? `${row.publish_date}T09:00:00-04:00` : null,
      status: 'draft'
    })
    .select('id')
    .single();

  if (contentError) return NextResponse.json({ error: contentError.message }, { status: 500 });

  const { error: linkError } = await db
    .from('marketing_calendar_rows')
    .update({ content_item_id: contentItem.id, updated_at: new Date().toISOString() })
    .eq('id', row.id)
    .is('content_item_id', null);

  if (linkError) return NextResponse.json({ error: linkError.message }, { status: 500 });

  const { data: reviewRow, error: reviewError } = await db
    .from('review_queue')
    .insert({
      content_item_id: contentItem.id,
      review_type: 'marketing_calendar_intake',
      risk_category: 'standard_review',
      reason: 'Draft content item created from marketing calendar row. Human review required before Xyla handoff.',
      owner: 'Jeremy',
      status: 'pending'
    })
    .select('id')
    .single();

  if (reviewError) return NextResponse.json({ error: reviewError.message }, { status: 500 });

  await sendSlackAlert({
    title: 'Marketing Calendar Draft Created',
    message: 'A marketing calendar row was converted into one draft content item and added to review queue. No publishing or Xyla handoff occurred.',
    level: 'info',
    fields: {
      calendar_row_id: row.id,
      content_item_id: contentItem.id,
      review_queue_id: reviewRow.id,
      publishing: 'not_performed',
      xyla_handoff: 'not_performed'
    }
  });

  return NextResponse.json({
    created: true,
    content_item_id: contentItem.id,
    review_queue_id: reviewRow.id,
    note: 'Draft created and sent to review queue only. No Xyla handoff or publishing occurred.'
  });
}
