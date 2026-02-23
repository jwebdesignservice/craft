# #general - Discord Memory

**Channel:** #general (1471449054373347340)  
**Server:** Guild #general (1471449053220044935)  
**Created:** 2026-02-21

---

## Key People

- **JMoon** (jmoon_174) - Active user, requested persistent memory system
- **wils** (jackwilson7) - Owner, working on ET and Chat-JPT projects

---

## Recent Work

### Discord Bot Integration (Feb 20-21, 2026)
- Set up multiple project channels with agents
- **ET project**: Originally "ET SCAN" → renamed to "ET"
  - Workspace: `C:\Users\Jack\Desktop\AI Website\htdocs\Websites\ET`
  - Channel: #et (1474404123993571492)
  - Git integration working
- **Chat ET project**: Cloned from GitHub
  - Repo: https://github.com/jwebdesignservice/Chat-JPT.git
  - Channel: #chat-et
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
