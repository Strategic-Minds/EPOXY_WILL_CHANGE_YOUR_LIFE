# Marketing Calendar Pipeline

Primary timezone: America/New_York.

The marketing department Google Sheet is the content calendar spine.

## Source Sheet

Sheet ID: 1tXHltrxwPw9FstzxN-hqBIvEEi2yqN8gEpSI_Xe-m-8
Tab: June_2026

## Flow

Marketing Sheet row -> marketing_calendar_rows -> content_items -> review_queue -> xyla_queue.

## Original Sheet Columns

- Publish Date
- Day of week
- Format
- Post Contents
- Status
- Platform
- Media Link
- Additional Notes

## System Enrichment

The system may add hooks, captions, scripts, CTA, landing page, risk score, review status, Xyla status, published URL, metrics, and performance notes.

## Rules

- Preserve the marketing team's original schedule.
- Do not erase original columns.
- Store publish_date as New York business date.
- Store timestamps in Supabase as timestamptz.
- Only reviewed content should move to Xyla.
