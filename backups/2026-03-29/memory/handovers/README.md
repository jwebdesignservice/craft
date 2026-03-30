# Handovers Directory

This directory stores handover documents created before context resets (/compact or /reset).

## Purpose
Handovers ensure continuity across resets by capturing:
- Current task and goal
- Progress (completed, in progress, blocked)
- Important context and decisions
- Next steps
- External state (GitHub, deployments, etc.)

## File Naming
Format: `YYYY-MM-DD-HHmm.md` (e.g., `2026-03-12-1534.md`)

For sub-agents: `subagent-<name>-YYYY-MM-DD-HHmm.md`

## Retention
- Last 7 days: Keep all handovers
- 8-30 days: Keep one per day (most recent)
- 30+ days: Archive or delete

## Usage
See `HANDOVER-PROTOCOL.md` for complete protocol and templates.
