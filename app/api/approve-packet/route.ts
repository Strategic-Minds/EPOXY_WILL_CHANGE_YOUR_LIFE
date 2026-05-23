import { NextResponse } from 'next/server';
import { sendSlackAlert } from '@/lib/slack';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const tableByType: Record<string, string> = {
  image: 'image_packets',
  video: 'video_packets',
  heygen: 'heygen_packets',
  xyla: 'xyla_content_packets'
};

function authorized(request: Request) {
  const expected = process.env.UI_ACCESS_CODE;
  const received = request.headers.get('x-ui-access-code');
  return Boolean(expected && received === expected);
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const packetType = String(body.packet_type ?? '').trim().toLowerCase();
  const packetId = String(body.packet_id ?? '').trim();
  const table = tableByType[packetType];

  if (!table) {
    return NextResponse.json({ error: 'Invalid packet_type. Use image, video, heygen, or xyla.' }, { status: 400 });
  }

  if (!packetId) {
    return NextResponse.json({ error: 'Missing packet_id' }, { status: 400 });
  }

  const db = supabaseAdmin as any;

  const { data, error } = await db
    .from(table)
    .update({ approval_status: 'approved' })
    .eq('id', packetId)
    .select('id, batch_id, approval_status')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await sendSlackAlert({
    title: 'Packet Approved',
    message: 'A creative packet was approved for the next gated step. No rendering, publishing, Xyla handoff, or Shopify change occurred.',
    level: 'success',
    fields: {
      packet_type: packetType,
      packet_id: data.id,
      batch_id: data.batch_id,
      approval_status: data.approval_status
    }
  });

  return NextResponse.json({
    approved: true,
    packet_type: packetType,
    packet_id: data.id,
    batch_id: data.batch_id,
    note: 'Approval only. No publishing, rendering, Xyla handoff, HeyGen rendering, or Shopify changes occurred.'
  });
}
