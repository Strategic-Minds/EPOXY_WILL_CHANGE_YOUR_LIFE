import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [{ data: drafts }, { data: reviews }, { data: xyla }] = await Promise.all([
    supabaseAdmin.from('content_items').select('*').eq('status', 'draft').limit(20),
    supabaseAdmin.from('review_queue').select('*').eq('status', 'pending').limit(20),
    supabaseAdmin.from('xyla_queue').select('*').eq('handoff_status', 'ready').limit(20)
  ]);

  return NextResponse.json({
    date: new Date().toISOString(),
    priorities: {
      drafts: drafts?.length ?? 0,
      pendingReviews: reviews?.length ?? 0,
      xylaReady: xyla?.length ?? 0
    },
    nextActions: [
      'Review pending items',
      'Approve safe content for Xyla',
      'Check Shopify CTA paths',
      'Record yesterday metrics'
    ]
  });
}
