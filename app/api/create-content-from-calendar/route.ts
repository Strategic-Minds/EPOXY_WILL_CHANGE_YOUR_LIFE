import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const primaryTimezone = 'America/New_York';

type CalendarRow = {
  id: string;
  platform: string | null;
  post_contents: string | null;
  format: string | null;
  publish_date: string | null;
};

function mapFormatToContentType(format: string | null): string {
  const value = (format ?? '').toLowerCase().trim();
  if (value.includes('reel')) return 'short_form_video';
  if (value.includes('story')) return 'story';
  if (value.includes('carousel')) return 'carousel';
  return value || 'social_post';
}

function splitPlatforms(platform: string | null): string[] {
  if (!platform) return ['instagram', 'facebook', 'tiktok'];
  return platform
    .split('+')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function defaultLandingPage(topic: string | null): string {
  const value = (topic ?? '').toLowerCase();
  if (value.includes('tool')) return '/free-tools';
  if (value.includes('polyaspartic')) return '/product-systems';
  if (value.includes('solid color')) return '/product-systems';
  if (value.includes('training')) return '/training';
  return '/start-here';
}

function defaultCta(topic: string | null): string {
  const value = (topic ?? '').toLowerCase();
  if (value.includes('tool')) return 'Get the free tools';
  if (value.includes('polyaspartic')) return 'Explore the system path';
  if (value.includes('solid color')) return 'Learn the system';
  return 'Start here';
}

export async function POST(request: Request) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = supabaseAdmin as any;
  const body = await request.json().catch(() => ({}));
  const limit = Number(body.limit ?? 25);

  const { data, error: rowError } = await db
    .from('marketing_calendar_rows')
    .select('*')
    .is('content_item_id', null)
    .order('publish_date', { ascending: true })
    .limit(limit);

  if (rowError) return NextResponse.json({ error: rowError.message }, { status: 500 });

  const rows = (data ?? []) as CalendarRow[];
  const created: Array<{ calendar_row_id: string; content_item_id: string }> = [];

  for (const row of rows) {
    const platforms = splitPlatforms(row.platform);
    const platform = platforms.join(', ');
    const topic = row.post_contents || `${row.format ?? 'Post'} for ${row.publish_date ?? 'scheduled date'}`;
    const contentType = mapFormatToContentType(row.format);
    const landingPage = defaultLandingPage(topic);
    const cta = defaultCta(topic);

    const { data: contentItem, error: contentError } = await db
      .from('content_items')
      .insert({
        platform,
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

    await db
      .from('marketing_calendar_rows')
      .update({ content_item_id: contentItem.id, updated_at: new Date().toISOString() })
      .eq('id', row.id);

    await db.from('review_queue').insert({
      content_item_id: contentItem.id,
      review_type: 'content_calendar_review',
      risk_category: 'standard_review',
      reason: 'Generated from marketing calendar row. Review before social scheduling.',
      owner: 'Jeremy',
      status: 'pending'
    });

    created.push({ calendar_row_id: row.id, content_item_id: contentItem.id });
  }

  return NextResponse.json({ timezone: primaryTimezone, created_count: created.length, created });
}
