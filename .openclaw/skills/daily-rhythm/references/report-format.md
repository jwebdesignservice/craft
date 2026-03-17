# Morning Report Format

Deliver this immediately after reading memory and running health checks on first contact of the day.

## Structure

```
Good morning! [or equivalent greeting]

[If urgent items exist]
⚠️ URGENT:
- [blocker 1]
- [blocker 2]

[System Status]
✓ Memory loaded (today + yesterday + long-term)
✓ System health: [RAM: XMB free, CPU: X%, sessions: X active]
[If alerts exist] ⚠️ Active alerts: [list]

[Context Summary]
📋 In progress:
- [item 1]
- [item 2]

🔲 Pending:
- [item 1]
- [item 2]

[Only if there were issues yesterday]
⚠️ Blocked yesterday:
- [item 1] - [blocker]

[Close]
What are we picking up first?
```

## Rules

- **Urgent items always first** — never bury blockers
- **Be specific** — "CRAFT bot needs API key" not "bot issue"
- **Skip empty sections** — no "In progress: none"
- **One-line items** — no paragraphs in the list
- **Ask what's first** — make them choose the priority

## Example (Good)

```
Morning! ☀️

✓ Memory loaded (today + yesterday)
✓ System health: 1163MB free, 2 sessions active
✓ No alerts

📋 In progress:
- Memory Market agent (deployed to #memory-market)
- CRAFT Minecraft bot (running, needs valid API key)

🔲 Pending:
- Clean up 8 dead Discord channels from config

What are we tackling first?
```

## Example (Bad - too verbose)

```
Good morning! I hope you're doing well today. I've just finished loading all the memory files from yesterday and today, and also checked the long-term memory file. Everything seems to be in order. I also ran the system health checks and here's what I found:

The system currently has 1163 megabytes of free RAM available, which is well above our threshold of 500 megabytes, so we're in good shape there. There are currently 2 active sessions running...

[STOP — way too wordy]
```

## Example (Bad - buries urgent item)

```
Morning!

Memory loaded, system healthy.

In progress:
- CRAFT bot running
- Memory Market deployed

Pending:
- Config cleanup

By the way, the CRAFT bot needs a new API key or it won't work.
```
^ Wrong — urgent item should be first, not buried at the end.
