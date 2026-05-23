import { NextResponse } from 'next/server';
import { sendSlackAlert } from '@/lib/slack';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

function authorized(request: Request) {
  const expected = process.env.UI_ACCESS_CODE;
  const received = request.headers.get('x-ui-access-code');
  return Boolean(expected && received === expected);
}

function clean(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function qty(value: unknown) {
  const parsed = Number(value ?? 10);
  if (!Number.isFinite(parsed)) return 10;
  return Math.max(1, Math.min(50, Math.floor(parsed)));
}

const hooks = [
  'AI can make the picture. It cannot build the floor.',
  'Your hands are not obsolete.',
  'A prompt cannot pour epoxy.',
  'The trades are not dead. They are being rebuilt.',
  'This is what work looks like when it becomes art.',
  'Start with your hands. Build with your mind.',
  'A laptop cannot grind concrete.',
  'This is not merch. This is a mindset.',
  'Built with hands. Built for life.',
  'Concrete is everywhere. Opportunity is everywhere.'
];

function tagSet(platform: string) {
  const p = platform.toLowerCase();
  const tags = ['#EpoxyWillChangeYourLife', '#AICantDoThis', '#XPS', '#Epoxy'];
  if (p.includes('tiktok')) tags.push('#ContractorLife');
  if (p.includes('youtube')) tags.push('#Shorts');
  return tags;
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const objective = clean(body.objective, 'Create draft creative packets');
  const theme = clean(body.theme, "AI CAN'T DO THIS - EPOXY WILL CHANGE YOUR LIFE");
  const audience = clean(body.audience, 'beginner epoxy contractors, DIY homeowners, and hands-on creators');
  const platform = clean(body.platform, 'Instagram, TikTok, YouTube Shorts, Facebook, Shopify');
  const assetNotes = clean(body.asset_notes, 'black and gold EWL / XPS brand assets');
  const quantity = qty(body.quantity);
  const cta = clean(body.cta, 'Get the Free Epoxy Starter Pack');
  const landingPage = clean(body.landing_page, '/free-epoxy-starter-pack');
  const db = supabaseAdmin as any;

  const { data: batch, error: batchError } = await db
    .from('creative_batches')
    .insert({ objective, theme, audience, platform, asset_notes: assetNotes, quantity, cta, landing_page: landingPage, approval_level: 'draft_only', status: 'packets_created' })
    .select('id')
    .single();

  if (batchError) return NextResponse.json({ error: batchError.message }, { status: 500 });

  const selectedHooks = Array.from({ length: quantity }, (_, index) => hooks[index % hooks.length]);
  const tags = tagSet(platform);

  const imageRows = selectedHooks.map((hook, index) => ({
    batch_id: batch.id,
    title: `${theme} image ${index + 1}`,
    platform,
    audience,
    hook,
    prompt: `Create a premium black and gold contractor brand image with silver distressed lettering, glow lighting, workwear, tools, epoxy, concrete, and this message: ${hook}. Asset notes: ${assetNotes}.`,
    visual_direction: `Black background, gold glow, silver distressed text, premium contractor identity. ${assetNotes}`,
    caption: `${hook} ${cta}.`,
    cta,
    landing_page: landingPage,
    hashtags: tags,
    risk_score: 0,
    viral_score: 90 - (index % 21),
    approval_status: 'draft',
    render_status: 'not_rendered'
  }));

  const videoRows = selectedHooks.map((hook, index) => ({
    batch_id: batch.id,
    title: `${theme} short video ${index + 1}`,
    platform,
    audience,
    hook,
    script: `${hook} Show the brand, the tools, the surface, and the finished work. Keep it bold, direct, and visual. End with: ${cta}.`,
    scene_notes: 'Fast cuts: apparel, tools, floor texture, concrete, epoxy surface, black and gold CTA card.',
    caption: `${hook} ${cta}.`,
    cta,
    landing_page: landingPage,
    hashtags: tags,
    risk_score: 0,
    viral_score: 88 - (index % 19),
    approval_status: 'draft',
    render_status: 'not_rendered'
  }));

  const heygenRows = selectedHooks.slice(0, Math.min(10, quantity)).map((hook, index) => ({
    batch_id: batch.id,
    title: `${theme} avatar script ${index + 1}`,
    platform,
    audience,
    hook,
    script: `${hook} This is for people who still want to build with their hands. Start with the basics, learn the process, and use the Free Epoxy Starter Pack as your first step.`,
    scene_notes: 'Avatar on black and gold brand background with optional cuts to workwear, tools, floors, and CTA card.',
    avatar_direction: 'direct, grounded, practical contractor educator',
    voice_direction: 'bold, clear, confident, not hype-heavy',
    caption: `${hook} ${cta}.`,
    cta,
    landing_page: landingPage,
    risk_score: 0,
    viral_score: 86 - (index % 17),
    approval_status: 'draft',
    render_status: 'not_rendered'
  }));

  const xylaRows = selectedHooks.map((hook, index) => ({
    batch_id: batch.id,
    platform,
    content_type: 'social_post',
    hook,
    caption: `${hook}\n\nPremium contractor identity. Real hands. Real work. Real transformation.\n\n${cta}.`,
    visual_direction: `Use EWL / XPS black and gold visuals with workwear, tools, epoxy, concrete, and movement energy.`,
    cta,
    landing_page: landingPage,
    hashtags: tags,
    risk_score: 0,
    viral_score: 89 - (index % 20),
    approval_status: 'draft',
    handoff_status: 'not_ready'
  }));

  const inserts = await Promise.all([
    db.from('image_packets').insert(imageRows),
    db.from('video_packets').insert(videoRows),
    db.from('heygen_packets').insert(heygenRows),
    db.from('xyla_content_packets').insert(xylaRows)
  ]);

  const failed = inserts.find((result: any) => result.error);
  if (failed?.error) return NextResponse.json({ error: failed.error.message, batch_id: batch.id }, { status: 500 });

  await sendSlackAlert({
    title: 'Packet Batch Created',
    message: 'Draft packets created for review only.',
    level: 'success',
    fields: {
      batch_id: batch.id,
      image_packets: imageRows.length,
      video_packets: videoRows.length,
      heygen_packets: heygenRows.length,
      xyla_packets: xylaRows.length
    }
  });

  return NextResponse.json({
    batch_id: batch.id,
    counts: { image_packets: imageRows.length, video_packets: videoRows.length, heygen_packets: heygenRows.length, xyla_packets: xylaRows.length },
    note: 'Draft packet rows created only. No public publishing, Xyla publishing, HeyGen rendering, Shopify changes, or irreversible automation occurred.'
  });
}
