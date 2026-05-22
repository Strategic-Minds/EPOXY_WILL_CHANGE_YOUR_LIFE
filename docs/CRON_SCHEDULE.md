# Cron Schedule

Vercel cron expressions are UTC.

Primary business timezone: America/New_York.

## Active Cron Jobs

| Endpoint | Vercel UTC Cron | New York Meaning During EDT | Purpose |
|---|---|---|---|
| /api/daily-command | 0 11 * * * | 7:00 AM New York | Daily command run |
| /api/metrics-sync | 0 0 * * * | 8:00 PM prior day New York during EDT | Metrics sync placeholder |

## Rule

Document every Vercel cron in both UTC and New York time before deployment.

## Daylight Saving

Review cron mappings when New York switches between EST and EDT.
