import { AgentChat } from './components/AgentChat';

const primaryTimezone = 'America/New_York';

const stack = [
  ['GitHub', 'System truth'],
  ['Vercel', 'Agent runtime'],
  ['AI Gateway', 'Model routing'],
  ['Supabase', 'Operating state'],
  ['Slack', 'Fast alerts'],
  ['Shopify', 'Conversion'],
  ['Xyla', 'Approved social'],
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

export default function HomePage() {
  const nowNewYork = new Intl.DateTimeFormat('en-US', {
    timeZone: primaryTimezone,
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(new Date());

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand-kicker">EWL Hyperdrive OS</div>
          <h1 className="brand-title">Agent Command Center</h1>
          <p className="brand-subtitle">Template-grade chat UI connected to Vercel AI Gateway, Supabase state, Slack alerts, Shopify, Xyla, Drive, Intelligence OS, and AutoBuilder OS.</p>
        </div>

        <div className="status-card">
          <p className="status-label">Primary timezone</p>
          <p className="status-value">{primaryTimezone}</p>
          <p className="status-label" style={{ marginTop: 10 }}>Current New York time</p>
          <p className="status-value">{nowNewYork}</p>
        </div>

        <div className="side-section">
          <p className="status-label">Locked stack</p>
          <div className="stack-list">
            {stack.map(([name, role]) => (
              <div key={name} className="stack-item">
                <span className="stack-name">{name}</span>
                <span className="stack-role">{role}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="main">
        <section className="hero">
          <div className="hero-row">
            <div>
              <div className="brand-kicker">Next.js Chatbot Template Integration</div>
              <h1>Chat-first admin UI</h1>
              <p>This interface now uses a real template shell instead of uncompiled Tailwind utility markup. The browser sends commands to a protected UI route while Vercel handles AI Gateway, Supabase logging, and Slack alerts server-side.</p>
            </div>
            <div className="pill">Review mode active</div>
          </div>
        </section>

        <section className="grid">
          <div className="chat-panel">
            <div className="chat-header">
              <div>
                <h2 className="chat-title">Executive Assistant Agent</h2>
                <p className="chat-subtitle">Default command agent</p>
              </div>
              <div className="gateway-badge">Gateway ready</div>
            </div>

            <div className="messages">
              <div className="message user">Check the marketing calendar, Supabase queues, GitHub issues, Vercel deployment state, Shopify conversion blockers, Xyla readiness, and Slack alerts. Return the next best action.</div>
              <div className="message assistant">Ready. I will inspect, summarize, route, and alert. I will not publish, deploy, bill, or change claims without approval.</div>
            </div>

            <AgentChat />
          </div>

          <aside className="right-panel">
            <div className="module">
              <h2>Live system</h2>
              <div className="metric-grid">
                <div className="metric"><span>Cron</span><strong>5m</strong></div>
                <div className="metric"><span>Mode</span><strong>Review</strong></div>
                <div className="metric"><span>Xyla</span><strong>Gate</strong></div>
              </div>
            </div>

            <div className="module">
              <h2>Agent bench</h2>
              <div className="agent-list">
                {agents.map((agent) => (
                  <div key={agent} className="agent-card">
                    <strong>{agent}</strong>
                    <p>Draft • score • route • alert</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="module">
              <h2>Safety boundary</h2>
              <ul className="safety-list">
                <li>Xyla receives approved content only.</li>
                <li>Shopify owns conversion.</li>
                <li>Supabase stores state.</li>
                <li>Slack alerts #all-xps-intelligence-system.</li>
                <li>No irreversible action without human approval.</li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
