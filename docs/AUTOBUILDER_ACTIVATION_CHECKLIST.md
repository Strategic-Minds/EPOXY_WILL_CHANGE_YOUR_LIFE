# AutoBuilder Activation Checklist

Primary timezone: America/New_York.

## Current Status

- Frontend chat is live.
- UI route is protected with UI_ACCESS_CODE.
- AutoBuilder endpoint exists at /api/autobuilder-loop.
- Endpoint only inspects Supabase queues, summarizes counts, and sends Slack alerts.
- No public publishing, billing, deployment, pricing, claims, warranty, safety, or destructive action is executed.

## Required Cron Configuration

Add this to vercel.json before controlled activation:

```json
{
  "path": "/api/autobuilder-loop",
  "schedule": "*/5 * * * *"
}
```

Keep existing jobs:

```json
{
  "path": "/api/daily-command",
  "schedule": "0 11 * * *"
}
```

```json
{
  "path": "/api/metrics-sync",
  "schedule": "0 0 * * *"
}
```

## Required Vercel Env Vars

- CRON_SECRET
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- SLACK_WEBHOOK_URL
- UI_ACCESS_CODE
- AI_GATEWAY_API_KEY

## Pre-Activation Tests

1. Test frontend chat with correct UI_ACCESS_CODE.
2. Confirm agent_runs row is created in Supabase.
3. Confirm Slack alerts work.
4. Manually test /api/autobuilder-loop with CRON_SECRET.
5. Confirm the response only returns counts and summary.
6. Confirm no irreversible action executes.

## Human Approval Boundary

Human approval is required for:

- publishing
- deployment
- billing
- pricing
- product claims
- warranty claims
- safety claims
- student stories
- destructive database actions
- customer commitments

## Activation Decision

Activate the 5-minute cron only after all pre-activation tests pass.
