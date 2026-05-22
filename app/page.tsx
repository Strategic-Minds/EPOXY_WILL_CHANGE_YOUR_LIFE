const primaryTimezone = 'America/New_York';

const stack = [
  ['GitHub', 'System truth'],
  ['Vercel', 'Agent runtime'],
  ['AI Gateway', 'Model routing'],
  ['Supabase', 'Operating state'],
  ['Slack', 'Fast-response alerts'],
  ['Shopify', 'Conversion layer'],
  ['Xyla', 'Approved social execution'],
  ['Drive', 'Asset vault']
];

const agents = [
  'Executive Assistant',
  'Marketing Calendar',
  'Content Packet',
  'Intelligence OS',
  'AutoBuilder OS',
  'GitHub Architect',
  'Shopify Conversion',
  'Slack Command'
];

const commands = [
  'Run daily command',
  'Find approval blockers',
  'Create content from calendar',
  'Check Xyla-ready queue',
  'Summarize AutoBuilder loop',
  'Prepare Shopify CTA fixes'
];

export default function HomePage() {
  const nowNewYork = new Intl.DateTimeFormat('en-US', {
    timeZone: primaryTimezone,
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(new Date());

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-2xl">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-400">EWL Hyperdrive OS</p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight">Agent Command Center</h1>
            <p className="mt-2 text-sm text-neutral-400">Controlled AI workflow for content, commerce, automation, and system building.</p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
            <p className="text-sm font-medium text-neutral-200">Timezone Lock</p>
            <p className="mt-2 text-xs text-neutral-400">{primaryTimezone}</p>
            <p className="mt-1 text-sm text-amber-300">{nowNewYork}</p>
          </div>

          <div className="mt-5 space-y-2">
            {stack.map(([name, role]) => (
              <div key={name} className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-950/70 px-4 py-3">
                <span className="text-sm font-medium">{name}</span>
                <span className="text-xs text-neutral-500">{role}</span>
              </div>
            ))}
          </div>
        </aside>

        <section className="grid gap-6">
          <div className="rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-neutral-950 p-6 shadow-2xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-amber-400">Vercel v0-style frontend</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">Chat-first admin UI</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">
                  This interface is the visual command layer for GPT agents. It is wired conceptually to <code>/api/agent-command</code>, with human approval gates before publishing, billing, deployment, claims, or destructive actions.
                </p>
              </div>
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                Review mode active
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <h3 className="text-lg font-semibold">Executive Assistant Agent</h3>
                  <p className="text-sm text-neutral-500">Default command agent</p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">Gateway ready</span>
              </div>

              <div className="space-y-4">
                <div className="max-w-[82%] rounded-3xl rounded-tl-md bg-neutral-800 px-4 py-3 text-sm leading-6 text-neutral-200">
                  Check the marketing calendar, Supabase queues, GitHub issues, Vercel deployment state, Shopify conversion blockers, and Slack alerts. Return the next best action.
                </div>
                <div className="ml-auto max-w-[82%] rounded-3xl rounded-tr-md bg-amber-500 px-4 py-3 text-sm leading-6 text-neutral-950">
                  Ready. I will inspect, summarize, route, and alert. I will not publish, deploy, bill, or change claims without approval.
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
                <label className="text-xs uppercase tracking-[0.2em] text-neutral-500">Command input</label>
                <div className="mt-3 min-h-28 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-500">
                  Cloud-only UI placeholder. Next step: add authenticated client action that posts to /api/agent-command with ADMIN_SECRET handled server-side.
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {commands.map((command) => (
                    <button key={command} className="rounded-full border border-neutral-700 px-3 py-2 text-xs text-neutral-300 hover:border-amber-400 hover:text-amber-300">
                      {command}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-5 shadow-2xl">
                <h3 className="text-lg font-semibold">Agent bench</h3>
                <div className="mt-4 grid gap-2">
                  {agents.map((agent) => (
                    <div key={agent} className="rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-3">
                      <p className="text-sm font-medium">{agent}</p>
                      <p className="text-xs text-neutral-500">Draft • score • route • alert</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-5 shadow-2xl">
                <h3 className="text-lg font-semibold">Safety boundary</h3>
                <ul className="mt-4 space-y-3 text-sm text-neutral-400">
                  <li>• Xyla receives approved content only.</li>
                  <li>• Shopify owns conversion.</li>
                  <li>• Supabase stores state.</li>
                  <li>• Slack alerts #all-xps-intelligence-system.</li>
                  <li>• No irreversible action without human approval.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
