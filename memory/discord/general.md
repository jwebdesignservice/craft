# #general - Discord Memory

**Channel:** #general (1471449054373347340)  
**Server:** Guild #general (1471449053220044935)  
**Created:** 2026-02-21

---

## Key People

- **JMoon** (jmoon_174) - Active user, requested persistent memory system
- **wils** (jackwilson7) - Owner, working on multiple web projects

---

## Recent Work

### Discord Bot Integration (Feb 20-21, 2026)
- Set up multiple project channels with agents
- **Chat-JPT project**: Cloned from GitHub
  - Repo: https://github.com/jwebdesignservice/Chat-JPT.git
  - Git integration working
- **meme-zoo channel**: Had issues, was debugged and fixed (1473541578126659689)

### Git Workflow Discovery
- Can run git commands from Discord channels
- Workflow: `git status` → `git add .` → `git commit -m "..."` → `git push`
- GitHub username: jwebdesignservice
- Discussed transferring Cursor projects into OpenClaw workspace

### Memory System (Feb 21, 2026)
- JMoon requested persistent memory across sessions
- Implemented Option 3: Discord-specific memory files
- Structure: `memory/discord/<channel-name>.md`
- Updated AGENTS.md with new memory protocol

### Discord Connectivity Overhaul (Feb 26, 2026)
- **Problem:** Bot wasn't responding in channels without @ mentions
- **Root cause:** AGENTS.md guidance + empty bindings causing confusion
- **Fix implemented:**
  - Removed all channel bindings
  - Set `requireMention: false` globally
  - Rewrote AGENTS.md: "Always respond by default"
  - Cleaned 8 dead channels from config
  - Created SOP.md with connectivity + startup protocols
- **Result:** Bot now responds in ALL channels automatically
- **New mandatory behavior:** Session startup = memory lookback + cache clearing

---

## Workflows & Commands

### Adding New Project to Discord
1. Create/copy project folder to `C:\Users\Jack\Desktop\AI Website\htdocs\Websites\<ProjectName>`
2. Create Discord channel under 🤝 Shared Projects
3. Wire up agent to channel via config.patch
4. Gateway restart

### Git Push from Discord
```bash
git status
git add .
git commit -m "message"
git push
```

---

## Issues & Solutions

**Problem:** Bot not responding in channel  
**Solution:** Check config, verify agent binding, restart gateway

**Problem:** Messages not persisting across sessions  
**Solution:** Implemented Discord memory system (this file!)

---

## Notes

- Messages before 14:54 on Feb 21 were not visible to bot (context window limitation)
- Bot can read channel history via `message` tool with `action=read`
- Auto-reading every message would be expensive; using memory files instead

---

## 2026-03-06 Session

### Token Usage Analysis
- Discussed per-message costs: ~1-2 cents per simple message
- Cache efficiency: 99% hit rate (26k cached, 353 new tokens per message)
- Model: Claude Sonnet 4.5 (switched from Opus 4.6 for cost savings)
- Typical costs: 1-5 cents per message depending on complexity

### Handover Documentation Porting
**Task:** Port Cursor workspace handover concepts to OpenClaw

**Completed:**
1. ✅ **HANDOVER.md created** (14.6KB) - Complete OpenClaw handover guide covering:
   - Session startup protocol
   - Core behaviors (vibe coding, no silent pivots, etc.)
   - Three-layer memory architecture
   - Search & browse protocol
   - Daily rhythm protocols (start/end of day)
   - Project path standardization
   - Heartbeat guidelines
   - Discord configuration
   - Skills & tools reference
   - Security & safety rules
   - Fresh install checklist
   - Differences from Cursor workspace

2. ✅ **PROJECTS.md created** (3.4KB) - Project index tracking:
   - Standard path: `C:\Users\Jack\Desktop\AI Website\htdocs\Websites\<project-name>`
   - Active projects: CRAFT, Memory Market, Chat-JPT, ET, KOL-Vault, Project Manager
   - Deployed projects: 10 Vercel sites
   - Quick commands for project management

3. ✅ **.gitignore verified** - Correct protections in place for MEMORY.md

**Key concepts ported:**
- Learned User Preferences structure (vibe coding, no silent pivots, etc.)
- Learned Workspace Facts structure
- Three-layer memory system (MEMORY.md, daily logs, Discord memory)
- Memory maintenance during heartbeats
- Project path consistency standards

### KOL-Vault Channel Created
- New channel: #🔐〡kol-vault (1479501992547192945)
- Category: 📁 Projects
- Memory file created: `memory/discord/kol-vault.md`
- Ready for build work

### Next Steps
- wils wants fresh OpenClaw install (clean slate)
- Need to create backup strategy for existing projects
- Continue KOL-Vault build in new channel
