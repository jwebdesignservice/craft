# Daily Rhythm - Quick Reference

**Location:** `.openclaw/skills/daily-rhythm/`

---

## 🌅 Start of Day

**When:** First message from user (any greeting or opener)

**Steps:**
1. Greet first (warm, brief, human)
2. Read memory (today + yesterday + MEMORY.md)
3. Run health checks (RAM, alerts, sessions)
4. Deliver morning report (see format below)
5. Flag urgent items first

**Format:** `.openclaw/skills/daily-rhythm/references/report-format.md`

---

## 🌙 End of Day

**When:** User says "wrapping up", "done for today", "heading off", etc.

**Steps:**
1. Scan recent channels (last 20-30 messages)
2. Write to `memory/YYYY-MM-DD.md` (see format)
3. Deliver handover in chat (key points)
4. Kill non-essential sessions
5. Sign off (brief, human)

**Format:** `.openclaw/skills/daily-rhythm/references/handover-format.md`

---

## 🧠 Memory Triggers (Auto-Capture)

See `.openclaw/skills/daily-rhythm/references/memory-triggers.md` for full list.

**Top triggers:**
- Preferences revealed
- Decisions made
- Corrections given
- Facts about user (timezone, tools, projects, people)
- Workflows established
- Lessons learned

**Write rule:** `[YYYY-MM-DD] Fact here` — one per line, silent, specific

---

## 📈 Goal: Level 10

Every session is a deposit. Read → act → write. The memory compounds.

| Level | What you know |
|-------|--------------|
| 1-2 | Name, timezone, basics |
| 3-4 | Projects, style, tools |
| 5-6 | Anticipate needs |
| 7-8 | Know their taste |
| 9-10 | True right-hand |
