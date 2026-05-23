# Hard Automation Safety Lock

## Active Rule

The EWL Hyperdrive OS automation gateway must not perform irreversible or public-facing actions without explicit human approval.

## Blocked Actions

The following actions are blocked by default:

- No public publishing
- No Xyla publishing
- No HeyGen rendering
- No image rendering
- No video rendering
- No Shopify changes
- No irreversible automation

## Allowed Automation

The system may perform draft-only and review-only work:

- create draft creative batches
- create draft image packets
- create draft video packets
- create draft HeyGen packets
- create draft Xyla packets
- read batch details
- approve packets internally
- queue approved packets for next review
- send Slack alerts
- store operating records in Supabase
- inspect deployment and queue status

## Approval Required Before Next Step

Human approval is required before:

- rendering any image
- rendering any video
- creating or rendering HeyGen videos
- sending content to Xyla for publishing
- publishing social posts
- changing Shopify products, pages, collections, pricing, discounts, inventory, or theme content
- sending mass email/SMS
- making product, pricing, warranty, safety, income, certification, student story, or customer commitment claims
- destructive database changes
- destructive GitHub or Vercel actions

## Safe Chain Status

Current allowed chain:

```text
/api/batch-factory
→ create draft packet rows

/api/creative-batch-detail
→ read packet batch

/api/approve-packet
→ set approval_status = approved

/api/queue-approved-packet
→ queue approved packet for next human-reviewed step
```

## Operating Purpose

This gateway exists to accelerate system building, content planning, creative packet creation, review, queueing, and Slack alerts. It does not publish, render, sell, change Shopify, or perform irreversible actions unless an explicit approval route is built and approved later.
