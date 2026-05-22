# Slack Command Layer

Channel: #all-xps-intelligence-system

Slack is the fast-response command layer for EWL pipeline alerts.

## Purpose

Use Slack for alerts, approvals, hot leads, content-ready notices, automation errors, and daily priorities.

## Alert Types

- Daily priorities
- Content ready for review
- Content approved for Xyla
- Hot lead
- Shopify event
- Social performance winner
- Automation error
- Human approval needed

## Human Approval Rules

Slack can notify and summarize. Final approval remains in the admin system or source app.

## Do Not Automate

- Price changes
- Product claims
- Safety claims
- Warranty claims
- Student story publication
- Public dispute replies
- Paid ad launch

## V0 Checklist

1. Create Slack app.
2. Enable incoming webhooks.
3. Add webhook to #all-xps-intelligence-system.
4. Store webhook URL in Vercel as SLACK_WEBHOOK_URL.
5. Add Slack helper in lib/slack.ts.
6. Add alert endpoint in app/api/slack-alert/route.ts.
7. Trigger alerts from calendar, review, Xyla, Shopify, and error workflows.
