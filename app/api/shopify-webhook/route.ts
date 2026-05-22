import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  const payload = await request.json();
  const title = payload?.title ?? payload?.name ?? 'Shopify Event';
  const image = payload?.image?.src ?? payload?.images?.[0]?.src ?? null;
  const db = supabaseAdmin as any;

  const { error } = await db.from('assets').insert({
    source: 'shopify',
    source_url: image,
    file_name: title,
    asset_type: 'product',
    content_pillar: 'product_path',
    platform_fit: ['facebook', 'instagram', 'tiktok', 'youtube'],
    status: 'new'
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ received: true });
}
