# EWL Hyperdrive OS — Automation Gateway Lock

## Decision

EWL Hyperdrive OS is no longer being treated as a public-facing application, polished SaaS interface, or customer-visible product.

It is a private automation gateway for Jeremy and ChatGPT operators.

The frontend only needs to be functional enough to submit protected commands, inspect queues, trigger safe workflows, and review outputs.

Do not spend more build cycles on cosmetic UI unless a functional blocker exists.

## Primary Mission

Give ChatGPT-controlled operators the fastest possible way to create, inspect, route, and prepare:

- systems
- automations
- workflows
- content packets
- social posts
- images
- videos
- HeyGen avatar/video prompts
- Xyla handoff packets
- Shopify conversion assets
- GitHub build packets
- Vercel deployments
- Supabase records
- Slack alerts
- Google Drive documents
- Google Sheets operating rows
- lead generation workflows
- business operating systems

## Source of Truth

1. GitHub governs system code, docs, workflow lock, and build packets.
2. Supabase stores operating state, queues, logs, agent runs, review records, and handoff records.
3. Vercel runs API routes, cron jobs, private admin UI, and AI Gateway calls.
4. Drive stores source documents, media assets, schedules, content plans, training material, and operating documents.
5. Shopify owns public conversion, products, collections, landing pages, and checkout.
6. Slack is the fast-response command and alert layer.
7. HeyGen creates avatar/video output only from approved prompts or approved source scripts.
8. Xyla receives approved content only.

## What The Gateway Must Do

The private gateway must allow an operator to submit a command and receive a structured execution packet.

Every command should classify into one or more of these lanes:

| Lane | Purpose | Output |
|---|---|---|
| SYSTEM_BUILD | Build apps, routes, schemas, docs, dashboards, automations | GitHub build packet |
| CONTENT | Create posts, scripts, captions, hooks, carousels, shorts | Content packet |
| VIDEO | Create HeyGen/InVideo/CapCut-ready video plan | Video packet |
| IMAGE | Create image generation prompt or asset spec | Image packet |
| SHOPIFY | Create product/collection/page/CTA/conversion assets | Shopify packet |
| SOCIAL | Create social schedule, posting plan, engagement scripts | Social packet |
| LEAD_GEN | Create funnels, forms, outreach, CRM actions | Lead packet |
| OPERATIONS | Create SOPs, checklists, role workflows, calendar/tasks | Ops packet |
| RESEARCH | Inspect sources and summarize findings | Research packet |
| REVIEW | Review risk, claims, safety, pricing, warranties, compliance | Approval packet |

## Non-Negotiable Safety Rules

The gateway may prepare but must not execute irreversible actions without approval.

Human approval is required before:

- public publishing
- Xyla publishing
- Shopify product activation
- pricing changes
- discount creation
- billing actions
- deployment activation beyond safe preview/repo commit flow
- destructive database changes
- customer commitments
- student/customer stories
- income claims
- warranty claims
- safety claims
- product/spec claims
- legal/compliance claims
- mass email/SMS/social blast

## Operator Command Format

Preferred command input:

```text
OBJECTIVE:
[What needs to be created or done]

SOURCE:
[Drive link, Sheet, GitHub path, Shopify item, Slack thread, uploaded file, or none]

OUTPUT TYPE:
[system | automation | content | video | image | shopify | social | lead_gen | operations | research | review]

DESTINATION:
[GitHub | Supabase | Drive | Shopify | Slack | HeyGen | Xyla | Vercel | Chat only]

APPROVAL LEVEL:
[draft_only | approval_required | safe_to_commit | safe_to_queue]

CONSTRAINTS:
[Brand, claims, safety, platform, time, audience, asset limits]
```

## Required Gateway API Direction

Stop building visual panels unless they remove friction.

Next priority is API and automation depth:

1. `/api/gateway-command`
   - accepts a structured operator request
   - classifies lane
   - runs risk scoring
   - creates an execution packet
   - stores packet in Supabase
   - alerts Slack when priority or approval needed
   - does not publish

2. `gateway_packets` Supabase table
   - stores normalized execution packets
   - supports content, system, video, image, Shopify, social, lead, ops, research, review packets

3. `/api/execute-safe-packet`
   - only executes safe actions
   - requires UI_ACCESS_CODE
   - respects approval level
   - no irreversible actions

4. `/api/create-build-packet`
   - converts a request into GitHub-ready implementation instructions
   - can create docs/issues/files only when allowed

5. `/api/create-content-packet`
   - creates hooks, captions, scripts, CTA, SEO, hashtags, thumbnails
   - routes to review_queue

6. `/api/create-video-packet`
   - creates HeyGen/InVideo/CapCut-ready scripts and scene specs
   - does not submit video generation until approved

7. `/api/create-image-packet`
   - creates image prompts and asset instructions
   - does not publish or attach to Shopify until approved

## Frontend Rule

The frontend should become a simple command terminal:

- one operator code
- one command input
- one output window
- latest packets
- approval queue
- emergency stop / safety status

Everything else is secondary.

## Success Definition

The system is successful when Jeremy can tell ChatGPT:

> Build me this system.
> Create this automation.
> Turn this Drive folder into content.
> Make this video packet.
> Create this Shopify asset.
> Route this to Xyla.
> Alert Slack.
> Save it to GitHub.
> Prepare it for approval.

And the gateway produces the correct structured packet fast, safely, and repeatably.
