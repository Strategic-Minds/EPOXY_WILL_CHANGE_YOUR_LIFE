'use client';

import { useState } from 'react';
import { CopyButton } from './CopyButton';

type CalendarRow = {
  id: string;
  sheet_id: string;
  sheet_tab: string;
  row_number: number;
  publish_date: string | null;
  day_of_week: string | null;
  format: string | null;
  post_contents: string | null;
  status: string | null;
  platform: string | null;
  media_link: string | null;
  additional_notes: string | null;
  content_item_id: string | null;
};

type WaitingResponse = {
  checked_at: string;
  timezone: string;
  count: number;
  rows: CalendarRow[];
};

type CreatedDraft = {
  content_item_id: string;
  review_queue_id: string;
};

export function MarketingCalendarPanel() {
  const [operatorCode, setOperatorCode] = useState('');
  const [rows, setRows] = useState<CalendarRow[]>([]);
  const [message, setMessage] = useState('Enter operator code and refresh to load marketing calendar rows waiting for content.');
  const [createdDraft, setCreatedDraft] = useState<CreatedDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const [workingId, setWorkingId] = useState('');

  async function refresh() {
    setLoading(true);
    setCreatedDraft(null);
    setMessage('Loading waiting marketing calendar rows...');

    try {
      const response = await fetch('/api/marketing-calendar-waiting', {
        method: 'GET',
        headers: { 'x-ui-access-code': operatorCode }
      });
      const data: WaitingResponse | { error?: string } = await response.json();
      if (!response.ok) throw new Error('error' in data ? data.error : 'Marketing calendar load failed');
      const result = data as WaitingResponse;
      setRows(result.rows ?? []);
      setMessage(`${result.count} waiting marketing calendar row(s) loaded.`);
    } catch (error) {
      setRows([]);
      setMessage(error instanceof Error ? error.message : 'Unknown marketing calendar error');
    } finally {
      setLoading(false);
    }
  }

  async function createDraft(rowId: string) {
    setWorkingId(rowId);
    setCreatedDraft(null);
    setMessage('Creating draft content item and review queue row...');

    try {
      const response = await fetch('/api/create-calendar-content-item', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-ui-access-code': operatorCode
        },
        body: JSON.stringify({ marketing_calendar_row_id: rowId })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Draft creation failed');
      setRows((current) => current.filter((row) => row.id !== rowId));
      setCreatedDraft({ content_item_id: data.content_item_id, review_queue_id: data.review_queue_id });
      setMessage('Draft content item created. Copy the content_item_id below and paste it into Content Editor. No Xyla handoff or publishing occurred.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unknown draft creation error');
    } finally {
      setWorkingId('');
    }
  }

  return (
    <div className="module marketing-panel">
      <h2>Marketing calendar intake</h2>
      <div className="form-grid compact">
        <input
          value={operatorCode}
          onChange={(event) => setOperatorCode(event.target.value)}
          placeholder="Operator code"
          type="password"
          className="field"
        />
        <button type="button" onClick={refresh} disabled={loading} className="primary-button status-button">
          {loading ? 'Loading...' : 'Refresh calendar'}
        </button>
      </div>
      <div className="status-muted">{message}</div>

      {createdDraft ? (
        <div className="copy-box">
          <strong>Created content_item_id</strong>
          <div className="copy-row">
            <code>{createdDraft.content_item_id}</code>
            <CopyButton text={createdDraft.content_item_id} />
          </div>
          <p>Copy this ID into the Content Editor panel to edit the draft before review.</p>
        </div>
      ) : null}

      {rows.length > 0 ? (
        <div className="agent-list latest-runs">
          {rows.map((row) => (
            <div key={row.id} className="agent-card marketing-card">
              <strong>{row.post_contents ?? row.additional_notes ?? row.format ?? 'Calendar row'}</strong>
              <p>{row.publish_date ?? 'date pending'} • {row.platform ?? 'platform pending'} • {row.format ?? 'format pending'}</p>
              <p>Sheet: {row.sheet_tab} • Row {row.row_number}</p>
              <button
                type="button"
                onClick={() => createDraft(row.id)}
                disabled={workingId === row.id}
                className="quick-button"
              >
                {workingId === row.id ? 'Creating...' : 'Create draft for review'}
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
