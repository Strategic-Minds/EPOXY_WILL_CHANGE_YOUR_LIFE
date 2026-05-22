'use client';

import { useState } from 'react';

type ContentItem = {
  id: string;
  platform: string | null;
  content_type: string | null;
  hook: string | null;
  caption: string | null;
  script: string | null;
  thumbnail_text: string | null;
  cta: string | null;
  landing_page: string | null;
  seo_keywords: string[] | null;
  hashtags: string[] | null;
  risk_score: number | null;
  review_status: string | null;
  xyla_ready: boolean | null;
  status: string | null;
};

export function ContentEditorPanel() {
  const [operatorCode, setOperatorCode] = useState('');
  const [contentItemId, setContentItemId] = useState('');
  const [item, setItem] = useState<ContentItem | null>(null);
  const [message, setMessage] = useState('Enter operator code and content item ID to load an editable draft or rejected item.');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadItem() {
    if (!contentItemId.trim()) return;
    setLoading(true);
    setMessage('Loading content item...');

    try {
      const params = new URLSearchParams({ content_item_id: contentItemId.trim() });
      const response = await fetch(`/api/content-item-detail?${params.toString()}`, {
        method: 'GET',
        headers: { 'x-ui-access-code': operatorCode }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Content item load failed');
      setItem(data.item);
      setMessage('Content item loaded. Only draft or rejected items can be saved from this panel.');
    } catch (error) {
      setItem(null);
      setMessage(error instanceof Error ? error.message : 'Unknown content item error');
    } finally {
      setLoading(false);
    }
  }

  function updateField(field: keyof ContentItem, value: string) {
    if (!item) return;
    setItem({ ...item, [field]: value });
  }

  async function saveDraft() {
    if (!item) return;
    setSaving(true);
    setMessage('Saving draft updates...');

    try {
      const response = await fetch('/api/update-content-draft', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-ui-access-code': operatorCode
        },
        body: JSON.stringify({
          content_item_id: item.id,
          hook: item.hook ?? '',
          caption: item.caption ?? '',
          script: item.script ?? '',
          thumbnail_text: item.thumbnail_text ?? '',
          cta: item.cta ?? '',
          landing_page: item.landing_page ?? '',
          seo_keywords: item.seo_keywords ?? [],
          hashtags: item.hashtags ?? []
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Draft save failed');
      setItem({ ...item, review_status: 'draft', xyla_ready: false, status: 'draft' });
      setMessage('Draft saved. Review status reset to draft. Xyla readiness disabled. No publishing occurred.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unknown draft save error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="module content-editor-panel">
      <h2>Content editor</h2>
      <div className="form-grid compact">
        <input
          value={operatorCode}
          onChange={(event) => setOperatorCode(event.target.value)}
          placeholder="Operator code"
          type="password"
          className="field"
        />
        <button type="button" onClick={loadItem} disabled={loading} className="primary-button status-button">
          {loading ? 'Loading...' : 'Load item'}
        </button>
      </div>
      <input
        value={contentItemId}
        onChange={(event) => setContentItemId(event.target.value)}
        placeholder="content_item_id"
        className="field editor-id-field"
      />
      <div className="status-muted">{message}</div>

      {item ? (
        <div className="editor-fields">
          <div className="status-row latest-row">
            <span>Status</span>
            <strong>{item.review_status ?? 'unknown'} • Xyla {item.xyla_ready ? 'ready' : 'not ready'}</strong>
          </div>
          <input value={item.hook ?? ''} onChange={(event) => updateField('hook', event.target.value)} placeholder="Hook" className="field" />
          <textarea value={item.caption ?? ''} onChange={(event) => updateField('caption', event.target.value)} placeholder="Caption" className="textarea" />
          <textarea value={item.script ?? ''} onChange={(event) => updateField('script', event.target.value)} placeholder="Script" className="textarea" />
          <input value={item.thumbnail_text ?? ''} onChange={(event) => updateField('thumbnail_text', event.target.value)} placeholder="Thumbnail text" className="field" />
          <input value={item.cta ?? ''} onChange={(event) => updateField('cta', event.target.value)} placeholder="CTA" className="field" />
          <input value={item.landing_page ?? ''} onChange={(event) => updateField('landing_page', event.target.value)} placeholder="Landing page" className="field" />
          <input
            value={(item.seo_keywords ?? []).join(', ')}
            onChange={(event) => setItem({ ...item, seo_keywords: event.target.value.split(',').map((x) => x.trim()).filter(Boolean) })}
            placeholder="SEO keywords, comma separated"
            className="field"
          />
          <input
            value={(item.hashtags ?? []).join(', ')}
            onChange={(event) => setItem({ ...item, hashtags: event.target.value.split(',').map((x) => x.trim()).filter(Boolean) })}
            placeholder="Hashtags, comma separated"
            className="field"
          />
          <button type="button" onClick={saveDraft} disabled={saving} className="primary-button status-button">
            {saving ? 'Saving...' : 'Save draft only'}
          </button>
        </div>
      ) : null}
    </div>
  );
}
