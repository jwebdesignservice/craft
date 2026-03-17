# End-of-Day Handover Format

## File Structure (`memory/YYYY-MM-DD.md`)

```markdown
# YYYY-MM-DD - Session Log

## Summary
[One-sentence summary of the day]

## Completed Today
- [x] Item 1 - outcome/result
- [x] Item 2 - outcome/result

## In Progress
- [ ] Item 1 - current state, next step
- [ ] Item 2 - current state, next step

## Blocked / Needs Attention
- [ ] Item 1 - what's blocking it, who/what is needed
- [ ] Item 2 - what's blocking it, who/what is needed

## Decisions Made
- [Decision 1] - rationale
- [Decision 2] - rationale

## For Tomorrow
- [ ] First priority
- [ ] Second priority

## Notes
- [Any context, lessons learned, or things to remember]
```

## Chat Handover (after writing the file)

Don't make them read the file. Deliver the key points directly:

```
Wrapping up:

✅ Done:
- [item 1]
- [item 2]

🔲 Open:
- [item 1] - [next step]

⚠️ Blocked:
- [item] - [blocker]

Tomorrow: Pick up [priority 1] first, then [priority 2]

Rest up 🤙
```

## Rules

- **Scan first, write second** — read recent channels before writing anything
- **Be specific on blockers** — "Needs API key" not "stuck"
- **One line per item** — no paragraphs
- **Next steps explicit** — "Pick up [X] first" not "continue work"
- **Human sign-off** — never formal ("Best regards" ✗)

## Example (Good File Entry)

```markdown
# 2026-02-26 - Session Log

## Summary
Fixed Discord connectivity, set up monitoring scripts, integrated memory protocol.

## Completed Today
- [x] Discord connectivity fix - removed bindings, now responds in all channels
- [x] Memory Market agent - deployed to #memory-market channel
- [x] System monitoring - RAM alerts + orphan server cleanup running every 20min
- [x] Memory protocol - MEMORY.md created, SOP updated with implicit triggers

## In Progress
- [ ] CRAFT Minecraft bot - running but needs valid Anthropic API key to generate commands

## Blocked / Needs Attention
- [ ] CRAFT API key - current key expired, need fresh key from console.anthropic.com

## Decisions Made
- Always respond in Discord channels (no mention required)
- Silent memory writes (no announcements)
- 30-min cooldown on system alerts

## For Tomorrow
- [ ] Get fresh API key for CRAFT bot (priority 1)
- [ ] Test CRAFT building loop end-to-end

## Notes
- JMoon prefers hardcore logic and permanent fixes
- wils working on multiple web projects (ET, CRAFT, Chat-JPT)
- System monitoring catching orphaned dev servers successfully
```

## Example (Good Chat Handover)

```
Wrapping up:

✅ Done:
- Discord connectivity fixed (responds everywhere now)
- Memory Market agent live
- System monitoring running (RAM + orphan servers)
- Memory protocol integrated

🔲 Open:
- CRAFT bot running, needs API key

⚠️ Blocked:
- CRAFT API key expired - needs fresh one from console.anthropic.com

Tomorrow: Get API key first, then test CRAFT building loop.

See you tomorrow 🤙
```

## Example (Bad - too vague)

```
End of day summary:

We did some work on Discord today and got the bot responding better. Also set up some scripts. The CRAFT thing still needs work.

Tomorrow we'll continue.
```
^ Useless. No specifics, no blockers, no priority.
