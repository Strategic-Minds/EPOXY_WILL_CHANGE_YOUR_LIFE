'use client';

import { useState } from 'react';

const quickCommands = [
  'Run daily command',
  'Find approval blockers',
  'Create content from calendar',
  'Check Xyla-ready queue',
  'Summarize AutoBuilder loop',
  'Prepare Shopify CTA fixes'
];

export function AgentChat() {
  const [task, setTask] = useState('');
  const [operatorCode, setOperatorCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  async function runCommand(command?: string) {
    const activeTask = command ?? task;
    if (!activeTask.trim()) return;

    setLoading(true);
    setOutput('Running Executive Assistant Agent...');

    try {
      const response = await fetch('/api/ui-agent-command', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          agent_name: 'Executive Assistant Agent',
          task: activeTask,
          operator_code: operatorCode,
          context: 'Request originated from the EWL v0 template command UI.'
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Agent command failed');
      setOutput(data.output ?? 'No output returned.');
    } catch (error) {
      setOutput(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="composer">
      <label className="composer-label">Command input</label>
      <div className="form-grid">
        <input
          value={operatorCode}
          onChange={(event) => setOperatorCode(event.target.value)}
          placeholder="Operator code"
          type="password"
          className="field"
        />
        <textarea
          value={task}
          onChange={(event) => setTask(event.target.value)}
          placeholder="Ask the Executive Assistant Agent what to inspect, summarize, route, or prepare."
          className="textarea"
        />
      </div>
      <div className="button-row">
        <button type="button" onClick={() => runCommand()} disabled={loading} className="primary-button">
          {loading ? 'Running...' : 'Run agent'}
        </button>
        {quickCommands.map((command) => (
          <button key={command} type="button" onClick={() => runCommand(command)} disabled={loading} className="quick-button">
            {command}
          </button>
        ))}
      </div>
      <div className="output">
        {output || 'Agent output will appear here. No public publishing, billing, deployment, or destructive action is executed from this panel.'}
      </div>
    </div>
  );
}
