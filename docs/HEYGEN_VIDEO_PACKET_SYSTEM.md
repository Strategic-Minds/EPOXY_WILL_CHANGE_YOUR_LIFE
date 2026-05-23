# HeyGen Video Packet System

## Purpose

HeyGen is the video render layer. The gateway creates packet drafts first. Rendering happens later after approval.

## Packet Fields

- batch_id
- title
- audience
- platform
- hook
- script
- scene_notes
- avatar_direction
- voice_direction
- caption
- CTA
- landing_page
- risk_score
- approval_status
- render_status

## Operating Rule

The Creative Batch Factory creates HeyGen packets only.

It does not call HeyGen automatically.

## Approval Lock

Human approval is required before rendering or publishing any video.
