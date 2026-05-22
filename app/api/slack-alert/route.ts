import { NextResponse } from 'next/server';
import { sendSlackAlert } from '@/lib/slack';

export async function POST(request: Request) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));

  const result = await sendSlackAlert({
    title: body.title ?? 'EWL Alert',
    message: body.message ?? 'No message provided.',
    level: body.level ?? 'info',
    fields: body.fields ?? {}
  });

  return NextResponse.json(result);
}
