'use client';

import { useState } from 'react';
import { CopyButton } from './CopyButton';

type AgentRun = {
  id: string;
  agent_name: string | null;
  status: string | null;
  provider: string | null;
  model: string | null;
  slack_sent: boolean | null;
  created_at: string | null;
};

type ReviewDecision = {
  id: string;
  content_item_id: string | null;
  review_type: string | null;
  risk_category: string | null;
  decision: string | null;
  status: string | null;
  notes: string | null;
  reviewed_at: string | null;
  created_at: string | null;
};

type XylaActivity = {
  id: string;
  content_item_id: string | null;
  platform: string | null;
  post_type: string | null;
  handoff_status: string | null;
  scheduled_at: string | null;
  created_at: string | null;
};

type ActivityLogResponse = {
  checked_at: string;
  timezone: string;
  agent_runs: AgentRun[];
  review_decisions: ReviewDecision[];
  xyla_activity: XylaActivity[];
};

type ActivityLogPanelProps = {
  operatorCode: string;
};

function formatDate(value: string | null) {
  if (!value) return 'date pending';
  return new Date(value).toLocaleString();
}

export function ActivityLogPanel({ operatorCode }: ActivityLogPanelProps) {
  const [log, setLog] = useState<ActivityLogResponse | null>(null);
  const [message, setMessage] = useState('Use the Operator Session field above, then refresh to load activity.');
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    setMessage('Loading activity log...');

    try {
      const response = await fetch('/api/activity-log', {
        method: 'GET',
        headers: { 'x-ui-access-code': operatorCode }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Activity log load failed');
      setLog(data);
      setMessage('Activity log loaded. Read-only view. No mutations performed.');
    } catch (error) {
      setLog(null);
      setMessage(error instanceof Error ? error.message : 'Unknown activity log error');
    } finally {
      setLoading(false);
    }
  }

  const empty = log && log.agent_runs.length === 0 && log.review_decisions.length === 0 && log.xyla_activity.length === 0;

  return (
    <div className="module activity-log-panel">
      <h2>Activity log</h2>
      <button type="button" onClick={refresh} disabled={loading || !operatorCode} className="primary-button status-button full-width-button">
        {loading ? 'Loading...' : 'Refresh activity'}
      </button>
      <div className="status-muted">{message}</div>

      {empty ? <div className="status-muted">No activity rows found yet.</div> : null}

      {log ? (
        <div className="activity-sections">
          <section className="activity-section">
            <h3>Agent runs</h3>
            {log.agent_runs.length === 0 ? <p className="status-muted">No agent runs found.</p> : null}
            <div className="agent-list latest-runs">
              {log.agent_runs.map((run) => (
                <div key={run.id} className="agent-card">
                  <strong>{run.agent_name ?? 'Agent run'}</strong>
                  <p>{run.status ?? 'status pending'} • {run.provider ?? 'provider pending'} • {run.model ?? 'model pending'}</p>
                  <p>Slack {run.slack_sent ? 'sent' : 'not sent'} • {formatDate(run.created_at)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="activity-section">
            <h3>Review decisions</h3>
            {log.review_decisions.length === 0 ? <p className="status-muted">No review decisions found.</p> : null}
            <div className="agent-list latest-runs">
              {log.review_decisions.map((item) => (
                <div key={item.id} className="agent-card">
                  <strong>{item.decision ?? item.status ?? 'Review decision'}</strong>
                  {item.content_item_id ? (
                    <div className="copy-box compact-copy">
                      <span>content_item_id</span>
                      <div className="copy-row">
                        <code>{item.content_item_id}</code>
                        <CopyButton text={item.content_item_id} />
                      </div>
                    </div>
                  ) : null}
                  <p>{item.review_type ?? 'review type pending'} • {item.risk_category ?? 'risk category pending'}</p>
                  <p>{item.notes ?? 'notes pending'}</p>
                  <p>{formatDate(item.reviewed_at ?? item.created_at)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="activity-section">
            <h3>Xyla handoff activity</h3>
            {log.xyla_activity.length === 0 ? <p className="status-muted">No Xyla handoff rows found.</p> : null}
            <div className="agent-list latest-runs">
              {log.xyla_activity.map((item) => (
                <div key={item.id} className="agent-card">
                  <strong>{item.handoff_status ?? 'Xyla handoff'}</strong>
                  {item.content_item_id ? (
                    <div className="copy-box compact-copy">
                      <span>content_item_id</span>
                      <div className="copy-row">
                        <code>{item.content_item_id}</code>
                        <CopyButton text={item.content_item_id} />
                      </div>
                    </div>
                  ) : null}
                  <p>{item.platform ?? 'platform pending'} • {item.post_type ?? 'post type pending'}</p>
                  <p>Scheduled: {formatDate(item.scheduled_at)}</p>
                  <p>Created: {formatDate(item.created_at)}</p>
                </div>
              ))}
            </div>
          </section>

          <p className="status-muted">Checked {formatDate(log.checked_at)} • {log.timezone}</p>
        </div>
      ) : null}
    </div>
  );
}
