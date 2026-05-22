const primaryTimezone = 'America/New_York';

export default function HomePage() {
  const nowNewYork = new Intl.DateTimeFormat('en-US', {
    timeZone: primaryTimezone,
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(new Date());

  return (
    <main>
      <h1>EWL Hyperdrive OS</h1>
      <p>AI content, commerce, review, and social execution command center.</p>
      <section>
        <h2>Timezone Lock</h2>
        <p>Primary timezone: <code>{primaryTimezone}</code></p>
        <p>Current New York time: {nowNewYork}</p>
        <p>Vercel cron remains UTC. Calendar, Sheet, admin display, and Xyla scheduling use New York time.</p>
      </section>
      <section>
        <h2>Locked Stack</h2>
        <ul>
          <li>ChatGPT Business: execution brain</li>
          <li>GitHub: source of truth</li>
          <li>Supabase: operating database</li>
          <li>Vercel: admin dashboard</li>
          <li>Shopify: conversion layer</li>
          <li>Xyla: social execution layer</li>
        </ul>
      </section>
      <section>
        <h2>Core Queues</h2>
        <ul>
          <li>Asset Intake</li>
          <li>Content Drafts</li>
          <li>Review Queue</li>
          <li>Xyla Queue</li>
          <li>Metrics</li>
        </ul>
      </section>
    </main>
  );
}
