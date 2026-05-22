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
          context: 'Request originated from the EWL v0-style admin UI.'
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
    <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
      <label className="text-xs uppercase tracking-[0.2em] text-neutral-500">Command input</label>
      <input
        value={operatorCode}
        onChange={(event) => setOperatorCode(event.target.value)}
        placeholder="Operator code"
        type="password"
        className="mt-3 w-full rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-neutral-100 outline-none placeholder:text-neutral-600"
      />
      <textarea
        value={task}
        onChange={(event) => setTask(event.target.value)}
        placeholder="Ask the Executive Assistant Agent what to inspect, summarize, route, or prepare."
        className="mt-3 min-h-28 w-full rounded-2xl border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-100 outline-none placeholder:text-neutral-600"
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => runCommand()}
          disabled={loading}
          className="rounded-full bg-amber-500 px-4 py-2 text-xs font-medium text-neutral-950 disabled:opacity-50"
        >
          {loading ? 'Running...' : 'Run agent'}
        </button>
        {quickCommands.map((command) => (
          <button
            key={command}
            type="button"
            onClick={() => runCommand(command)}
            disabled={loading}
            className="rounded-full border border-neutral-700 px-3 py-2 text-xs text-neutral-300 hover:border-amber-400 hover:text-amber-300 disabled:opacity-50"
          >
            {command}
          </button>
        ))}
      </div>
      <div className="mt-4 min-h-32 whitespace-pre-wrap rounded-2xl border border-neutral-800 bg-neutral-900 p-4 text-sm leading-6 text-neutral-300">
        {output || 'Agent output will appear here. No public publishing, billing, deployment, or destructive action is executed from this panel.'}
      </div>
    </div>
  );
}
