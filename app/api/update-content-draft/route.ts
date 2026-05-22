import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendSlackAlert } from '@/lib/slack';

const editableFields = ['hook', 'caption', 'script', 'thumbnail_text', 'cta', 'landing_page'] as const;

type EditableField = (typeof editableFields)[number];

function isAuthorized(request: Request) {
  const headerCode = request.headers.get('x-ui-access-code') ?? '';
  const expectedCode = process.env.UI_ACCESS_CODE;
  return Boolean(expectedCode && headerCode === expectedCode);
}

function parseTextArray(value: unknown): string[] | null {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return null;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const contentItemId = String(body.content_item_id ?? '').trim();

  if (!contentItemId) {
    return NextResponse.json({ error: 'Missing content_item_id' }, { status: 400 });
  }

  const updatePayload: Record<string, unknown> = {};

  for (const field of editableFields) {
    if (field in body) updatePayload[field as EditableField] = String(body[field] ?? '');
  }

  const seoKeywords = parseTextArray(body.seo_keywords);
  const hashtags = parseTextArray(body.hashtags);
  if (seoKeywords) updatePayload.seo_keywords = seoKeywords;
  if (hashtags) updatePayload.hashtags = hashtags;

  updatePayload.review_status = 'draft';
  updatePayload.xyla_ready = false;
  updatePayload.status = 'draft';

  const db = supabaseAdmin as any;

  const { data: existing, error: existingError } = await db
    .from('content_items')
    .select('id, review_status')
    .eq('id', contentItemId)
    .single();

  if (existingError) return NextResponse.json({ error: existingError.message }, { status: 500 });
  if (!existing) return NextResponse.json({ error: 'Content item not found' }, { status: 404 });

  if (!['draft', 'rejected'].includes(existing.review_status)) {
    return NextResponse.json({
      error: 'Only draft or rejected content can be edited here. Approved content must be returned to review first.'
    }, { status: 409 });
  }

  const { data: updated, error: updateError } = await db
    .from('content_items')
    .update(updatePayload)
    .eq('id', contentItemId)
    .in('review_status', ['draft', 'rejected'])
    .select('id, platform, content_type, hook, caption, cta, landing_page, review_status, xyla_ready, status')
    .single();

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  await sendSlackAlert({
    title: 'Content Draft Updated',
    message: 'A content draft was edited and kept in draft review mode. No Xyla handoff or publishing occurred.',
    level: 'info',
    fields: {
      content_item_id: contentItemId,
      review_status: updated.review_status,
      xyla_ready: updated.xyla_ready,
      publishing: 'not_performed',
      xyla_handoff: 'not_performed'
    }
  });

  return NextResponse.json({
    updated: true,
    item: updated,
    note: 'Draft updated only. No Xyla handoff or publishing occurred.'
  });
}
