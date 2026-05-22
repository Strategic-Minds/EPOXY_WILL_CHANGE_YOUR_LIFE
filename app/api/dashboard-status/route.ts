import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

function isAuthorized(request: Request) {
  const headerCode = request.headers.get('x-ui-access-code') ?? '';
  const expectedCode = process.env.UI_ACCESS_CODE;
  return Boolean(expectedCode && headerCode === expectedCode);
}

async function safeCount(db: any, table: string, apply: (query: any) => any) {
  const query = db.from(table).select('id', { count: 'exact', head: true });
  const { count, error } = await apply(query);
  if (error) throw new Error(`${table}: ${error.message}`);
  return count ?? 0;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = supabaseAdmin as any;

    const [pendingReviews, readyXyla, waitingCalendar, latestRuns] = await Promise.all([
      safeCount(db, 'review_queue', (query) => query.eq('status', 'pending')),
      safeCount(db, 'xyla_queue', (query) => query.eq('handoff_status', 'ready')),
      safeCount(db, 'marketing_calendar_rows', (query) => query.is('content_item_id', null)),
      db
        .from('agent_runs')
        .select('id, agent_name, status, provider, model, slack_sent, created_at')
        .order('created_at', { ascending: false })
        .limit(5)
    ]);

    if (latestRuns.error) {
      return NextResponse.json({ error: latestRuns.error.message }, { status: 500 });
    }

    return NextResponse.json({
      checked_at: new Date().toISOString(),
      timezone: 'America/New_York',
      counts: {
        pending_reviews: pendingReviews,
        ready_xyla: readyXyla,
        calendar_rows_waiting: waitingCalendar,
        latest_agent_runs: latestRuns.data?.length ?? 0
      },
      latest_agent_runs: latestRuns.data ?? []
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown dashboard status error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
