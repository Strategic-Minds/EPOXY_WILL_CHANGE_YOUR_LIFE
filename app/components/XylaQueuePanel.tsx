'use client';

import { useState } from 'react';
import { CopyButton } from './CopyButton';

type XylaItem = {
  id: string;
  content_item_id: string;
  platform: string | null;
  post_type: string | null;
  caption: string | null;
  asset_url: string | null;
  cta: string | null;
  landing_page: string | null;
  handoff_status: string;
  scheduled_at: string | null;
  created_at: string;
  content_items?: {
    id: string;
    platform: string | null;
    content_type: string | null;
    hook: string | null;
    caption: string | null;
    cta: string | null;
    landing_page: string | null;
    risk_score: number | null;
    review_status: string | null;
    xyla_ready: boolean | null;
    status: string | null;
    scheduled_at: string | null;
  } | null;
};

type ReadyItemsResponse = {
  checked_at: string;
  timezone: string;
  count: number;
  items: XylaItem[];
};

export function XylaQueuePanel() {
  const [operatorCode, setOperatorCode] = useState('');
  const [items, setItems] = useState<XylaItem[]>([]);
  const [message, setMessage] = useState('Enter operator code and refresh to load approved Xyla-ready items.');
  const [loading, setLoading] = useState(false);
  const [reviewingId, setReviewingId] = useState('');

  async function refresh() {
    setLoading(true);
    setMessage('Loading Xyla-ready items...');

    try {
      const response = await fetch('/api/xyla-ready-items', {
        method: 'GET',
        headers: { 'x-ui-access-code': operatorCode }
      });
      const data: ReadyItemsResponse | { error?: string } = await response.json();
      if (!response.ok) throw new Error('error' in data ? data.error : 'Xyla queue load failed');
      const result = data as ReadyItemsResponse;
      setItems(result.items ?? []);
      setMessage(`${result.count} approved Xyla-ready item(s) loaded. Copy content_item_id into Content Editor if edits are needed. No publishing performed.`);
    } catch (error) {
      setItems([]);
      setMessage(error instanceof Error ? error.message : 'Unknown Xyla queue error');
    } finally {
      setLoading(false);
    }
  }

  async function markReviewed(handoffId: string) {
    setReviewingId(handoffId);
    setMessage('Marking handoff reviewed internally...');

    try {
      const response = await fetch('/api/mark-xyla-handoff-reviewed', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-ui-access-code': operatorCode
        },
        body: JSON.stringify({ handoff_id: handoffId })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Review update failed');
      setItems((current) => current.filter((item) => item.id !== handoffId));
      setMessage('Marked reviewed internally. No Xyla publishing occurred. Slack alert sent.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unknown review update error');
    } finally {
      setReviewingId('');
    }
  }

  return (
    <div className="module xyla-panel">
      <h2>Xyla handoff gate</h2>
      <div className="form-grid compact">
        <input
          value={operatorCode}
          onChange={(event) => setOperatorCode(event.target.value)}
          placeholder="Operator code"
          type="password"
          className="field"
        />
        <button type="button" onClick={refresh} disabled={loading} className="primary-button status-button">
          {loading ? 'Loading...' : 'Refresh Xyla'}
        </button>
      </div>
      <div className="status-muted">{message}</div>

      {items.length > 0 ? (
        <div className="agent-list latest-runs">
          {items.map((item) => {
            const content = Array.isArray(item.content_items) ? item.content_items[0] : item.content_items;
            return (
              <div key={item.id} className="agent-card xyla-card">
                <strong>{content?.hook ?? item.post_type ?? 'Xyla-ready item'}</strong>
                <div className="copy-box compact-copy">
                  <span>content_item_id</span>
                  <div className="copy-row">
                    <code>{item.content_item_id}</code>
                    <CopyButton text={item.content_item_id} />
                  </div>
                </div>
                <p>{item.platform ?? 'platform pending'} • {item.post_type ?? 'post type pending'} • {item.handoff_status}</p>
                <p>{item.caption ?? content?.caption ?? 'Caption pending'}</p>
                <p>CTA: {item.cta ?? content?.cta ?? 'CTA pending'} → {item.landing_page ?? content?.landing_page ?? 'Landing page pending'}</p>
                <button
                  type="button"
                  onClick={() => markReviewed(item.id)}
                  disabled={reviewingId === item.id}
                  className="quick-button xyla-review-button"
                >
                  {reviewingId === item.id ? 'Marking...' : 'Mark reviewed only'}
                </button>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
