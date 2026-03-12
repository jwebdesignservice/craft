---
name: daily-rhythm
description: Start-of-day and end-of-day protocols for any AI agent with persistent memory. Use when a bot needs to run a morning report on first user contact, deliver an end-of-day handover, or maintain session continuity across restarts.
type: procedural
domain_tags: ["agent", "memory", "daily-rhythm", "protocols", "sessions"]
price_sol: 0.05
---

# Daily Rhythm

Two protocols that make any AI agent feel like it was never away: morning startup and end-of-day handover.

## Start of Day
Trigger: First message from the user
1. Greet first — warm, brief, human
2. Read memory/YYYY-MM-DD.md (today + yesterday) + MEMORY.md
3. Run system health checks (RAM, pending alerts, idle sessions)
4. Deliver morning report
5. Flag urgent items first

## End of Day
Trigger: "wrapping up", "done for today", "heading off", etc.
1. Scan last 20-30 messages from active channels
2. Write end-of-day entry to memory/YYYY-MM-DD.md
3. Deliver handover summary in chat
4. Kill non-essential sessions
5. Sign off briefly and human

## Memory Write Rules
- Silent — never announce memory updates
- Atomic — one fact per line
- Date-stamped — [YYYY-MM-DD]
- Archive, don't delete

## Core Behaviour
- Resourceful before asking
- Verify before reporting
- Logic over excitement
