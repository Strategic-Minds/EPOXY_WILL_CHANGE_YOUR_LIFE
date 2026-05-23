import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

function authorized(request: Request) {
  const expected = process.env.UI_ACCESS_CODE;
  const received = request.headers.get('x-ui-access-code');
  return Boolean(expected && received === expected);
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const batchId = String(searchParams.get('batch_id') ?? '').trim();

  if (!batchId) {
    return NextResponse.json({ error: 'Missing batch_id' }, { status: 400 });
  }

  const db = supabaseAdmin as any;

  const [batch, images, videos, heygen, xyla] = await Promise.all([
    db.from('creative_batches').select('*').eq('id', batchId).single(),
    db.from('image_packets').select('*').eq('batch_id', batchId).order('viral_score', { ascending: false }),
    db.from('video_packets').select('*').eq('batch_id', batchId).order('viral_score', { ascending: false }),
    db.from('heygen_packets').select('*').eq('batch_id', batchId).order('viral_score', { ascending: false }),
    db.from('xyla_content_packets').select('*').eq('batch_id', batchId).order('viral_score', { ascending: false })
  ]);

  if (batch.error) return NextResponse.json({ error: batch.error.message }, { status: 500 });
  if (images.error) return NextResponse.json({ error: images.error.message }, { status: 500 });
  if (videos.error) return NextResponse.json({ error: videos.error.message }, { status: 500 });
  if (heygen.error) return NextResponse.json({ error: heygen.error.message }, { status: 500 });
  if (xyla.error) return NextResponse.json({ error: xyla.error.message }, { status: 500 });

  return NextResponse.json({
    checked_at: new Date().toISOString(),
    batch: batch.data,
    image_packets: images.data ?? [],
    video_packets: videos.data ?? [],
    heygen_packets: heygen.data ?? [],
    xyla_content_packets: xyla.data ?? [],
    note: 'Read-only batch detail. No publishing, rendering, Xyla handoff, or Shopify changes occurred.'
  });
}
