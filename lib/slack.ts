type SlackAlert = {
  title: string;
  message: string;
  level?: 'info' | 'success' | 'warning' | 'error';
  fields?: Record<string, string | number | null | undefined>;
};

export async function sendSlackAlert(alert: SlackAlert) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return { sent: false, reason: 'missing_webhook' };

  const emoji = {
    info: ':information_source:',
    success: ':white_check_mark:',
    warning: ':warning:',
    error: ':rotating_light:'
  }[alert.level ?? 'info'];

  const fieldLines = Object.entries(alert.fields ?? {})
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `*${key}:* ${value}`)
    .join('\n');

  const payload = {
    text: `${emoji} ${alert.title}`,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: `${emoji} ${alert.title}` } },
      { type: 'section', text: { type: 'mrkdwn', text: alert.message } },
      ...(fieldLines ? [{ type: 'section', text: { type: 'mrkdwn', text: fieldLines } }] : [])
    ]
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return { sent: response.ok, status: response.status };
}
