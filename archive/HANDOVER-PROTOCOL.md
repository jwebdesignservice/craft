# HANDOVER PROTOCOL — Persistent Continuity Across Resets

## Mandatory Behavior (All Channels, All Sessions)

**Before ANY /compact or /reset command:**
1. Create handover document with current state
2. Save to appropriate location (see below)
3. THEN run /compact or /reset
4. On next session: Read handover, resume work

**This applies EVERYWHERE:**
- Discord channels (all of them)
- Main workspace sessions
- Sub-agent sessions
- Any context reset scenario

---

## Handover File Locations

**Discord channels:**
```
memory/discord/handovers/<channel-name>-<timestamp>.md
```

**Main workspace:**
```
memory/handovers/<timestamp>.md
```

**Sub-agents:**
```
memory/handovers/subagent-<name>-<timestamp>.md
```

---

## Handover Template

```markdown
# Handover — [Channel/Session Name] — [Date Time]

## Context
**Session type:** [Discord channel / Main session / Sub-agent]
**Channel/Location:** [Name and ID if Discord]
**Timestamp:** [ISO 8601 format]

## Current Task
**What we're doing:**
[One paragraph summary of active work]

**Goal:**
[What we're trying to achieve]

## Progress So Far
### Completed
- [x] Item 1
- [x] Item 2

### In Progress
- [ ] Item currently being worked on
  - Sub-detail 1
  - Sub-detail 2

### Blocked
- [ ] Item blocked by X
  - Reason: ...
  - Needs: ...

## Important Context
**Key decisions made:**
- Decision 1 and why
- Decision 2 and why

**Files created/modified:**
- path/to/file1 - what it does
- path/to/file2 - what it does

**Commands run (if relevant):**
```bash
command 1
command 2
```

**External state:**
- GitHub repo status: [pushed/unpushed/clean]
- Deployment status: [deployed/pending/not started]
- Any running processes: [port numbers, PIDs]

## Next Steps
**Immediate (resume from here):**
1. First thing to do
2. Second thing to do
3. Third thing to do

**After that:**
- Longer-term next steps
- Dependencies to resolve

## Questions/Decisions Needed
- Question 1?
- Decision needed on X?

## Handoff Notes
**For next agent/session:**
- Important context note 1
- Important context note 2
- Watch out for: [any gotchas]

---
_Handover created: [timestamp]_
_Session will /compact after this is written_
```

---

## When to Create Handovers

### Automatic Triggers
**Always create handover before:**
- `/compact` command
- `/reset` command
- Context approaching limit (>180k tokens)
- End of work session (user says "wrapping up", "done for today")

### Manual Triggers
**Create handover when:**
- Switching to different task/project
- Handing off to different agent
- User explicitly requests handover
- About to do risky operation (major refactor, deletions)

---

## Workflow

### Before Reset/Compact

**Step 1: Detect trigger**
```
User says: "/compact" OR context > 180k tokens OR "done for today"
```

**Step 2: Create handover**
```
1. Determine location (Discord channel? Main session? Sub-agent?)
2. Generate timestamp: YYYY-MM-DD-HHmm (e.g., 2026-03-12-1534)
3. Write handover using template above
4. Verify file written successfully
```

**Step 3: Announce**
```
✅ Handover created: memory/discord/handovers/kol-vault-2026-03-12-1534.md

Ready to /compact. On next session, I'll read this handover and resume work.
```

**Step 4: Execute reset**
```
Now safe to run /compact or /reset
```

### After Reset/Compact

**Step 1: On session startup**
```
1. Check for recent handover in appropriate location
2. Read most recent handover (within last 24 hours)
3. Load context from handover
```

**Step 2: Announce resumption**
```
📋 Handover loaded from: memory/discord/handovers/kol-vault-2026-03-12-1534.md

Resuming: [task name from handover]
Last state: [progress summary]

Ready to continue from: [next step from handover]
```

**Step 3: Continue work**
```
Pick up exactly where handover left off
Reference handover for context as needed
```

---

## Implementation in AGENTS.md

Add to session startup protocol:

