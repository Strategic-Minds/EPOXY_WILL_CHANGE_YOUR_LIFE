import { NextResponse } from 'next/server';
import { runAgentCommand } from '@/lib/aiGateway';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendSlackAlert } from '@/lib/slack';

function needsPriorityAlert(agentName: string, output: string) {
  const text = `${agentName} ${output}`.toLowerCase();
  return text.includes('approval') || text.includes('blocker') || text.includes('urgent') || text.includes('next action');
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const task = String(body.task ?? '').trim();
  const agentName = String(body.agent_name ?? 'Executive Assistant Agent');
  const context = String(body.context ?? 'Request originated from the EWL v0-style admin UI.');

  if (!task) {
    return NextResponse.json({ error: 'Missing task' }, { status: 400 });
  }

  try {
    const db = supabaseAdmin as any;
    const result = await runAgentCommand({ agentName, task, context, model: body.model });
    const priority = needsPriorityAlert(agentName, result.output);

    const saved = await db
      .from('agent_runs')
      .insert({
        agent_name: agentName,
        task,
        context,
        output: result.output,
        provider: result.provider,
        model: result.model,
        status: 'completed',
        approval_required: true,
        slack_sent: false
      })
      .select('id')
      .single();

    if (saved.error) return NextResponse.json({ error: saved.error.message }, { status: 500 });

    let slackSent = false;
    if (priority) {
      const slack = await sendSlackAlert({
        title: `${agentName} UI Output`,
        message: result.output.slice(0, 2500),
        level: 'info',
        fields: {
          agent_run_id: saved.data.id,
          provider: result.provider,
          model: result.model
        }
      });
      slackSent = Boolean(slack.sent);
      await db.from('agent_runs').update({ slack_sent: slackSent }).eq('id', saved.data.id);
    }

    return NextResponse.json({
      agent_run_id: saved.data.id,
      provider: result.provider,
      model: result.model,
      slack_sent: slackSent,
      output: result.output
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown agent error';
    await sendSlackAlert({
      title: 'UI Agent Command Error',
      message,
      level: 'error',
      fields: { agent: agentName }
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
