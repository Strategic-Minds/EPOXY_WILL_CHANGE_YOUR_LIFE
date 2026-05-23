import { NextResponse } from 'next/server';
import { sendSlackAlert } from '@/lib/slack';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const tableByType: Record<string, string> = {
  image: 'image_packets',
  video: 'video_packets',
  heygen: 'heygen_packets',
  xyla: 'xyla_content_packets'
};

const renderToolByType: Record<string, string> = {
  image: 'image_generator',
  video: 'video_editor',
  heygen: 'heygen'
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

  const { data: packet, error: packetError } = await db
    .from(table)
    .select('id, batch_id, approval_status')
    .eq('id', packetId)
    .single();

  if (packetError) return NextResponse.json({ error: packetError.message }, { status: 500 });

  if (packet.approval_status !== 'approved') {
    return NextResponse.json({
      error: 'Packet is not approved. Approve it before queueing.',
      packet_type: packetType,
      packet_id: packetId,
      approval_status: packet.approval_status
    }, { status: 409 });
  }

  if (packetType === 'xyla') {
    const { data: updated, error: updateError } = await db
      .from('xyla_content_packets')
      .update({ handoff_status: 'ready' })
      .eq('id', packetId)
      .select('id, batch_id, approval_status, handoff_status')
      .single();

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

    await sendSlackAlert({
      title: 'Approved Packet Queued',
      message: 'Approved Xyla packet marked ready for the next human-reviewed handoff step. No publishing occurred.',
      level: 'success',
      fields: {
        packet_type: packetType,
        packet_id: updated.id,
        batch_id: updated.batch_id,
        handoff_status: updated.handoff_status
      }
    });

    return NextResponse.json({
      queued: true,
      packet_type: packetType,
      packet_id: updated.id,
      batch_id: updated.batch_id,
      queue_status: updated.handoff_status,
      note: 'Xyla packet marked ready only. No Xyla publishing or public posting occurred.'
    });
  }

  const renderTool = renderToolByType[packetType];

  const { data: queued, error: queueError } = await db
    .from('render_queue')
    .insert({
      batch_id: packet.batch_id,
      packet_type: packetType,
      packet_id: packet.id,
      render_tool: renderTool,
      approval_status: 'approved',
      render_status: 'not_rendered'
    })
    .select('id, batch_id, packet_type, packet_id, render_tool, approval_status, render_status')
    .single();

  if (queueError) return NextResponse.json({ error: queueError.message }, { status: 500 });

  await sendSlackAlert({
    title: 'Approved Packet Queued',
    message: 'Approved packet added to render_queue for the next human-reviewed step. No rendering or publishing occurred.',
    level: 'success',
    fields: {
      queue_id: queued.id,
      packet_type: queued.packet_type,
      packet_id: queued.packet_id,
      batch_id: queued.batch_id,
      render_tool: queued.render_tool,
      render_status: queued.render_status
    }
  });

  return NextResponse.json({
    queued: true,
    queue_id: queued.id,
    packet_type: queued.packet_type,
    packet_id: queued.packet_id,
    batch_id: queued.batch_id,
    render_tool: queued.render_tool,
    queue_status: queued.render_status,
    note: 'Approved packet queued only. No rendering, publishing, Xyla publishing, HeyGen rendering, image rendering, video rendering, or Shopify changes occurred.'
  });
}
