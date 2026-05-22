type AgentMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type AgentRequest = {
  agentName: string;
  task: string;
  context?: string;
  model?: string;
};

export async function runAgentCommand(input: AgentRequest) {
  const apiKey = process.env.AI_GATEWAY_API_KEY || process.env.OPENAI_API_KEY;
  const usingGateway = Boolean(process.env.AI_GATEWAY_API_KEY);

  if (!apiKey) {
    throw new Error('Missing AI_GATEWAY_API_KEY or OPENAI_API_KEY');
  }

  const baseUrl = usingGateway ? 'https://ai-gateway.vercel.sh/v1' : 'https://api.openai.com/v1';
  const model = input.model || (usingGateway ? 'openai/gpt-5.5' : 'gpt-5.5');

  const messages: AgentMessage[] = [
    {
      role: 'system',
      content: [
        'You are an EWL Hyperdrive OS workflow agent.',
        'Primary timezone: America/New_York.',
        'GitHub governs system truth.',
        'Supabase stores state.',
        'Vercel runs the agent layer.',
        'Shopify owns conversion.',
        'Slack is the fast-response command layer.',
        'Intelligence OS scores and validates.',
        'AutoBuilder OS creates build packets.',
        'Do not execute irreversible actions. Return drafts, scores, routes, alerts, and approval requirements.'
      ].join('\n')
    },
    {
      role: 'user',
      content: [
        `Agent: ${input.agentName}`,
        `Task: ${input.task}`,
        input.context ? `Context:\n${input.context}` : ''
      ].filter(Boolean).join('\n\n')
    }
  ];

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AI request failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  const output = data?.choices?.[0]?.message?.content ?? '';

  return {
    output,
    provider: usingGateway ? 'vercel_ai_gateway' : 'openai_fallback',
    model
  };
}
