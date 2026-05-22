# Vercel AI Gateway

Vercel AI Gateway is the primary model routing layer for EWL Hyperdrive OS.

## Environment

Set in Vercel:

- AI_GATEWAY_API_KEY

Optional fallback only:

- OPENAI_API_KEY

## Flow

Vercel Function -> AI Gateway -> Agent Output -> Supabase -> Slack or Admin Review.

## Agent Uses

- Executive Assistant Agent
- Content Packet Agent
- Intelligence OS Agent
- AutoBuilder OS Agent
- GitHub Architect Agent
- Shopify Conversion Agent
- Slack Command Agent
- SEO Agent

## Operating Rule

The agent layer may draft, summarize, score, inspect, route, and alert. Human approval is required before public posting, live deployment, billing changes, product claims, pricing claims, warranty language, safety language, customer disputes, or destructive data changes.
