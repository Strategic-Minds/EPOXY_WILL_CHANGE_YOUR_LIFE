'use client';

import { useState } from 'react';
import { ActivityLogPanel } from './ActivityLogPanel';
import { ContentEditorPanel } from './ContentEditorPanel';
import { DashboardStatus } from './DashboardStatus';
import { MarketingCalendarPanel } from './MarketingCalendarPanel';
import { ReviewQueuePanel } from './ReviewQueuePanel';
import { XylaQueuePanel } from './XylaQueuePanel';

export function OperatorCodeProvider() {
  const [operatorCode, setOperatorCode] = useState('');

  return (
    <>
      <div className="module operator-session-panel">
        <h2>Operator session</h2>
        <input
          value={operatorCode}
          onChange={(event) => setOperatorCode(event.target.value)}
          placeholder="Enter operator code for dashboard panels"
          type="password"
          className="field"
        />
        <div className="status-muted">
          Stored in browser memory only for this page session. Not saved to localStorage. AgentChat keeps its separate operator field.
        </div>
      </div>

      <DashboardStatus operatorCode={operatorCode} />
      <ActivityLogPanel operatorCode={operatorCode} />
      <ContentEditorPanel operatorCode={operatorCode} />
      <MarketingCalendarPanel operatorCode={operatorCode} />
      <ReviewQueuePanel operatorCode={operatorCode} />
      <XylaQueuePanel operatorCode={operatorCode} />
    </>
  );
}
