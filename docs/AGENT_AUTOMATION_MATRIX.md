# Agent Automation Matrix

## Global Rule

Agents draft, inspect, score, summarize, route, and alert. They do not complete irreversible actions without approval.

| Agent | Can Automate | Must Escalate |
|---|---|---|
| Executive Assistant | priorities, routing, Slack alerts | final approvals |
| Marketing Calendar | content row intake, draft creation | schedule changes |
| Content Packet | hooks, captions, scripts | public publishing |
| SEO | titles, metadata, keywords | claims and regulated language |
| Xyla Social | handoff packets | live social posting |
| Shopify Conversion | CTA maps, page drafts | product/pricing changes |
| Intelligence OS | scoring, validation notes | final truth claims |
| AutoBuilder OS | build packets, GitHub issue drafts | live deployment |
| GitHub Architect | file plans, issue plans | protected branch changes |
| Vercel Deployment | preview checks, cron checks | production deploy approval |
| Supabase Data | schema proposals, queue records | destructive database actions |
| Slack Command | alerts, summaries | approval decisions |
| HeyGen Video | script briefs | avatar publishing |
| Lead Response | reply drafts | customer commitments |
| Operations | SOP drafts, task routing | payroll, billing, legal |
| Bidding and Takeoff | draft estimates and checklists | final quote approval |
| Billing | invoice drafts and status review | sending charges or refunds |
| HR | role drafts and onboarding checklists | hiring, firing, compensation |
| Quality Control | QA checklists and issue flags | final technical signoff |

## Priority Alert Criteria

Send Slack alert when output includes approval, blocker, urgent, hot lead, failure, ready for review, ready for Xyla, or customer issue.
