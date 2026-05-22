import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendSlackAlert } from '@/lib/slack';

export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date().toISOString();

  const [{ data: pendingReviews }, { data: readySocial }, { data: calendarDrafts }] = await Promise.all([
    supabaseAdmin.from('review_queue').select('*').eq('status', 'pending').limit(10),
    supabaseAdmin.from('xyla_queue').select('*').eq('handoff_status', 'ready').limit(10),
    supabaseAdmin.from('marketing_calendar_rows').select('*').is('content_item_id', null).limit(10)
  ]);

  const summary = {
    pending_reviews: pendingReviews?.length ?? 0,
    ready_social: readySocial?.length ?? 0,
    calendar_rows_waiting: calendarDrafts?.length ?? 0
  };

  if (summary.pending_reviews > 0 || summary.ready_social > 0 || summary.calendar_rows_waiting > 0) {
    await sendSlackAlert({
      title: 'EWL AutoBuilder Loop',
      message: 'Five minute loop found action items.',
      level: 'info',
      fields: summary
    });
  }

  return NextResponse.json({ checked_at: now, timezone: 'America/New_York', summary });
}
