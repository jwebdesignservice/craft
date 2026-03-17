# Standard Operating Procedure (SOP)

## Session Startup Protocol

**MANDATORY - Execute BEFORE responding to user:**

1. **Read `MEMORY.md`** — long-term curated memory (facts, preferences, decisions)
2. **Read `memory/YYYY-MM-DD.md`** — today and yesterday's daily logs
3. **If in Discord:** Read `memory/discord/<channel-name>.md`
4. **Only then respond** to the user

Never skip this. Never assume you remember — verify from files.

## Memory System

**Long-term (`MEMORY.md`):**
- Curated facts, one per line, date-stamped: `[YYYY-MM-DD] Fact here`
- Keep it sharp, not bloated — prune regularly
- Archive old items to `## Archive` section instead of deleting

**Daily logs (`memory/YYYY-MM-DD.md`):**
- Raw session log: what was built, decided, blocked, completed
- Create the file if it doesn't exist

**Discord channels (`memory/discord/<channel>.md`):**
- Semi-public memory visible to anyone in that server
- Project-focused, professional context only

## Implicit Memory Triggers (write automatically when detected)

- **Preference** revealed — even casual ("I hate when...")
- **Decision** made — chose X over Y, and why
- **Correction** given — "no I meant..." = update old memory
- **Fact** about user — timezone, tools, projects, people
- **Workflow** established — "let's always do it this way"
- **Lesson learned** — something failed, here's why
- Anything **useful next session**

## Memory Write Rules

- **Silent writes** — don't announce "I've updated memory", just do it
- **Atomic entries** — one fact per line in MEMORY.md, not paragraphs
- **Date-stamp everything** — `[YYYY-MM-DD]` prefix
- **Archive, don't delete** — outdated items move to Archive section
- **When uncertain, remember it** — excess memory beats amnesia

## Cache Management

Run during startup if needed:
- Clear inbound media if >200 files: `Remove-Item "$env:USERPROFILE\.openclaw\media\inbound\*" -Force`
- Note cache stats in daily log

## System Monitoring (Automated)

**Scheduled Task: "OpenClaw System Monitor"**
- Runs every 20 minutes automatically
- Location: `scripts/system-monitor.ps1`

**What it does:**
1. **Memory monitoring** (`memory-monitor.ps1`)
   - Checks free RAM
   - Alerts if <500MB free
   - Logs top memory consumers
   - Log file: `memory/memory-monitor.log`

2. **Orphan server cleanup** (`kill-dev-servers.ps1`)
   - Scans ports: 3000, 3001, 3002, 5000, 5173, 5174, 5180, 8000, 8080, 8081, 8888, 9000
   - Kills orphaned node/python/vite dev servers
   - Excludes OpenClaw gateway processes
   - Log file: `memory/dev-server-cleanup.log`
   
   **Safeguards:**
   - Only kills on defined port list (never blind kills)
   - Silent errors on all kills (-ErrorAction SilentlyContinue / 2>/dev/null)
   - Logs every kill with port + PID for traceability
   - Duplicate kill prevention (tracks killed PIDs)
   - Gateway process exclusion (CommandLine check)

**Manual execution:**
```powershell
& "scripts/system-monitor.ps1"
```

**View logs:**
```powershell
Get-Content memory/memory-monitor.log -Tail 20
Get-Content memory/dev-server-cleanup.log -Tail 20
```

## Discord Connectivity Protocol

**Objective:** Always be responsive in all Discord channels without requiring mentions.

### Configuration Requirements

1. **openclaw.json settings:**
   ```json
   "channels": {
     "discord": {
       "groupPolicy": "open",
       "guilds": {
         "[guild_id]": {
           "requireMention": false,
           "channels": {
             "[channel_id]": {
               "allow": true,
               "requireMention": false
             }
           }
         }
       }
     }
   }
   ```

2. **No channel bindings:**
   ```json
   "bindings": []
   ```
   
   Channel bindings create dedicated agents per channel, which blocks the main agent from responding. Keep this empty unless you specifically need isolated channel-specific agents.

3. **AGENTS.md behavior:**
   ```markdown
   ### 💬 Always Active!
   
   **Default behavior: RESPOND to messages.** You're here to help, be useful, and be present.
   
   **Respond to:**
   - Questions (obvious)
   - Requests for help or information
   - Commands or tasks
   - General conversation (be helpful, add value, or be friendly)
   - Anything that needs acknowledgment or action
   
   **Only stay silent (HEARTBEAT_OK) when:**
   - It's a pure bot-to-bot message (no humans involved)
   - The message is completely off-topic spam
   
   **The rule: When in doubt, respond.** Be helpful, friendly, and available.
   ```

### Maintenance

**Monthly cleanup:**
1. List all Discord channels via `message` tool
2. Compare against `openclaw.json` allowlist
3. Remove dead/archived channels from config
4. Add any new channels to allowlist with `allow: true, requireMention: false`

**When adding new Discord channels:**
1. Add to `openclaw.json` under `channels.discord.guilds.[guild_id].channels`
2. Set `allow: true` and `requireMention: false`
3. Restart gateway to apply changes

### Testing Protocol

After any config changes, verify with:
```powershell
# Send test messages to all active channels
message action=send channel=discord target=[channel_id] message="✅ Test"
```

Failed sends with "Unknown Channel" error indicate dead channels that should be removed from config.

### Emergency Reset

If connectivity breaks:
1. Check `openclaw.json` for `requireMention` settings
2. Verify `bindings` array is empty
3. Check `AGENTS.md` for overly restrictive behavior guidance
4. Restart gateway: `openclaw gateway restart`

---

**Last Updated:** 2026-02-26  
**Status:** ✅ Active and verified