```markdown
### Session Startup (Mandatory)
1. Read SOUL.md
2. Read USER.md  
3. Read AGENTS.md
4. Read memory/YYYY-MM-DD.md (today + yesterday)
5. **NEW: Check for recent handover**
   - If in Discord: `memory/discord/handovers/<channel>-*.md` (last 24h)
   - If main session: `memory/handovers/*.md` (last 24h)
   - If found: Load context, announce resumption
6. Read memory/discord/<channel>.md (if Discord)
7. Read MEMORY.md (if main session)
8. Read TOOLS.md
```

Add to behaviors:

```markdown
### Before Context Resets
**Mandatory pre-reset protocol:**
1. Create handover document (see HANDOVER-PROTOCOL.md)
2. Save to appropriate location
3. Announce handover location
4. THEN run /compact or /reset

**Never skip handover creation** — continuity depends on it.
```

---

## Handover Storage

### Directory Structure

```
memory/
├── YYYY-MM-DD.md              # Daily logs
├── discord/
│   ├── general.md             # Channel memories
│   ├── kol-vault.md
│   └── handovers/             # Discord handovers
│       ├── general-2026-03-12-1534.md
│       ├── kol-vault-2026-03-12-0923.md
│       └── buy-the-whip-2026-03-11-2145.md
└── handovers/                 # Main session handovers
    ├── 2026-03-12-1600.md
    └── subagent-warm-valley-2026-03-12-1430.md
```

### Retention Policy

**Keep handovers for:**
- Last 7 days: All handovers
- 8-30 days: One per day (most recent)
- 30+ days: Archive or delete

**Clean up old handovers:**
```powershell
# Delete handovers older than 30 days
Get-ChildItem "memory/*/handovers/*.md" | 
  Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } | 
  Remove-Item
```

---

## Examples

### Example 1: Discord Channel Compact

**Scenario:** Working in #kol-vault, context getting full

**User says:** "/compact"

**Agent response:**
```
Creating handover before compact...

✅ Handover created: memory/discord/handovers/kol-vault-2026-03-12-1534.md

Context:
- Task: Building KOL-Vault frontend Phase 6
- Progress: 4/9 pages complete (landing, login, register, app shell)
- Next: Leaderboard page

Running /compact now...
```

**After compact, next message:**
```
📋 Handover loaded from: memory/discord/handovers/kol-vault-2026-03-12-1534.md

Resuming KOL-Vault frontend build (Phase 6)
Last state: 4/9 pages complete
Next: Build leaderboard page with purple aesthetic

Ready to continue! 🚀
```

### Example 2: End of Day Handover

**User says:** "I'm done for today, wrapping up"

**Agent response:**
```
Creating end-of-day handover...

✅ Handover created: memory/discord/handovers/buy-the-whip-2026-03-11-2145.md

Summary:
- Completed: Project setup, GitHub repo, cron task
- In progress: Scraper implementation (Dubizzle source 80% done)
- Next session: Complete Dubizzle scraper, test first run

Changes pushed to GitHub ✓

See you tomorrow! 👋
```

### Example 3: Sub-agent Handover

**Scenario:** Spawned sub-agent hits timeout

**Sub-agent before death:**
```
⏱️ Timeout approaching (2 min remaining)

Creating handover before session ends...

✅ Handover: memory/handovers/subagent-warm-valley-2026-03-12-1430.md

Task: KOL-Vault frontend build
Progress: Foundation + 2 pages done
Resume from: Login page form validation

Handover complete. Session ending.
```

**Main agent reads handover:**
```
📋 Sub-agent handover found: warm-valley-2026-03-12-1430.md

Task was: KOL-Vault frontend
Status: Foundation + landing page done, login page 50%
Next: Complete login page validation

Shall I spawn a new sub-agent to continue, or handle it directly?
```

---

## Edge Cases

### Multiple Handovers
**If multiple handovers exist:**
- Use most recent (by timestamp)
- Ignore handovers >24 hours old on startup
- Keep older ones for reference

### Handover Conflicts
**If handover contradicts memory files:**
- Handover wins (most recent state)
- Update memory file with handover info
- Note the conflict in next log entry

### Failed Handover Write
**If handover creation fails:**
- Retry once
- If still fails: Announce failure, do NOT proceed with /compact
- User must manually create handover or approve reset without one

### No Handover Found
**If expected handover missing on startup:**
- Announce: "No recent handover found, loading from memory files"
- Fall back to standard session startup
- Continue normally

---

## Testing the Protocol

### Test 1: Basic Handover
1. Start work on something
2. Run `/compact` (should auto-create handover)
3. Verify handover file exists
4. Next session: Verify handover loaded

### Test 2: Discord Channel Handover
1. Work in a Discord channel
2. Create handover
3. Reset context
4. Send new message in channel
5. Verify bot resumes from handover

### Test 3: End-of-Day Flow
1. Say "done for today"
2. Verify handover created
3. Next day: First message in that channel
4. Verify bot loads yesterday's handover

---

## Success Criteria

✅ Handover created BEFORE every /compact or /reset
✅ Handover includes enough context to resume work
✅ New sessions automatically load recent handovers
✅ Work continues seamlessly across resets
✅ No context lost during compaction
✅ Protocol works in all channels (Discord, main, sub-agents)

---

**This protocol is now MANDATORY for all sessions.**

Update AGENTS.md to enforce it.
