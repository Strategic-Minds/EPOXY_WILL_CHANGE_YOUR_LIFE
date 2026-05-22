# EPOXY WILL CHANGE YOUR LIFE - Hyperdrive OS

This repo is the operating source for the EWL content, commerce, admin, review, and automation stack.

## Locked Stack

- ChatGPT Business: execution brain
- GitHub: source of truth
- Supabase: operating database
- Vercel: admin dashboard, API routes, scheduled jobs
- Shopify: website, commerce, products, lead capture
- Shopify Flow: store automation
- Xyla: approved Shopify-native social autopilot
- Google Drive: asset vault
- Google Calendar: production and review rhythm
- Gmail and Contacts: outreach and story pipeline
- HeyGen, CapCut, InVideo, Photoshop, Adobe Express: production tools only

## Timezone Lock

Primary business timezone: America/New_York.

Google Sheets, Google Calendar, admin display logic, Xyla publishing windows, and daily operating cadence use New York time.

Vercel cron schedules remain UTC and must be documented with New York conversions.

Supabase stores timestamps as timestamptz.

## Prime Rule

Xyla executes approved content only. High-risk content requires human review before publishing.

## Initial Install Order

1. Run `supabase/migrations/0001_content_os.sql` in Supabase.
2. Add Vercel environment variables from `.env.example`.
3. Deploy the Vercel admin dashboard.
4. Connect Shopify and Shopify Flow webhooks to Vercel API routes.
5. Connect Xyla after Shopify has at least one active product with an image.
6. Keep Xyla in review mode until the first test period is complete.
