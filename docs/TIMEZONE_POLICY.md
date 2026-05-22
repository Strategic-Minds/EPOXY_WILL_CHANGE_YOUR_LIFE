# Timezone Policy

Primary timezone: America/New_York.

## Rules

- Google Sheet timezone: America/New_York.
- Google Calendar publishing schedule: America/New_York.
- Admin UI default display timezone: America/New_York.
- Xyla publishing windows: enter and review in America/New_York.
- Supabase timestamp columns: use timestamptz.
- Vercel cron schedules: UTC only, with documented New York conversion.

## Daily Cadence

| New York Time | UTC During EDT | Purpose |
|---|---:|---|
| 7:00 AM | 11:00 UTC | Daily command |
| 12:30 PM | 16:30 UTC | Production check |
| 7:00 PM | 23:00 UTC | Review and metrics |

## Note

New York changes between EST and EDT. Review UTC cron mappings when daylight saving time changes.
