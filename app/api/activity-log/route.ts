import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

function isAuthorized(request: Request) {
  const headerCode = request.headers.get('x-ui-access-code') ?? '';
  const expectedCode = process.env.UI_ACCESS_CODE;
  return Boolean(expectedCode && headerCode === expectedCode);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = supabaseAdmin as any;

  const [agentRuns, reviewDecisions, xylaActivity] = await Promise.all([
    db
      .from('agent_runs')
      .select('id, agent_name, status, provider, model, slack_sent, created_at')
      .order('created_at', { ascending: false })
      .limit(10),
    db
      .from('review_queue')
      .select('id, content_item_id, review_type, risk_category, decision, status, notes, reviewed_at, created_at')
      .neq('status', 'pending')
      .order('reviewed_at', { ascending: false, nullsFirst: false })
      .limit(10),
    db
      .from('xyla_queue')
      .select('id, content_item_id, platform, post_type, handoff_status, scheduled_at, created_at')
      .order('created_at', { ascending: false })
      .limit(10)
  ]);

  if (agentRuns.error) return NextResponse.json({ error: agentRuns.error.message }, { status: 500 });
  if (reviewDecisions.error) return NextResponse.json({ error: reviewDecisions.error.message }, { status: 500 });
  if (xylaActivity.error) return NextResponse.json({ error: xylaActivity.error.message }, { status: 500 });

  return NextResponse.json({
    checked_at: new Date().toISOString(),
    timezone: 'America/New_York',
    agent_runs: agentRuns.data ?? [],
    review_decisions: reviewDecisions.data ?? [],
    xyla_activity: xylaActivity.data ?? []
  });
}
