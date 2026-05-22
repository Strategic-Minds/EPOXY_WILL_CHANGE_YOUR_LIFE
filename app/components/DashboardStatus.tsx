'use client';

import { useState } from 'react';

type DashboardStatusResponse = {
  checked_at: string;
  timezone: string;
  counts: {
    pending_reviews: number;
    ready_xyla: number;
    calendar_rows_waiting: number;
    latest_agent_runs: number;
  };
  latest_agent_runs: Array<{
    id: string;
    agent_name: string;
    status: string;
    provider: string | null;
    model: string | null;
    slack_sent: boolean | null;
    created_at: string;
  }>;
};

export function DashboardStatus() {
  const [operatorCode, setOperatorCode] = useState('');
  const [status, setStatus] = useState<DashboardStatusResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/dashboard-status', {
        method: 'GET',
        headers: { 'x-ui-access-code': operatorCode }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Dashboard status failed');
      setStatus(data);
    } catch (err) {
      setStatus(null);
      setError(err instanceof Error ? err.message : 'Unknown status error');
    } finally {
      setLoading(false);
    }
  }

  const counts = status?.counts;

  return (
    <div className="module dashboard-status">
      <h2>Live Supabase status</h2>
      <div className="form-grid compact">
        <input
          value={operatorCode}
          onChange={(event) => setOperatorCode(event.target.value)}
          placeholder="Operator code"
          type="password"
          className="field"
        />
        <button type="button" onClick={refresh} disabled={loading} className="primary-button status-button">
          {loading ? 'Refreshing...' : 'Refresh status'}
        </button>
      </div>

      {error ? <div className="status-error">{error}</div> : null}
      {!status && !error ? <div className="status-muted">Enter operator code and refresh to load live counts.</div> : null}

      {counts ? (
        <>
          <div className="metric-grid status-metrics">
            <div className="metric"><span>Pending reviews</span><strong>{counts.pending_reviews}</strong></div>
            <div className="metric"><span>Xyla ready</span><strong>{counts.ready_xyla}</strong></div>
            <div className="metric"><span>Calendar waiting</span><strong>{counts.calendar_rows_waiting}</strong></div>
          </div>
          <div className="status-row latest-row">
            <span>Latest agent runs</span>
            <strong>{counts.latest_agent_runs}</strong>
          </div>
          <div className="agent-list latest-runs">
            {status.latest_agent_runs.map((run) => (
              <div key={run.id} className="agent-card">
                <strong>{run.agent_name}</strong>
                <p>{run.status} • {run.provider ?? 'provider pending'} • Slack {run.slack_sent ? 'sent' : 'not sent'}</p>
              </div>
            ))}
          </div>
          <p className="status-muted">Checked {new Date(status.checked_at).toLocaleString()} • {status.timezone}</p>
        </>
      ) : null}
    </div>
  );
}
