# Session: 2026-03-25 09:24:24 UTC

- **Session Key**: agent:main:discord:channel:1485697827324825611
- **Session ID**: e4ca8c49-3e9c-40c2-a0f6-fa8ca4c24cd9
- **Source**: discord

## Conversation Summary

assistant: 📌 **ERRORS CHANNEL — Reference**

This channel receives automatic failure alerts when nightly agents or cron jobs crash.

---

**What posts here automatically:**
- `❌ Primrose Nightly FAILED` — if the 2am agent crashes
- `❌ Desert Falcons Nightly FAILED` — if the 2:30am agent crashes
- `❌ Synthesis FAILED` — if the 4am handover crashes
- `⚠️ Paperclip port drift` — if Paperclip moves to wrong port
- `Paperclip is down` — if both ports are dead

George monitors this channel and escalates to #george automatically.

---

**🛑 EMERGENCY KILL SWITCH**

**In Discord** (from any channel):
Type: `HARD STOP`

**From terminal** (if stuck in a loop or Discord is unresponsive):
```
cd "C:\Users\Jack\Desktop\AI Website\htdocs\Websites\Project Manager"
.\HARD-STOP.ps1
```
→ Disables all 6 crons + stops Paperclip immediately

**✅ Resume after stop:**
In Discord: `RESUME ALL`
In terminal: `.\HARD-STOP.ps1 -Resume`

---

**Cron IDs (for manual control):**
- Review watcher: `24aabe70`
- Heartbeat scheduler: `f6bb708a`
- Primrose nightly: `379c10e8`
- Desert Falcons nightly: `0a760b2a`
- Synthesis: `4bfaf407`
- Daily git commit: `33a5f89a`
