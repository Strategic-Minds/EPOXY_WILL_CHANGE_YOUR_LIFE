import { AgentChat } from './components/AgentChat';
import { DashboardStatus } from './components/DashboardStatus';
import { ThemeToggle } from './components/ThemeToggle';
import { XylaQueuePanel } from './components/XylaQueuePanel';

const primaryTimezone = 'America/New_York';

const navItems = [
  'Command Center',
  'Agents',
  'Content Calendar',
  'Review Queue',
  'Xyla Queue',
  'Shopify',
  'AutoBuilder',
  'Intelligence OS',
  'Slack Alerts',
  'Settings'
];

const stack = [
  ['GitHub', 'System truth'],
  ['Vercel', 'Agent runtime'],
  ['AI Gateway', 'Model routing'],
  ['Supabase', 'Operating state'],
  ['Slack', 'Fast alerts'],
  ['Shopify', 'Conversion'],
  ['Xyla', 'Approval gate'],
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

const systemStatus = [
  ['Vercel AI Gateway', 'Ready'],
  ['Supabase', 'Connected'],
  ['Slack', 'Alert Layer'],
  ['AutoBuilder Cron', '5m'],
  ['Xyla', 'Approval Gate'],
  ['Shopify', 'Conversion Layer'],
  ['Mode', 'Review'],
  ['Timezone', primaryTimezone]
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
          <p className="brand-subtitle">Controlled AI automation for content, commerce, social, operations, Intelligence OS, and AutoBuilder OS.</p>
        </div>

        <nav className="nav-list" aria-label="Command center navigation">
          {navItems.map((item, index) => (
            <div key={item} className={index === 0 ? 'nav-item active' : 'nav-item'}>
              <span>{item}</span>
              {index === 0 ? <span className="nav-dot" /> : null}
            </div>
          ))}
        </nav>

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
        <div className="topbar">
          <div className="breadcrumb">EWL / Command Center / Review Mode</div>
          <ThemeToggle />
        </div>

        <section className="hero">
          <div className="hero-row">
            <div>
              <div className="brand-kicker">v0.app quality command UI</div>
              <h1>Chat-first automation control center</h1>
              <p>This command center preserves the live EWL stack while moving the frontend toward a v0-style AI app shell: left navigation, central chat, right-side system telemetry, theme modes, approval badges, and controlled execution boundaries.</p>
              <div className="badge-row">
                <span className="badge ready">Ready</span>
                <span className="badge approval">Needs Approval</span>
                <span className="badge blocked">Blocked</span>
                <span className="badge review">Review Mode</span>
                <span className="badge safe">Safe Automation</span>
              </div>
            </div>
            <div className="pill">Xyla approval-gated</div>
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
              <div className="message assistant">Ready. I will inspect, summarize, route, and alert. I will not publish, deploy, bill, price, or change claims without approval.</div>
            </div>

            <AgentChat />
          </div>

          <aside className="right-panel">
            <DashboardStatus />
            <XylaQueuePanel />

            <div className="module">
              <h2>Operational status</h2>
              <div className="status-list">
                {systemStatus.map(([label, value]) => (
                  <div key={label} className="status-row">
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>

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
          </aside>
        </section>

        <section className="safety-banner">
          <strong>Safety boundary:</strong> No public publishing, billing, deployment, pricing, product claims, warranty claims, safety claims, student stories, customer commitments, or destructive actions without human approval.
        </section>
      </main>
    </div>
  );
}
