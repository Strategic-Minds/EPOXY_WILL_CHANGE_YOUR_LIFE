'use client';

import { useState } from 'react';
import { CopyButton } from './CopyButton';

type ReviewItem = {
  id: string;
  content_item_id: string;
  review_type: string | null;
  risk_category: string | null;
  reason: string | null;
  owner: string | null;
  status: string;
  created_at: string;
  content_items?: {
    id: string;
    platform: string | null;
    content_type: string | null;
    hook: string | null;
    caption: string | null;
    script: string | null;
    cta: string | null;
    landing_page: string | null;
    risk_score: number | null;
    review_status: string | null;
    xyla_ready: boolean | null;
    scheduled_at: string | null;
  } | null;
};

type ReviewResponse = {
  checked_at: string;
  timezone: string;
  count: number;
  items: ReviewItem[];
};

type ReviewQueuePanelProps = {
  operatorCode: string;
};

export function ReviewQueuePanel({ operatorCode }: ReviewQueuePanelProps) {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [message, setMessage] = useState('Use the Operator Session field above, then refresh to load pending review items.');
  const [loading, setLoading] = useState(false);
  const [workingId, setWorkingId] = useState('');

  async function refresh() {
    setLoading(true);
    setMessage('Loading pending review items...');

    try {
      const response = await fetch('/api/review-queue-items', {
        method: 'GET',
        headers: { 'x-ui-access-code': operatorCode }
      });
      const data: ReviewResponse | { error?: string } = await response.json();
      if (!response.ok) throw new Error('error' in data ? data.error : 'Review queue load failed');
      const result = data as ReviewResponse;
      setItems(result.items ?? []);
      setMessage(`${result.count} pending review item(s) loaded. Copy a content_item_id into Content Editor when edits are needed.`);
    } catch (error) {
      setItems([]);
      setMessage(error instanceof Error ? error.message : 'Unknown review queue error');
    } finally {
      setLoading(false);
    }
  }

  async function decide(reviewId: string, decision: 'approve' | 'reject') {
    setWorkingId(reviewId);
    setMessage(decision === 'approve' ? 'Approving review item internally...' : 'Rejecting review item internally...');

    try {
      const route = decision === 'approve' ? '/api/approve-review-item' : '/api/reject-review-item';
      const response = await fetch(route, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-ui-access-code': operatorCode
        },
        body: JSON.stringify({ review_id: reviewId })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Review decision failed');
      setItems((current) => current.filter((item) => item.id !== reviewId));
      setMessage(decision === 'approve'
        ? 'Approved internally. If risk score was safe, item was queued for Xyla handoff only. No publishing occurred.'
        : 'Rejected internally. No publishing occurred.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unknown review decision error');
    } finally {
      setWorkingId('');
    }
  }

  return (
    <div className="module review-panel">
      <h2>Review queue</h2>
      <button type="button" onClick={refresh} disabled={loading || !operatorCode} className="primary-button status-button full-width-button">
        {loading ? 'Loading...' : 'Refresh reviews'}
      </button>
      <div className="status-muted">{message}</div>

      {items.length > 0 ? (
        <div className="agent-list latest-runs">
          {items.map((item) => {
            const content = Array.isArray(item.content_items) ? item.content_items[0] : item.content_items;
            const riskScore = Number(content?.risk_score ?? 999);
            const safe = riskScore <= 2;
            return (
              <div key={item.id} className="agent-card review-card">
                <strong>{content?.hook ?? item.review_type ?? 'Review item'}</strong>
                <div className="copy-box compact-copy">
                  <span>content_item_id</span>
                  <div className="copy-row">
                    <code>{item.content_item_id}</code>
                    <CopyButton text={item.content_item_id} />
                  </div>
                </div>
                <p>{content?.platform ?? 'platform pending'} • {content?.content_type ?? 'type pending'} • risk {riskScore}</p>
                <p>{item.reason ?? content?.caption ?? 'Review reason pending'}</p>
                <p>CTA: {content?.cta ?? 'CTA pending'} → {content?.landing_page ?? 'Landing page pending'}</p>
                <div className="button-row review-actions">
                  <button
                    type="button"
                    onClick={() => decide(item.id, 'approve')}
                    disabled={workingId === item.id || !safe || !operatorCode}
                    className="quick-button"
                  >
                    {safe ? 'Approve safe handoff' : 'Risk too high'}
                  </button>
                  <button
                    type="button"
                    onClick={() => decide(item.id, 'reject')}
                    disabled={workingId === item.id || !operatorCode}
                    className="quick-button"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
